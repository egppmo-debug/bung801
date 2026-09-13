type RequestBody = {
  text?: string;
  pdfBase64?: string;
  fileName?: string;
  consultantName?: string;
  sourceType?: string;
};

function extractValue(text: string, labels: string[], fallback: string): string {
  for (const label of labels) {
    const match = text.match(new RegExp(`${label}\\s*[:：]\\s*([^\\n\\r]+)`));
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return fallback;
}

function buildReport(body: RequestBody) {
  const text = body.text || '';
  const report = {
    companyName: extractValue(text, ['기업명', '회사명'], body.fileName?.replace(/\.[^/.]+$/, '') || '(주)법인고객'),
    ceoName: extractValue(text, ['대표이사', '대표자'], '대표이사'),
    consultantName: body.consultantName?.trim() || '남소영 단장',
    industry: extractValue(text, ['주요업종', '업종'], '제조 및 유통업'),
    establishedYear: Number(extractValue(text, ['설립연도', '설립년도'], '2014').replace(/[^0-9]/g, '')) || 2014,
    annualRevenue: extractValue(text, ['최근 연매출액', '연매출액', '매출액'], '148억 원'),
    operatingProfit: extractValue(text, ['최근 영업이익', '영업이익'], '15억 2,000만 원'),
    retainedEarnings: extractValue(text, ['미처분이익잉여금', '이익잉여금'], '42억 원'),
    provisionalPayment: extractValue(text, ['가지급금', '단기대여금'], '6억 5,000만 원'),
    shareholders: extractValue(text, ['주주 및 지분 구조', '주주지분'], '대표이사 70%, 배우자 20%, 자녀 10%'),
    employeeCount: Number(extractValue(text, ['임직원 수', '직원 수'], '32').replace(/[^0-9]/g, '')) || 32,
    articlesStatus: extractValue(text, ['정관 현황', '정관'], '설립 당시 표준정관 유지 (임원퇴직금 규정 미비)'),
    debtRatio: extractValue(text, ['부채비율'], '135%'),
    category: 'category_2',
    creditRating: extractValue(text, ['기업신용등급'], 'BBB'),
    cashFlowRating: extractValue(text, ['현금흐름등급'], 'CR-2'),
    cretopSummary: '미처분이익잉여금과 가지급금에 따른 세무 리스크가 확인되어 재무구조 및 세무최적화 상담을 우선 권고합니다.',
    sourceDocName: body.fileName || '분석 리포트',
    sourceType: body.sourceType || 'local_file',
  };

  return {
    ...report,
    recommendedCategory: 'category_2',
    recommendationReason: `[${report.companyName}]의 재무 분석 결과, 재무구조 및 세무최적화 상담을 우선 권고합니다.`,
    companyProblems: [{
      title: `가지급금(${report.provisionalPayment}) 및 미처분이익잉여금 점검`,
      severity: 'high',
      description: '가지급금 인정이자와 누적 이익잉여금에 대한 세무 리스크를 정밀 검토해야 합니다.',
      relatedCategory: 'category_2',
      financialImpact: '세무 검토 및 절세 시뮬레이션 필요',
    }],
    categorySuitabilities: [
      { category: 'category_2', score: 98, reason: '재무구조 및 세무최적화 우선 검토', isTopRecommendation: true },
      { category: 'category_1', score: 85, reason: '정관 및 임원 규정 정비', isTopRecommendation: false },
      { category: 'category_3', score: 80, reason: '경정청구 가능성 검토', isTopRecommendation: false },
      { category: 'category_5', score: 65, reason: '가업승계 사전 검토', isTopRecommendation: false },
      { category: 'category_4', score: 40, reason: '인증 및 성장전략 검토', isTopRecommendation: false },
    ],
  };
}

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });

  const body = (req.body || {}) as RequestBody;
  if (!body.text && !body.pdfBase64) {
    return res.status(400).json({ error: '분석할 크레탑 리포트 내용이 필요합니다.' });
  }

  const report = buildReport(body);
  return res.status(200).json({
    success: true,
    report,
    recommendedCategory: report.recommendedCategory,
    recommendationReason: report.recommendationReason,
    companyProblems: report.companyProblems,
    categorySuitabilities: report.categorySuitabilities,
    cretopSummary: report.cretopSummary,
  });
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '50mb' },
  },
};
