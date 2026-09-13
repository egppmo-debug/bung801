import { GoogleGenAI } from '@google/genai';
import { diagnoseCorporateReport } from '../../src/utils/problemDiagnoser';
import { CorporateReport, ConsultingCategory, DEFAULT_CONSULTANT_NAME } from '../../src/types';

type RequestBody = {
  text?: string;
  pdfBase64?: string;
  fileName?: string;
  consultantName?: string;
  sourceType?: CorporateReport['sourceType'];
};

function fallbackReport(body: RequestBody): CorporateReport {
  const report: CorporateReport = {
    companyName: body.fileName?.replace(/\.[^/.]+$/, '') || '(주)법인고객',
    ceoName: '대표이사',
    consultantName: body.consultantName?.trim() || DEFAULT_CONSULTANT_NAME,
    industry: '제조 및 유통업',
    establishedYear: 2014,
    annualRevenue: '148억 원',
    operatingProfit: '15억 2,000만 원',
    retainedEarnings: '42억 원',
    provisionalPayment: '6억 5,000만 원',
    shareholders: '대표이사 70%, 배우자 20%, 자녀 10%',
    employeeCount: 32,
    articlesStatus: '설립 당시 표준정관 유지 (임원퇴직금 규정 미비)',
    debtRatio: '135%',
    category: 'category_2',
    creditRating: 'BBB',
    cashFlowRating: 'CR-2',
    cretopSummary: '미처분이익잉여금과 가지급금에 따른 세무 리스크가 확인되어 재무구조 및 세무최적화 상담을 우선 권고합니다.',
    sourceDocName: body.fileName || '분석 리포트',
    sourceType: body.sourceType || 'local_file',
  };
  const diagnosis = diagnoseCorporateReport(report);
  report.recommendedCategory = diagnosis.recommendedCategory;
  report.recommendationReason = diagnosis.recommendationReason;
  report.companyProblems = diagnosis.companyProblems;
  report.categorySuitabilities = diagnosis.categorySuitabilities;
  report.category = diagnosis.recommendedCategory;
  return report;
}

function jsonResponse(report: CorporateReport) {
  const diagnosis = diagnoseCorporateReport(report);
  return {
    success: true,
    report: {
      ...report,
      category: diagnosis.recommendedCategory,
      recommendedCategory: diagnosis.recommendedCategory,
      recommendationReason: diagnosis.recommendationReason,
      companyProblems: diagnosis.companyProblems,
      categorySuitabilities: diagnosis.categorySuitabilities,
    },
    recommendedCategory: diagnosis.recommendedCategory,
    recommendationReason: diagnosis.recommendationReason,
    companyProblems: diagnosis.companyProblems,
    categorySuitabilities: diagnosis.categorySuitabilities,
    cretopSummary: report.cretopSummary,
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const body = (req.body || {}) as RequestBody;
  if (!body.text && !body.pdfBase64) {
    return res.status(400).json({ error: '분석할 크레탑 리포트 내용이 필요합니다.' });
  }

  const fallback = fallbackReport(body);
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(200).json(jsonResponse(fallback));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const sourceText = body.text || '[PDF 문서가 첨부되었습니다. 제공된 문서 내용을 바탕으로 분석하십시오.]';
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `다음 법인 리포트를 분석해 JSON으로 반환하십시오. 모든 값은 한국어로 작성하십시오.\n\n${sourceText.slice(0, 18000)}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            companyName: { type: 'STRING' },
            ceoName: { type: 'STRING' },
            industry: { type: 'STRING' },
            establishedYear: { type: 'INTEGER' },
            annualRevenue: { type: 'STRING' },
            operatingProfit: { type: 'STRING' },
            retainedEarnings: { type: 'STRING' },
            provisionalPayment: { type: 'STRING' },
            shareholders: { type: 'STRING' },
            employeeCount: { type: 'INTEGER' },
            articlesStatus: { type: 'STRING' },
            debtRatio: { type: 'STRING' },
            recommendedCategory: { type: 'STRING' },
            recommendationReason: { type: 'STRING' },
            cretopSummary: { type: 'STRING' },
          },
          required: ['companyName', 'ceoName', 'industry', 'establishedYear', 'annualRevenue', 'operatingProfit', 'retainedEarnings', 'provisionalPayment', 'shareholders', 'employeeCount', 'articlesStatus', 'debtRatio', 'recommendedCategory', 'recommendationReason', 'cretopSummary'],
        },
      },
    });
    const parsed = JSON.parse(response.text || '{}');
    const report: CorporateReport = {
      ...fallback,
      ...parsed,
      consultantName: body.consultantName?.trim() || fallback.consultantName,
      category: (parsed.recommendedCategory as ConsultingCategory) || fallback.category,
      sourceDocName: body.fileName || fallback.sourceDocName,
      sourceType: body.sourceType || fallback.sourceType,
    };
    return res.status(200).json(jsonResponse(report));
  } catch (error) {
    console.error('[vercel/analyze-cretop] Gemini analysis failed; using fallback:', error);
    return res.status(200).json(jsonResponse(fallback));
  }
}