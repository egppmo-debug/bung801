import { ConsultingCategory, CorporateReport, CompanyProblem, CategorySuitability } from '../types';
import { CATEGORY_INFO } from '../data/sampleReports';

export interface DiagnosisResult {
  recommendedCategory: ConsultingCategory;
  recommendationReason: string;
  topProblemTitle: string;
  companyProblems: CompanyProblem[];
  categorySuitabilities: CategorySuitability[];
}

// Helper to parse Korean monetary strings (e.g. "148억 원", "6억 5,000만 원", "35억") into rough 억 (100 million KRW)
function parseBillionWon(str: string): number {
  if (!str) return 0;
  let total = 0;
  const clean = str.replace(/,/g, '');
  const matchBillion = clean.match(/(\d+(\.\d+)?)\s*억/);
  if (matchBillion) {
    total += parseFloat(matchBillion[1]);
  }
  const matchTenMillion = clean.match(/(\d+)\s*만/);
  if (matchTenMillion) {
    total += parseFloat(matchTenMillion[1]) / 10000;
  }
  if (total === 0) {
    const numOnly = parseFloat(clean.replace(/[^\d.]/g, ''));
    if (!isNaN(numOnly) && numOnly > 0) {
      if (numOnly > 10000) total = numOnly / 100000000;
      else total = numOnly;
    }
  }
  return total;
}

/**
 * 기업의 재무제표 및 비재무 데이터를 정밀 분석하여
 * 당면한 핵심 세무·경영 리스크(당면 과제)와 5대 카테고리 중 최적 상담 과제를 판별합니다.
 */
export function diagnoseCorporateReport(report: Partial<CorporateReport>): DiagnosisResult {
  const companyName = report.companyName || '해당 법인';
  const retainedWon = parseBillionWon(report.retainedEarnings || '');
  const provWon = parseBillionWon(report.provisionalPayment || '');
  const revenueWon = parseBillionWon(report.annualRevenue || '');
  const profitWon = parseBillionWon(report.operatingProfit || '');
  const articles = report.articlesStatus || '';
  const shareholders = report.shareholders || '';
  const note = (report.customNote || '') + ' ' + (report.cretopSummary || '');
  const employees = report.employeeCount || 0;
  const currentYear = new Date().getFullYear();
  const establishedYear = report.establishedYear || currentYear - 10;
  const businessYears = currentYear - establishedYear;

  const problems: CompanyProblem[] = [];

  // 1. 가지급금 분석 (카테고리 2의 핵심)
  const hasSignificantProv = provWon >= 1 || /가지급금|대여금/.test(note) || /가지급금/.test(report.provisionalPayment || '');
  if (hasSignificantProv) {
    const interestPerYear = Math.round(provWon * 0.046 * 10000); // 만원 단위
    const interestText = interestPerYear > 0 ? `매년 약 ${interestPerYear.toLocaleString()}만 원` : '매년 수천만 원';
    problems.push({
      title: `결산서상 가지급금(${report.provisionalPayment || `${provWon}억 원`})에 따른 4.6% 정기 인정이자 및 상여 처분 리스크`,
      severity: 'critical',
      description: `법인세법 제52조에 따라 가지급금에 대해 ${interestText}의 인정이자가 익금산입되어 대표이사 상여(근로소득세 최고세율 49.5% 누진)로 과세되며, 법인 차입금 지급이자 손금불산입의 이중 페널티가 발생합니다.`,
      relatedCategory: 'category_2',
      financialImpact: `${interestText} 소득세 및 법인세 추가 납부 부담`
    });
  }

  // 2. 미처분이익잉여금 분석 (카테고리 2 & 5의 핵심)
  const hasHighRetained = retainedWon >= 20 || profitWon >= 10 || /잉여금/.test(note);
  if (hasHighRetained) {
    problems.push({
      title: `누적 미처분이익잉여금(${report.retainedEarnings || `${retainedWon}억 원`})으로 인한 비상장주식 가치 폭등 및 상속세 50% 과표 직격탄`,
      severity: retainedWon >= 35 ? 'critical' : 'high',
      description: `상증세법상 비상장주식 보충적 평가 시 잉여금이 순자산가치에 전액 반영되어 주당 주가가 액면가의 수십 배로 급등합니다. 대표 유고 시 주식 상속세율 50%가 적용되어 경영권 방어가 위협받습니다.`,
      relatedCategory: 'category_2',
      financialImpact: `대표 유고 또는 지분 이전 시 수십억 원 상당 상속·증여세 예상`
    });
  }

  // 3. 정관 및 제도 정비 (카테고리 1)
  const hasArticleDefect = 
    /원시정관|표준정관|미비|부재|없음|오래됨|수기|유지/.test(articles) ||
    /정관|임원퇴직금|지급규정/.test(note) ||
    articles.length < 5;
  if (hasArticleDefect) {
    problems.push({
      title: '정관 내 임원 퇴직금·유족보상 지급규정 부재에 따른 전액 손금불산입 리스크',
      severity: 'critical',
      description: '상법 제388조 및 법인세법 시행령 제44조에 따른 주주총회 특별결의 규정이 없는 상태에서 임원 퇴직금을 지급할 경우, 전액 손금불산입 및 최대 49.5%의 근로소득세가 추징되는 중대 과세 리스크가 상존합니다.',
      relatedCategory: 'category_1',
      financialImpact: '퇴직금 손금 인정 불가 시 법인세 절세 효과 상실 및 소득세 누진 추징'
    });
  }

  // 4. 가업승계 및 2세 자산 이전 (카테고리 5)
  const isSuccessionUrgent = 
    businessYears >= 15 || 
    /자녀|가업승계|상속|증여|은퇴|나이|고령|승계|후계자/.test(shareholders + ' ' + note) ||
    (shareholders.includes('자녀') && businessYears >= 10);
  if (isSuccessionUrgent) {
    problems.push({
      title: `설립 ${businessYears}년차 기업의 가업승계 사전 플랜(가업상속공제 600억 / 증여특례 10%) 미비`,
      severity: businessYears >= 20 || /은퇴|나이|6[0-9]세|7[0-9]세/.test(note) ? 'critical' : 'high',
      description: '조특법 제30조의5 증여세 과세특례(10% 저율 분리과세) 및 상증세법 제18조의2 가업상속공제는 5~10년 전부터 지분 구조와 고용 요건을 사전 설계해야 사후 추징 없이 수백억 원의 세금을 감면받을 수 있습니다.',
      relatedCategory: 'category_5',
      financialImpact: '사전 승계 플랜 부재 시 최대 600억 공제 혜택 박탈 위험'
    });
  }

  // 5. 경정청구 세금환급 (카테고리 3)
  const hasRefundPotential = 
    employees >= 15 || 
    /고용|환급|경정청구|세액공제|누락/.test(note) ||
    (revenueWon >= 50 && businessYears >= 5);
  if (hasRefundPotential) {
    problems.push({
      title: '최근 5개년 고용증대·통합고용 세액공제 미적용에 따른 과오납 세금 소멸 위기',
      severity: 'high',
      description: '국세기본법 제45조의2에 따른 경정청구는 5년이 경과하면 제척기간 만료로 과오납된 세금을 영구히 돌려받을 수 없습니다. 상시근로자가 증가했음에도 일반 기장 세무대리인의 공제 누락으로 수천만~수억 원이 과오납되어 있을 가능성이 높습니다.',
      relatedCategory: 'category_3',
      financialImpact: '5개년 경정청구 시 약 5,000만~1억 8,000만 원 법인통장 환급 가능'
    });
  }

  // 6. R&D 인증 및 기업가치 (카테고리 4)
  const hasRndOpportunity = 
    /제조|IT|소프트웨어|센서|바이오|연구소|벤처|인증|M&A|투자/.test(report.industry || '' + note);
  if (hasRndOpportunity && problems.length < 4) {
    problems.push({
      title: '기업부설연구소 사후관리 컴플라이언스 및 벤처·이노비즈 인증 관리 취약',
      severity: 'medium',
      description: '연구개발전담부서 또는 벤처인증 갱신 관리가 소홀할 경우 기 적용받은 R&D 세액공제 추징 및 정책금융 우대금리 취소, 기업가치(Valuation) 저평가 위험이 있습니다.',
      relatedCategory: 'category_4',
      financialImpact: 'R&D 세액공제 추징 및 법인세 50% 감면 혜택 상실 우려'
    });
  }

  // Ensure at least 2 problems exist
  if (problems.length === 0) {
    problems.push({
      title: '비상장주식 시가 평가 관리 부재 및 임원 퇴직금 규정 정비 시급',
      severity: 'high',
      description: '정관 및 임원보수 규정 정비가 선행되지 않으면 세무조사 시 비용 부인 및 불필요한 법인세 누수가 지속됩니다.',
      relatedCategory: 'category_1',
      financialImpact: '임원 보수 손금불산입 및 세무조사 리스크'
    });
    problems.push({
      title: '누적 이익잉여금 처분 및 대표 자산 포트폴리오 최적화 필요',
      severity: 'high',
      description: '법인의 잉여금을 합법적으로 배당 또는 자사주 소각을 통해 유출시키지 않으면 주가 상승으로 상속세 부담이 커집니다.',
      relatedCategory: 'category_2',
      financialImpact: '미처분 잉여금 누적으로 인한 주가 급등'
    });
  }

  // Calculate scores for each of the 5 categories (0 ~ 100)
  const scores: Record<ConsultingCategory, { score: number; reason: string }> = {
    category_1: { score: 50, reason: '임원보수·퇴직금 규정 주총 정비 및 노무 리스크 예방' },
    category_2: { score: 50, reason: '잉여금 출구전략 및 가지급금 4.6% 인정이자 일거 정리' },
    category_3: { score: 45, reason: '고용증대세액공제 등 지난 5개년 과오납 법인세 정밀 환급' },
    category_4: { score: 40, reason: '기업부설연구소 및 벤처/이노비즈 인증을 통한 기업가치 제고' },
    category_5: { score: 45, reason: '비상장주식 보충적 평가액 관리 및 가업승계 600억 공제 플랜' },
  };

  // Score adjustments based on findings:
  // Category 2 boosts
  if (provWon >= 1) {
    scores.category_2.score += 35;
    scores.category_2.reason = `가지급금(${report.provisionalPayment || `${provWon}억 원`})에 따른 매년 4.6% 인정이자 및 대표자 상여 소득세 가산이 가장 시급`;
  }
  if (retainedWon >= 25) {
    scores.category_2.score += 25;
    scores.category_5.score += 20;
    if (scores.category_2.score < 90) {
      scores.category_2.reason = `누적 잉여금(${report.retainedEarnings || `${retainedWon}억 원`})으로 주가 폭등, 자사주 이익소각을 통한 출구전략 최우선`;
    }
  }

  // Category 1 boosts
  if (hasArticleDefect) {
    scores.category_1.score += 35;
    scores.category_1.reason = '정관 내 임원 퇴직금 규정 부재 및 원시정관으로 대표 퇴직 시 손금불산입 위험 직격탄';
  }

  // Category 5 boosts
  if (businessYears >= 15 || /가업승계|상속|증여|은퇴|나이|고령/.test(note + shareholders)) {
    scores.category_5.score += 40;
    scores.category_5.reason = `설립 ${businessYears}년차 기업으로 대표 유고 전 가업상속공제(600억) 및 증여세 과세특례 사전 설계 시급`;
  }

  // Category 3 boosts
  if (employees >= 20 || /고용|환급|경정청구/.test(note)) {
    scores.category_3.score += 35;
    scores.category_3.reason = `임직원 ${employees}명 규모로 지난 5개년 고용증대·통합고용 세액공제 누락분 국세기본법 제45조의2 환급 기회`;
  }

  // Category 4 boosts
  if (/연구소|벤처|인증|M&A|투자/.test(report.industry || '' + note)) {
    scores.category_4.score += 30;
    scores.category_4.reason = '기업부설연구소 R&D 세액공제 사후관리 및 이노비즈 재인증을 통한 기업가치 극대화';
  }

  // Explicit user override or report hint
  if (report.recommendedCategory && scores[report.recommendedCategory]) {
    scores[report.recommendedCategory].score = Math.max(scores[report.recommendedCategory].score, 95);
  }

  // Find top category
  const sortedCategories = (Object.keys(scores) as ConsultingCategory[]).sort(
    (a, b) => scores[b].score - scores[a].score
  );

  const topCat = sortedCategories[0];
  const topReason = scores[topCat].reason;

  const categorySuitabilities: CategorySuitability[] = (Object.keys(scores) as ConsultingCategory[]).map((cat) => ({
    category: cat,
    score: Math.min(Math.round(scores[cat].score), 98),
    reason: scores[cat].reason,
    isTopRecommendation: cat === topCat,
  })).sort((a, b) => b.score - a.score);

  const topProblem = problems[0]?.title || '재무구조 최적화 및 세무 리스크 예방';

  // Comprehensive recommendation narrative
  const catDetails = CATEGORY_INFO[topCat] || CATEGORY_INFO.category_2;
  const recommendationReason = `[${companyName}]의 재무 분석 결과, ${topReason}. 따라서 한화피플라이프 대전글로리사업단 컨설턴트가 대표이사 면담 시 최우선으로 제안해야 할 핵심 상담 과제로 [${catDetails.code}: ${catDetails.name}]을 강력 추천합니다.`;

  return {
    recommendedCategory: topCat,
    recommendationReason,
    topProblemTitle: topProblem,
    companyProblems: problems,
    categorySuitabilities,
  };
}
