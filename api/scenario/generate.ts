import { createResilientScenario } from '../../src/data/fallbackScenarioGenerator';
import { CorporateReport } from '../../src/types';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const report = req.body?.report as CorporateReport | undefined;
  if (!report?.companyName?.trim() || !report.category) {
    return res.status(400).json({ error: '유효한 법인 분석 리포트 데이터가 필요합니다.' });
  }

  try {
    const scenario = createResilientScenario(report);
    return res.status(200).json({ scenario });
  } catch (error) {
    console.error('[vercel/scenario-generate] Scenario generation failed:', error);
    return res.status(500).json({ error: '시나리오 생성 중 오류가 발생했습니다.' });
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
  },
};
