export type ConsultingCategory =
  | 'category_1' // 경영 효율화 및 제도 정비
  | 'category_2' // 재무구조 및 세무최적화
  | 'category_3' // 경정청구(세금환급)
  | 'category_4' // 미래 성장 및 인증 / M&A
  | 'category_5'; // 가업 승계 및 자산 이전

export const DEFAULT_CONSULTANT_NAME = '남소영 단장';

export type ProblemSeverity = 'critical' | 'high' | 'medium';

export interface CompanyProblem {
  title: string;
  severity: ProblemSeverity; // 'critical' (시급한 세무/법적 리스크), 'high' (주의/손실 우려), 'medium' (성장/제도 개선)
  description: string;
  relatedCategory: ConsultingCategory;
  financialImpact?: string; // 예: "연간 3,000만 원 인정이자 누진소득세 추징"
}

export interface CategorySuitability {
  category: ConsultingCategory;
  score: number; // 0 ~ 100
  reason: string;
  isTopRecommendation: boolean;
}

export interface CorporateReport {
  companyName: string;
  ceoName: string;
  consultantName: string; // 컨설턴트 이름 (기본: 남소영 단장)
  industry: string;
  establishedYear: number;
  annualRevenue: string; // 예: "120억 원"
  operatingProfit: string; // 예: "14억 원"
  retainedEarnings: string; // 예: "38억 원" (미처분이익잉여금)
  provisionalPayment: string; // 예: "6억 5,000만 원" (가지급금)
  shareholders: string; // 예: "대표이사 70%, 배우자 20%, 자녀 10%"
  employeeCount: number; // 예: 35명
  articlesStatus: string; // 예: "2010년 설립 당시 표준정관 그대로, 임원퇴직금 규정 부재"
  debtRatio: string; // 예: "145%"
  category: ConsultingCategory;
  customNote?: string;
  creditRating?: string; // 크레탑 기업신용등급 (예: BBB-, A 등)
  cashFlowRating?: string; // 크레탑 현금흐름등급 (예: CR-2 등)
  cretopSummary?: string; // 크레탑 리포트 종합 분석 요약
  sourceDocName?: string; // 원본 구글문서 / PDF 파일명
  sourceType?: 'google_drive' | 'local_file' | 'manual' | 'sample';
  recommendedCategory?: ConsultingCategory; // AI 진단 최우선 추천 카테고리
  recommendationReason?: string; // AI가 이 카테고리를 최우선으로 추천한 상세 사유
  companyProblems?: CompanyProblem[]; // 리포트 분석을 통해 도출된 회사의 2~4개 핵심 당면 과제/리스크
  categorySuitabilities?: CategorySuitability[]; // 5대 카테고리별 적합도 및 순위 분석
}

export const createEmptyReport = (category: ConsultingCategory = 'category_2', consultantName: string = DEFAULT_CONSULTANT_NAME): CorporateReport => ({
  companyName: '',
  ceoName: '',
  consultantName: consultantName || DEFAULT_CONSULTANT_NAME,
  industry: '',
  establishedYear: new Date().getFullYear() - 10,
  annualRevenue: '',
  operatingProfit: '',
  retainedEarnings: '',
  provisionalPayment: '',
  shareholders: '',
  employeeCount: 0,
  articlesStatus: '',
  debtRatio: '',
  category,
  customNote: '',
});

export type ScenarioStage = 1 | 2 | 3 | 4;

export interface DialogueTurn {
  turnNumber: number;
  stage: ScenarioStage; // 1: 라포/브리핑, 2: 리스크분석, 3: 솔루션/반론해명, 4: 실행절차/미팅확정
  stageName: string;
  speaker: 'consultant' | 'ceo';
  speakerTitle: string; // "한화피플라이프 컨설턴트" or "대표이사"
  emotion?: string; // 상황/말투 지문 (예: "차분하고 확신에 찬 어조로 리포트를 짚으며")
  content: string; // 실제 발화 대사 (TTS 친화적 고품질 구어체)
  legalKeywords?: string[]; // 관련 법조문/세법 키워드 (예: ["상법 제388조", "소득세법 시행령 제43조"])
  keyPointSummary?: string; // 이 턴에서 컨설턴트가 전달해야 할 핵심 포인트
}

export interface ScenarioAnalysis {
  riskSummary: {
    title: string;
    description: string;
    estimatedTaxOrLoss: string;
  }[];
  legalBases: {
    law: string;
    summary: string;
  }[];
  solutionSteps: string[];
  nextMeetingChecklist: string[];
}

export type ConsultingAnalysis = ScenarioAnalysis;

export interface GeneratedScenario {
  id: string;
  createdAt: string;
  report: CorporateReport;
  category: ConsultingCategory;
  categoryTitle: string;
  dialogueTurns: DialogueTurn[];
  analysis: ScenarioAnalysis;
  consultantLiveNotes?: string;
}
