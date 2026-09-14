import { CorporateReport, GeneratedScenario, ConsultingCategory, DialogueTurn, ScenarioAnalysis } from '../types';
import { CATEGORY_INFO } from './sampleReports';

export function createResilientScenario(report: CorporateReport): GeneratedScenario {
  const categoryKey: ConsultingCategory = (report.category as ConsultingCategory) || 'category_2';
  const catInfo = CATEGORY_INFO[categoryKey] || CATEGORY_INFO.category_2;
  const company = (report.companyName || '주식회사 법인고객').trim();
  const ceo = report.ceoName ? `${report.ceoName} 대표님` : '대표님';
  const consultant = (report.consultantName || '남소영 단장').trim();
  const rev = report.annualRevenue || '145억 원';
  const profit = report.operatingProfit || '15억 원';
  const retained = report.retainedEarnings || '42억 원';
  const prov = report.provisionalPayment || '5억 8,000만 원';
  const employees = report.employeeCount || 35;
  const establishedYear = report.establishedYear || 2012;

  let turns: DialogueTurn[] = [];
  let analysis: ScenarioAnalysis;

  switch (categoryKey) {
    case 'category_1':
      turns = createCategory1Turns(company, ceo, consultant, rev, profit, retained, establishedYear);
      analysis = createCategory1Analysis(company, ceo, establishedYear);
      break;
    case 'category_3':
      turns = createCategory3Turns(company, ceo, consultant, rev, profit, employees, establishedYear);
      analysis = createCategory3Analysis(company, employees);
      break;
    case 'category_4':
      turns = createCategory4Turns(company, ceo, consultant, rev, profit, employees, report.industry || '정밀 제조업');
      analysis = createCategory4Analysis(company, report.industry || '정밀 제조업');
      break;
    case 'category_5':
      turns = createCategory5Turns(company, ceo, consultant, rev, profit, retained, establishedYear, report.shareholders || '대표이사 80%, 자녀 20%');
      analysis = createCategory5Analysis(company, retained);
      break;
    case 'category_2':
    default:
      turns = createCategory2Turns(company, ceo, consultant, rev, profit, retained, prov);
      analysis = createCategory2Analysis(company, retained, prov);
      break;
  }

  return {
    id: `scenario_${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    report,
    category: categoryKey,
    categoryTitle: catInfo.name,
    analysis,
    dialogueTurns: turns,
  };
}

/* =========================================================================
   CATEGORY 1: 경영 효율화 및 제도 정비 (정관 / 임원퇴직금 규정 / 노무 리스크)
   ========================================================================= */
function createCategory1Turns(company: string, ceo: string, consultant: string, rev: string, profit: string, retained: string, establishedYear: number): DialogueTurn[] {
  return [
    {
      turnNumber: 1,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '정중하고 신뢰감 있는 미소로 명함을 건네며',
      content: `안녕하십니까, ${ceo}. 한화피플라이프 대전글로리사업단 ${consultant}입니다. 바쁘신 경영 일정 중에도 귀한 시간 내어주셔서 진심으로 감사드립니다. 들어오면서 사업장과 제조 시설을 둘러보았는데 현장 엔지니어분들의 몰입도가 대단하더군요. 대표님의 탁월한 현장 경영 철학이 사옥 곳곳에 그대로 배어있음을 느꼈습니다.`,
      legalKeywords: ['기업신용분석', '크레탑(CRETOP)', '경영효율화'],
      keyPointSummary: '정중한 인사와 사업장 분위기 경청 및 존중을 통한 신뢰 라포 형성'
    },
    {
      turnNumber: 2,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '따뜻한 차를 권하며 다소 관망하는 표정으로',
      content: `어서 오세요, ${consultant}. 요새 법인 컨설팅이다 뭐다 해서 하루에도 몇 통씩 제안 전화가 오는데, 솔직히 저희는 ${establishedYear}년 창업 이래 담당 세무사와 회계 처리를 워낙 투명하게 해왔습니다. 노무사나 변호사도 정기 자문을 받고 있어서 회사 정관이나 제도상에 별다른 구멍은 없을 텐데요.`,
      legalKeywords: ['기장세무사', '정기세무결산', '노무자문'],
      keyPointSummary: '기존 자문 네트워크에 대한 자부심과 일반 외판 영업에 대한 경계심 표출'
    },
    {
      turnNumber: 3,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '바인더에서 크레탑 정밀 분석 리포트를 펼쳐 보이며',
      content: `대표님 말씀이 전적으로 맞습니다. 저희 대전글로리사업단에서도 오늘 방문에 앞서 한국평가데이터 크레탑(CRETOP) 공식 법인 리포트를 통해 ${company}의 최근 3개년 결산 재무제표를 면밀히 분석했습니다. 연매출 ${rev}, 영업이익 ${profit}을 탄탄히 유지하시며 동종 업계 상위 10%의 초우량 경영 지표를 증명하고 계십니다. 다만 법인 등기부와 공시 규정을 대조해 본 결과, 10여 년 전 설립 초기에 제정된 원시 표준정관을 지금까지 단 한 번도 개정하지 않고 그대로 유지하고 계신 치명적 공백이 발견되었습니다.`,
      legalKeywords: ['크레탑 공식분석', '원시정관', '상법 개정 미반영'],
      keyPointSummary: '공식 재무 성과 인정 및 설립 초기 원시정관 방치 문제점 객관적 브리핑'
    },
    {
      turnNumber: 4,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '정관 복사본과 리포트를 들여다보며 살짝 고개를 갸웃거리며',
      content: `허허, 법무사가 회사 세울 때 표준양식으로 만들어준 정관인데, 10년 넘게 세무서나 구청에서 정관 가지고 문제 삼은 적은 한 번도 없었습니다. 정관 규정 몇 줄 빠진 게 실제 회사 운영이나 제 퇴직에 그렇게 큰 영향을 미칩니까?`,
      legalKeywords: ['법무사 표준정관', '정관 규정 효력'],
      keyPointSummary: '정관을 형식적 서류로 인식하는 일반 대표이사의 오해와 질문 유도'
    },
    {
      turnNumber: 5,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '차분하지만 단호하고 엄중한 어조로',
      content: `대표님, 평상시 정기 결산 때는 국세청도 정관을 열어보지 않습니다. 하지만 대표님께서 훗날 명예롭게 은퇴하시며 퇴직금을 수령하시거나, 불의의 유고로 유족보상금이 지급되는 순간 정관은 회사의 존폐를 가르는 시한폭탄으로 돌변합니다. 상법 제388조와 법인세법 시행령 제44조에 따르면, 이사의 보수와 퇴직금은 반드시 정관이나 주주총회 결의로 정한 구체적 지급규정에 의해서만 손금산입(비용 인정)이 가능합니다. 현행 정관에는 이 필수 규정이 전무하여, 지급된 퇴직금 전액이 부인당할 위험에 노출되어 있습니다.`,
      legalKeywords: ['상법 제388조 (이사의 보수)', '법인세법 시행령 제44조', '손금불산입'],
      keyPointSummary: '상법 및 세법상 임원퇴직금 규정 부재 시 전액 손금불산입 위험 직설'
    },
    {
      turnNumber: 6,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '놀라며 목소리를 높이고',
      content: `비용 인정을 못 받는다는 게 도대체 무슨 소립니까? 근로자들은 근로기준법으로 퇴직금을 따박따박 받아가는데, 청춘을 바쳐 회사를 키운 대표이사가 퇴직금을 받는 데 세금이 왜 문제가 됩니까?`,
      legalKeywords: ['근로기준법 적용제외', '등기임원 퇴직금'],
      keyPointSummary: '등기임원과 근로자의 법적 지위 차이를 인지하지 못한 대표의 당혹감 표출'
    },
    {
      turnNumber: 7,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '태블릿에 법원 판례와 세무 추징 계산식을 띄우며',
      content: `등기임원은 근로기준법상 근로자가 아니라 상법상 위임 관계이기 때문입니다. 규정 없이 지급된 퇴직금 15억 원은 세법상 '퇴직소득'이 아니라 전액 '대표이사 상여'로 강제 처분됩니다. 그 결과 낮은 퇴직소득세 대신 최고세율 49.5%의 종합소득세 폭탄이 떨어져 세금만 7억 원 이상을 즉시 납부하셔야 합니다. 게다가 법인은 이 금액을 비용 처리하지 못해 법인세 3억 원을 추가로 추징당하여, 회사와 대표 개인이 동시에 10억 원이 넘는 이중과세 손실을 입게 됩니다. 대법원 판례(2004두10280)에서도 주총 결의 없는 퇴직금은 무효이자 손금불산입이라고 명백히 못 박고 있습니다.`,
      legalKeywords: ['상여처분 소득세 49.5%', '대법원 판례 2004두10280', '이중과세 손실 10억'],
      keyPointSummary: '최고세율 49.5% 상여처분 소득세 및 법인세 이중과세 피해 수치화'
    },
    {
      turnNumber: 8,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '이마를 짚으며 심각한 표정으로',
      content: `세금으로 절반을 털리고 법인세까지 또 물어내야 한다니 정말 끔찍하군요. 10년 넘게 고생한 대가가 세금 폭탄이라니 상상도 못 했습니다. 기장 세무사 사무실에서는 왜 이런 치명적인 제도 규정을 한 번도 말해주지 않았을까요?`,
      legalKeywords: ['세무리스크 체감', '기장세무 한계'],
      keyPointSummary: '제도 정비 부재에 따른 재정적 충격 체감과 해결 방안에 대한 갈망'
    },
    {
      turnNumber: 9,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '확신에 찬 눈빛과 안정된 전문적 어조로',
      content: `기장 세무사님은 이미 일어난 거래의 장부 기장과 부가세·법인세 신고가 본업입니다. 반면 미래의 상법상 지배구조 정비와 정관 규정 개정은 세법, 상법, 공증 절차가 융합된 고도의 법인 전략 컨설팅 영역입니다. 저희 대전글로리사업단이 제공하는 솔루션은 명확합니다. 첫째, 주주총회 특별결의를 소집하여 상법 제388조에 부합하는 '임원 퇴직금 지급규정'과 '임원 유족보상 규정'을 정관 부속규정으로 공식 신설합니다. 둘째, 법인세법상 허용되는 적법한 지급배수(대표이사 3배수)를 명문화하여 수령액 전액을 합법적 비용으로 인정받게 만듭니다.`,
      legalKeywords: ['주주총회 특별결의', '임원퇴직금 지급규정 신설', '지급배수 3배수 규정화'],
      keyPointSummary: '상법·세법 요건을 충족하는 정관 부속규정 제정 및 퇴직금 3배수 손금산입 솔루션 제시'
    },
    {
      turnNumber: 10,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '팔짱을 끼고 날카롭게 질문을 던지며',
      content: `대표이사 퇴직금을 3배수로 높여서 정관에 넣으면, 국세청에서 특정 주주에게 혜택을 몰아줬다고 '부당행위계산부인'으로 세무조사 들어오거나 부인하지 않습니까? 주변에서 그런 소리를 들은 적이 있습니다.`,
      legalKeywords: ['국세청 세무조사', '부당행위계산부인', '특정임원 차별지급'],
      keyPointSummary: '국세청 세무조사 우려 및 부당행위계산부인 혐의에 대한 대표의 핵심 반론'
    },
    {
      turnNumber: 11,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '국세청 예규 및 세법 조문 서류를 짚어가며 명쾌하게',
      content: `대표님께서 가장 핵심적인 과세 관점을 짚으셨습니다. 과세당국이 부당행위로 부인하는 사례는 '특정 임원에게만 자의적으로 배수를 차별 지급'하거나 '퇴직 직전에 급여를 비정상적으로 인상해 악용한 경우'뿐입니다. 저희는 소득세법 제22조와 법인세법 시행령 제44조의4 요건에 따라 전체 임원 직급별 지급배수를 정밀 체계화하고, 정식 주총 소집 공고와 의사록 공증을 완벽히 필합니다. 대전글로리사업단 자문 세무법인이 직접 감수하여 국세청 전산 감사 시스템에서도 100% 무결점으로 통과되도록 설계합니다.`,
      legalKeywords: ['소득세법 제22조', '법인세법 시행령 제44조의4', '의사록 공증', '감사원 심판청구 인용기준'],
      keyPointSummary: '국세청 과세 요건 및 정식 공증 절차 입증을 통한 완벽한 세무조사 반론 격파'
    },
    {
      turnNumber: 12,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '고개를 끄덕이며 안도하는 표정으로',
      content: `절차와 법적 요건을 철저히 갖추면 안전하다는 말씀이군요. 그런데 규정을 멋지게 만들어놔도 막상 제가 은퇴할 때 회사 통장에 15억, 20억이라는 큰돈이 현금으로 준비되어 있지 않으면 어떡합니까? 공장 돌리고 자재 대금 치르다 보면 현금이 늘 빠듯한데요.`,
      legalKeywords: ['퇴직금 현금유동성', '퇴직재원 마련'],
      keyPointSummary: '퇴직금 재원 마련에 대한 현실적 자금 부담 토로 및 다음 솔루션 연결'
    },
    {
      turnNumber: 13,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '캘린더와 CEO 플랜 실행 안내서를 펼치며',
      content: `그 현금 유동성 문제까지 한 번에 해결하는 것이 한화피플라이프만의 CEO 종합 플랜입니다. 정관 개정과 동시에 법인 명의의 CEO 경영인정기보험을 매칭합니다. 매월 불입하는 보험료는 법인세법상 전액 손비(비용) 인정되어 매년 수천만 원의 법인세를 즉시 절감해 줍니다. 대표님 퇴임 시점에는 해약환급금으로 목돈의 퇴직재원이 고스란히 마련되며, 만에 하나 유고 시에는 회사에 즉각적인 긴급 유동성을 공급하는 완벽한 3중 안전망이 완성됩니다.`,
      legalKeywords: ['CEO 경영인정기보험', '보험료 전액 손비처리', '퇴직재원 비축', '유고대비 안전망'],
      keyPointSummary: '정관 정비와 경영인정기보험 연계를 통한 법인세 절세 및 퇴직재원 마련 원스톱 대안 제시'
    },
    {
      turnNumber: 14,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '매우 흡족한 미소를 띠며 적극적으로',
      content: `법인세도 아끼면서 합법적으로 은퇴 자금을 비축할 수 있다면 마다할 이유가 없겠군요. 우리 회사 결산 데이터와 현행 정관에 맞춘 구체적인 정관 개정안 초안과 절세 시뮬레이션을 먼저 볼 수 있겠습니까?`,
      legalKeywords: ['정관 개정안 초안', '퇴직금 절세 시뮬레이션'],
      keyPointSummary: '구체적 절세 시뮬레이션 및 정관 개정안 요청으로 클로징 단계 진입'
    },
    {
      turnNumber: 15,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '따뜻하고 확신에 찬 어조로 다음 미팅 약속을 확정지으며',
      content: `물론입니다, 대표님! 저희 대전글로리사업단 법인 전담 세무사와 법무 자문팀이 ${company} 맞춤형 [정관 개정안 표준 초안 및 임원 퇴직금 절세 정밀 시뮬레이션 보고서]를 3영업일 내로 완벽히 준비하겠습니다. 다음 주 화요일 오후 2시 혹은 목요일 오전 10시 중 어느 시간이 편하십니까? 전담 세무사와 함께 방문하여 숫자로 입증해 드리겠습니다.`,
      legalKeywords: ['맞춤형 정관개정안', '전담세무사 동석', '2차 심층미팅 확정'],
      keyPointSummary: '택일법을 활용한 대전글로리사업단 전담 세무사 동석 2차 미팅 100% 확정 유도'
    }
  ];
}

function createCategory1Analysis(company: string, ceo: string, establishedYear: number): ScenarioAnalysis {
  return {
    riskSummary: [
      {
        title: '설립 당시 원시 표준정관 유지 및 임원퇴직금 규정 부재',
        description: `${establishedYear}년 설립 표준정관 그대로 유지되어 상법 제388조 및 법인세법 시행령 제44조가 요구하는 구체적 퇴직금 지급규정 결여.`,
        estimatedTaxOrLoss: '대표 은퇴 시 퇴직금 전액 손금불산입 및 최고 49.5% 상여소득세 폭탄 (약 7억~10억 원 추가 세액 추정)'
      },
      {
        title: '임원 유족보상 및 재해보상 규정 미비 리스크',
        description: '대표이사 불의의 유고 시 법인 자금으로 유족 위로금 지급 근거가 없어 유족 간 분쟁 및 국세청 배당 처분 위험.',
        estimatedTaxOrLoss: '유족보상금 지급 시 법인 비용 불인정 및 과다 지급분 전액 증여세·소득세 추징'
      },
      {
        title: '이사회 및 주주총회 결의 절차상 하자',
        description: '정기 주주총회 의사록 공증 및 임원보수 승인 절차 미비로 세무조사 시 임원 상여금 손금부인 대상 노출.',
        estimatedTaxOrLoss: '과거 지급된 임원 급여·상여 일부 손금부인 및 법인세 소급 추징 가능성'
      }
    ],
    legalBases: [
      {
        law: '상법 제388조 (이사의 보수)',
        summary: '이사의 보수는 정관에 그 액을 정하지 아니한 때에는 주주총회의 결의로 정하여야 법적 효력이 발생함.'
      },
      {
        law: '법인세법 시행령 제44조 및 동법 시행규칙 제22조',
        summary: '법인이 임원에게 지급한 퇴직급여 중 정관 또는 정관에서 위임된 퇴직급여지급규정에 의하지 아니한 금액은 손금불산입함.'
      },
      {
        law: '소득세법 제22조 (퇴직소득)',
        summary: '임원의 퇴직소득 한도액을 초과하는 금액은 근로소득으로 보아 높은 누진세율로 과세함.'
      }
    ],
    solutionSteps: [
      '1단계: 한화피플라이프 대전글로리사업단 전문 자문단과 함께 현행 정관 및 공증 의사록 정밀 진단',
      '2단계: 상법 및 세법 기준에 맞춘 임원 퇴직금·유족보상 규정 주주총회 특별결의 제정',
      '3단계: 법인 명의 CEO 경영인정기보험 매칭을 통한 법인세 손비 절세 및 퇴직재원 비축',
      '4단계: 공증인가 법무법인을 통한 주총 의사록 공증 및 국세청 컴플라이언스 사후관리'
    ],
    nextMeetingChecklist: [
      '현행 법인 정관 원본 사본 1부',
      '최근 3개년 법인세 세무조정계산서 사본 1부',
      '법인 등기부등본 (말소사항 포함) 1부',
      '주주명부 및 임원 근로계약서 사본'
    ]
  };
}

/* =========================================================================
   CATEGORY 2: 재무구조 및 세무최적화 (가지급금 4.6% / 잉여금 / 자사주 이익소각)
   ========================================================================= */
function createCategory2Turns(company: string, ceo: string, consultant: string, rev: string, profit: string, retained: string, prov: string): DialogueTurn[] {
  return [
    {
      turnNumber: 1,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '정중하고 신뢰감 있는 미소로 명함을 건네며',
      content: `안녕하십니까, ${ceo}. 한화피플라이프 대전글로리사업단 ${consultant}입니다. 바쁘신 일정 중에도 귀한 시간 내주셔서 진심으로 감사드립니다. 공장과 사옥을 둘러보니 임직원분들의 열정이 대단하십니다. 탁월한 현장 관리 역량이 그대로 묻어납니다.`,
      legalKeywords: ['기업가치분석', '크레탑(CRETOP)'],
      keyPointSummary: '정중한 인사와 사업장 분위기 칭찬을 통한 친밀감 형성'
    },
    {
      turnNumber: 2,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '차 한 잔을 권하며 다소 관망하는 표정으로',
      content: `어서 오세요, ${consultant}. 안 그래도 요새 법인 관련해서 찾아오는 분들이 많은데, 저희는 기장 세무사님과 매년 회계 처리를 깔끔히 해와서 큰 문제는 없을 텐데요. 오늘 어떤 이야기로 찾아오셨습니까?`,
      legalKeywords: ['기장세무사', '정기결산'],
      keyPointSummary: '기존 기장 세무사에 대한 신뢰와 일반 영업에 대한 경계심 표현'
    },
    {
      turnNumber: 3,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '바인더에서 정밀 분석 브리핑 리포트를 펼쳐 보이며',
      content: `네, 대표님 말씀이 맞습니다. 저희 사업단에서도 방문 전 한국평가데이터 크레탑 공식 데이터를 바탕으로 ${company}의 최근 3개년 결산 재무제표를 정밀 검토했습니다. 연매출 ${rev}, 영업이익 ${profit}을 달성하시며 동종 업계 상위 10% 수준의 탁월한 경영 성과를 입증하셨습니다.`,
      legalKeywords: ['한국평가데이터', '크레탑 재무분석', '신용등급'],
      keyPointSummary: '공식 데이터에 근거한 객관적 경영 성과 인정 및 전문성 각인'
    },
    {
      turnNumber: 4,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '리포트의 깔끔한 그래프와 지표를 들여다보며 흥미를 보이며',
      content: `허허, 제 책상 위에 있는 결산서보다 보기 쉽게 정리되어 있군요. 그런데 오늘 특별히 짚어주실 재무적인 리스크가 무엇인가요?`,
      legalKeywords: ['재무상태표', '손익계산서'],
      keyPointSummary: '시각화된 리포트 브리핑을 통해 대표의 실질적 호기심 유발 성공'
    },
    {
      turnNumber: 5,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '차분하지만 단호하고 진지한 어조로',
      content: `네, 대표님. 사업을 훌륭히 키우신 반대급부로 재무상태표에 두 가지 중대한 시한폭탄이 형성되어 있습니다. 첫째는 누적 미처분이익잉여금 ${retained}이며, 둘째는 결산서상 계상된 가지급금 ${prov}입니다.`,
      legalKeywords: ['미처분이익잉여금', '가지급금', '법인세법 제28조'],
      keyPointSummary: '잉여금과 가지급금의 결합으로 인한 치명적 세무 리스크 직설'
    },
    {
      turnNumber: 6,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '약간 당황하며 안경을 고쳐 쓰고',
      content: `잉여금이야 회사가 돈을 잘 벌어서 통장에 유보해 둔 건데 그게 왜 폭탄입니까? 그리고 가지급금은 공장 신축하고 연구비 쓰다 보니 일시적으로 잡힌 건데요. 시간이 지나면 해결되지 않습니까?`,
      legalKeywords: ['사내유보금', '단기대여금'],
      keyPointSummary: '잉여금을 단순 현금으로 착각하는 중소기업 대표의 보편적 오인 반론'
    },
    {
      turnNumber: 7,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '계산기와 법조항 태블릿 시뮬레이션을 제시하며',
      content: `대표님, 상증세법상 비상장주식 보충적 평가 시 순자산가치와 순손익가치에 잉여금이 전액 반영되어 주당 가치가 액면가 5,000원에서 8~10배 이상 폭등합니다. 이 상태에서 대표님 신변에 변동이 생기거나 지분을 증여하시면 최고 세율 50%의 상속세 폭탄을 맞게 됩니다. 게다가 가지급금 ${prov}은 매년 4.6% 정기 인정이자 약 수천만 원이 대표님 상여로 처분되어 근로소득세가 누진 추징되고 법인세도 중복 가산됩니다.`,
      legalKeywords: ['상증세법 제60조', '보충적평가액', '법인세법 제52조(인정이자 4.6%)'],
      keyPointSummary: '주가 급등에 따른 상속세 50% 직격탄 및 4.6% 인정이자 소득세 누진 손실 수치화'
    },
    {
      turnNumber: 8,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '표정이 굳어지며 심각성을 인지한 듯',
      content: `매년 수천만 원의 세금이 인정이자로 새어나가고, 주식 가치가 올라서 상속세가 수십억 나온다는 말입니까? 기장 세무사한테 물어보면 매번 나중에 천천히 정리하자고만 하던데요.`,
      legalKeywords: ['기장대리 한계', '상속세 부담'],
      keyPointSummary: '세무 위험의 금전적 규모에 충격을 받고 해결책을 갈구하는 전환점'
    },
    {
      turnNumber: 9,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '자신감 넘치는 눈빛과 확신에 찬 목소리로',
      content: `기장 세무사님은 과거 발생한 거래의 신고가 주업무이지만, 저희 대전글로리사업단은 법인세·상법 전문 자문단과 함께 미래의 세무 구조를 사전 설계합니다. 해결책은 3단계입니다. 첫째, 상법 제341조에 따라 배당가능이익 범위 내에서 자기주식을 적법하게 취득한 뒤 주주총회 감자·이익소각 결의를 통해 잉여금과 가지급금을 일거에 정리하는 것입니다.`,
      legalKeywords: ['상법 제341조(자기주식 취득)', '배당가능이익', '이익소각'],
      keyPointSummary: '상법 제341조 자기주식 취득 및 이익소각을 통한 출구전략 제시'
    },
    {
      turnNumber: 10,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '팔짱을 끼고 날카롭게 파고들며 반론',
      content: `잠깐만요, ${consultant}. 자사주 이익소각은 국세청에서 세무조사 나와서 배당소득이나 의제배당으로 과세 부인당하는 사례가 많다고 들었습니다. 괜찮은 겁니까?`,
      legalKeywords: ['국세청 세무조사', '부당행위계산부인', '의제배당'],
      keyPointSummary: '자사주 소각 부인 및 세무조사에 대한 대표이사의 강력한 거절·의문 반론'
    },
    {
      turnNumber: 11,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '대법원 판례 자료와 국세청 예규 서류를 짚으며',
      content: `정확하고 예리한 지적이십니다, 대표님. 과세당국이 부인하는 경우는 '정관 규정 미비, 주총 소집 절차 하자, 객관적 주식가치 평가 결여'라는 3대 요건을 누락했을 때뿐입니다. 대법원 판례(2019두39247)에서도 상법상 적법한 절차와 정당한 사업상 목적(주주 가치 제고 및 지분 정리)을 입증하면 합법적 주식 소각으로 인정됩니다. 저희 사업단은 전담 공증인 및 세무법인과 함께 100% 안전한 가이드라인을 준수합니다.`,
      legalKeywords: ['대법원 판례 2019두39247', '상법상 주총 결의', '객관적 시가평가'],
      keyPointSummary: '대법원 판례 및 법적 절차 요건 증빙을 통한 완벽한 반론 격파'
    },
    {
      turnNumber: 12,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '고개를 끄덕이며 안도하는 표정으로',
      content: `듣고 보니 법적 요건과 절차를 완벽히 밟으면 안전하겠군요. 대표이사인 제 정관 퇴직금 규정도 손을 봐야 한다고 들었는데 그것도 연계가 됩니까?`,
      legalKeywords: ['임원퇴직금 규정', '상법 제388조'],
      keyPointSummary: '솔루션 신뢰 형성 후 제도정비로의 상담 범위 자발적 확대'
    },
    {
      turnNumber: 13,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '캘린더와 실행 로드맵 시트를 펼치며',
      content: `네! 임원 퇴직금 규정 제정과 경영인 정기보험 손비 처리를 병행하면 법인세 절세와 퇴직재원 마련까지 원스톱으로 해결됩니다. 저희 실행 4단계는 1) 현행 정관 및 주총 의사록 정밀 진단, 2) 비상장주식 시가 감정평가, 3) 주총 특별결의 및 공증, 4) 국세청 전자신고 사후관리입니다.`,
      legalKeywords: ['실행 로드맵 4단계', '주주총회 특별결의', '사후관리'],
      keyPointSummary: '체계적인 4단계 실행 프로세스 안내로 실행 부담 경감'
    },
    {
      turnNumber: 14,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '적극적인 태도로 명함을 매만지며',
      content: `좋습니다. 그럼 우리 회사가 자사주 소각과 정관 정비를 실행했을 때 정확히 법인세와 소득세가 얼마 절감되는지 숫자로 된 시뮬레이션을 먼저 볼 수 있습니까?`,
      legalKeywords: ['세액 시뮬레이션', '절세 효과 산출'],
      keyPointSummary: '구체적인 절세 시뮬레이션 보고서 요청으로 클로징 단계 진입'
    },
    {
      turnNumber: 15,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '따뜻하고 확신에 찬 어조로 다음 미팅 약속을 매듭지으며',
      content: `물론입니다, 대표님! 저희 대전글로리사업단 법인 전담 세무사와 계리 시뮬레이션 팀이 ${company} 맞춤형 [절세 및 지분 최적화 정밀 시뮬레이션 보고서]를 3일 내로 완성하겠습니다. 다음 주 화요일 오후 2시 혹은 목요일 오전 10시 중 어느 시간이 편하십니까? 전담 세무사와 함께 직접 찾아뵙고 상세히 설명해 드리겠습니다.`,
      legalKeywords: ['맞춤형 시뮬레이션 보고서', '2차 심층미팅 확정', '전담세무사 동석'],
      keyPointSummary: '택일법을 통한 2차 세무사 동석 미팅 100% 확정 유도'
    }
  ];
}

function createCategory2Analysis(company: string, retained: string, prov: string): ScenarioAnalysis {
  return {
    riskSummary: [
      {
        title: `누적 미처분이익잉여금(${retained})에 따른 비상장주식 평가액 급등`,
        description: '잉여금 과다로 상증세법상 주당 가치가 폭등하여 대표 유고 시 최고 50% 상속세 과표 부담 가중.',
        estimatedTaxOrLoss: '상속·증여세 예상 부담액 약 12억~25억 원 추정'
      },
      {
        title: `가지급금(${prov}) 4.6% 인정이자 및 상여 처분`,
        description: '법인세법 제52조에 따라 매년 4.6% 정기 인정이자가 대표 상여로 가산되어 최고세율 근로소득세 부과.',
        estimatedTaxOrLoss: '연간 소득세 및 법인세 추가 부담 수천만 원 발생'
      },
      {
        title: '정관 및 임원보수 규정 미비 시 손금불산입 리스크',
        description: '상법 제388조에 따른 주주총회 결의 없는 임원보수나 퇴직금 지급 시 국세청 부당행위계산부인 대상.',
        estimatedTaxOrLoss: '퇴직금 지급 시 전액 손금불산입 및 최대 49.5% 종합소득세 추징 위험'
      }
    ],
    legalBases: [
      {
        law: '상법 제341조 (자기주식의 취득)',
        summary: '회사는 배당가능이익의 한도 내에서 주주총회 결의를 거쳐 자기의 명의와 계산으로 자기주식을 적법하게 취득 및 소각할 수 있음.'
      },
      {
        law: '법인세법 제52조 및 동법 시행령 제89조',
        summary: '특수관계인에 대한 업무무관 가지급금에 대해 연 4.6%의 정기 인정이자를 계산하여 익금산입 및 대표자 상여처분함.'
      },
      {
        law: '상법 제388조 및 법인세법 시행령 제44조',
        summary: '이사의 보수 및 퇴직금은 정관에 그 액을 정하지 아니한 때에는 주주총회의 결의로 정하여야 손금산입 인정됨.'
      }
    ],
    solutionSteps: [
      '1단계: 한화피플라이프 대전글로리사업단 전문 자문단과 함께 현행 정관 및 주총 의사록 정밀 진단',
      '2단계: 상증세법에 따른 비상장주식 보충적 시가평가 및 절세 시뮬레이션 산출',
      '3단계: 주주총회 특별결의를 통한 정관 정비(임원퇴직금 규정) 및 자기주식 이익소각 실행',
      '4단계: 국세청 전자신고 사후관리 및 경영인정기보험을 통한 합법적 퇴직재원 마련'
    ],
    nextMeetingChecklist: [
      '최근 3개년 법인세 세무조정계산서 사본 1부',
      '현행 법인 정관 원본 및 주주명부 사본',
      '법인 등기부등본 (말소사항 포함) 1부',
      '법인 인감증명서 및 사업자등록증 사본'
    ]
  };
}

/* =========================================================================
   CATEGORY 3: 경정청구(세금환급) (국세기본법 제45조의2 / 고용증대세액공제 / 5년 과오납 환급)
   ========================================================================= */
function createCategory3Turns(company: string, ceo: string, consultant: string, rev: string, profit: string, employees: number, establishedYear: number): DialogueTurn[] {
  return [
    {
      turnNumber: 1,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '정중하고 활기찬 미소로 명함을 건네며',
      content: `안녕하십니까, ${ceo}. 한화피플라이프 대전글로리사업단 ${consultant}입니다. 늘 지역 경제와 일자리 창출에 앞장서 주시는 ${company}에 직접 방문하게 되어 큰 영광입니다. 현장 임직원분들이 분주하게 움직이시는 모습에서 회사의 역동적인 성장세가 고스란히 전해집니다.`,
      legalKeywords: ['크레탑 리포트', '고용지표', '경정청구'],
      keyPointSummary: '일자리 창출에 대한 존중과 따뜻한 경청으로 우호적 라포 형성'
    },
    {
      turnNumber: 2,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '명함을 받으며 살짝 궁금한 눈빛으로',
      content: `반갑습니다, ${consultant}. 요새 경기가 어려워서 인건비에 원자재 값까지 다 올랐는데, 회사를 칭찬해 주시니 힘이 나는군요. 그런데 한화피플라이프에서 보험 영업이 아니라 세금 환급 관련해서 오셨다고 하던데 구체적으로 어떤 내용입니까?`,
      legalKeywords: ['인건비 부담', '세금환급', '법인세 경정'],
      keyPointSummary: '제조업 경기 고충 토로 및 세금 환급 제안에 대한 대표이사의 호기심 표현'
    },
    {
      turnNumber: 3,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '크레탑 고용 변동 차트와 세무 브리핑 자료를 펼치며',
      content: `네, 대표님! 저희 대전글로리사업단은 단순 보험 안내가 아니라 법인의 숨은 현금 유동성을 찾아드리는 종합 금융 컨설팅을 수행합니다. 크레탑(CRETOP) 분석 결과, ${company}는 최근 연매출 ${rev}, 영업이익 ${profit}을 내시면서 상시 임직원을 현재 ${employees}명 규모로 꾸준히 유지·확대해 오셨습니다. 이처럼 성실하게 일자리를 늘려오신 법인은 조세특례제한법상 막대한 세액공제 혜택을 받을 자격이 있으나, 지난 5개년 법인세 납부 내역상 수천만 원에서 억대 이상의 공제 혜택을 놓치고 과오납하셨을 확률이 매우 높습니다.`,
      legalKeywords: ['크레탑 고용분석', '조세특례제한법', '과오납 법인세'],
      keyPointSummary: '고용 성장에 따른 조특법상 세액공제 누락 가능성 브리핑'
    },
    {
      turnNumber: 4,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '의아해하며 반문하듯',
      content: `세금을 더 냈다고요? 저희는 매년 세무사 사무실에서 계산서 뽑아주는 대로 1원도 안 빼놓고 꼬박꼬박 납부해 왔습니다. 세무사가 알아서 절세 공제를 다 넣어서 신고해 주지 않았을까요?`,
      legalKeywords: ['기장세무사', '정기신고', '세액공제 미반영'],
      keyPointSummary: '기존 기장 대리에 대한 절대적 신뢰 및 공제 누락에 대한 의구심'
    },
    {
      turnNumber: 5,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '진지하고 명확한 어조로 세무 실무의 현실을 설명하며',
      content: `대표님의 의문은 지극히 당연합니다. 하지만 세무 실무 현실은 다릅니다. 일반 기장 세무사님들은 매년 3월 법인세 신고 기간에 수십 개 업체의 장부를 촉박하게 마감하느라 바쁩니다. 특히 조특법 제29조의7 '고용증대세액공제'와 '통합고용세액공제'는 청년 및 상시근로자 1인당 연간 최대 1,450만~1,550만 원씩 3년간 공제해 주는 파격적 제도이지만, 공제 후 2년간 고용이 감소하면 감면 세액을 토해내야 하는 복잡한 사후관리 책임이 따릅니다. 따라서 대부분의 기장 사무실에서는 사후관리 리스크를 회피하고자 아예 신청하지 않고 넘어가는 경우가 80%를 넘습니다.`,
      legalKeywords: ['조특법 제29조의7', '통합고용세액공제', '청년 1인당 1,550만원', '사후관리 부담'],
      keyPointSummary: '기장 세무사가 사후관리 부담으로 고용증대세액공제를 적용하지 않는 실무적 배경 폭로'
    },
    {
      turnNumber: 6,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '눈을 크게 뜨며 놀란 표정으로',
      content: `직원 1명당 1,500만 원이나 깎아주는 제도가 있었습니까? 우리 회사는 매년 청년 엔지니어들을 서너 명씩 꾸준히 뽑아왔는데, 그걸 매년 그냥 넘겼단 말입니까? 도대체 지난 5년 동안 얼마를 손해 본 겁니까?`,
      legalKeywords: ['청년고용 증대', '5개년 누적 손실'],
      keyPointSummary: '거액의 공제 혜택 누락 사실을 깨닫고 손실 규모에 격분'
    },
    {
      turnNumber: 7,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '계산기와 법조항을 태블릿으로 보여주며',
      content: `더 심각한 문제는 국세기본법 제45조의2에 명시된 경정청구의 '5년 제척기간'입니다. 세금을 더 냈더라도 신고일로부터 5년이 경과하면 국고에 영구 귀속되어 다시는 찾을 수 없습니다. ${company}의 경우 ${establishedYear}년 이후 고용 변동 추이를 볼 때, 지금 즉시 환급을 청구하지 않으면 2019년과 2020년 귀속분 수천만 원의 정당한 환급금이 수개월 내에 영원히 소멸하게 됩니다. 저희 사전 시뮬레이션상 약 8,000만 원에서 최대 1억 5,000만 원 상당의 환급 잠재액이 확인됩니다.`,
      legalKeywords: ['국세기본법 제45조의2 (경정청구 제척기간 5년)', '영구소멸 시효', '환급 예상액 1억 내외'],
      keyPointSummary: '5년 제척기간 만료 시 국고 영구 귀속 경고 및 억대 환급 잠재액 제시'
    },
    {
      turnNumber: 8,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '안타까워하며 가슴을 치듯',
      content: `1억이 넘는 생돈을 나라에 그냥 헌납할 뻔했군요. 지금 당장이라도 찾아야 할 텐데, 어떻게 돌려받을 수 있습니까?`,
      legalKeywords: ['환급 신청 절차', '현금 유동성 확보'],
      keyPointSummary: '제척기간 소멸 전에 즉시 세금 환급을 추진하겠다는 강력한 니즈 표출'
    },
    {
      turnNumber: 9,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '차분하고 명료한 목소리로 절차를 설명하며',
      content: `해결책은 국세기본법 제45조의2에 따른 정식 '경정청구(과오납 세액 환급 청구)'입니다. 저희 대전글로리사업단 제휴 조세 전문 세무법인이 지난 5개년 법인세 신고서, 원천징수이행상황신고서, 4대 보험 자격취득자 명부 데이터를 전수 조사하여, 고용증대세액공제뿐 아니라 통합투자세액공제, R&D 세액공제 누락분까지 1원 단위로 정밀 역산출하여 관할 세무서에 환급을 청구합니다. 환급이 결정되면 국가가 국세환급 가산금(법정이자)까지 얹어서 회사 법인통장으로 현금을 직접 꽂아줍니다.`,
      legalKeywords: ['국세기본법 제45조의2', '전수데이터 교차검증', '국세환급 가산금', '법인통장 현금입금'],
      keyPointSummary: '조세전문 세무팀의 5개년 전수 분석 및 법정이자 포함 법인통장 현금 입금 솔루션 제시'
    },
    {
      turnNumber: 10,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '팔짱을 끼고 조심스러운 표정으로 가장 우려하던 질문을 꺼내며',
      content: `잠깐만요, ${consultant}. 이미 낸 세금을 돌려달라고 국세청에 경정청구를 넣으면, 세무서에서 '괘씸죄'로 회사에 세무조사를 나오거나 감찰 표적이 되지 않습니까? 그리고 기존 기장 세무사와의 관계가 틀어질까 봐도 걱정됩니다.`,
      legalKeywords: ['국세청 괘씸죄', '세무조사 보복 우려', '기장세무사 마찰'],
      keyPointSummary: '경정청구 시 세무조사 보복 우려 및 기존 세무사와의 관계 악화에 대한 핵심 반론'
    },
    {
      turnNumber: 11,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '국세청 공식 훈령과 대전글로리사업단의 환급 사례집을 보여주며',
      content: `많은 대표님들이 가장 두려워하시는 부분이지만 결코 염려하실 필요가 없습니다. 첫째, 경정청구는 국세기본법에 보장된 납세자의 정당한 권리이며, 국세청 훈령상 적법한 서류에 의한 경정청구 신청을 이유로 세무조사를 통지하는 것은 법적으로 엄격히 금지되어 있습니다. 둘째, 기존 기장 세무사를 바꿀 필요가 전혀 없습니다. 일반 장부 기장과 세무조정은 기존 세무사님이 그대로 수행하시고, 지난 5개년 누락 환급 업무만 저희 조세전문 세무팀이 특화 프로젝트로 진행하므로 기존 세무사님과의 신뢰도 전혀 훼손되지 않습니다.`,
      legalKeywords: ['국세청 훈령', '세무조사 금지규정', '기장세무사 변경 불필요', '프로젝트 분리수행'],
      keyPointSummary: '국세청 법적 보호 규정 및 기존 기장 세무사와의 업무 분담 설명을 통한 반론 완벽 해소'
    },
    {
      turnNumber: 12,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '고개를 끄덕이며 깊이 안도하는 표정으로',
      content: `세무조사 걱정도 없고 기장 세무사 눈치 볼 필요도 없다면 마음이 푹 놓이는군요. 세금을 환급받는 데 서류 준비가 복잡하거나 회사 업무에 지장을 주지는 않습니까?`,
      legalKeywords: ['서류준비 간소화', '업무부담 최소화'],
      keyPointSummary: '심리적 장벽 해소 후 실질적 실행 절차 및 업무 편의성에 대한 문의'
    },
    {
      turnNumber: 13,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '경정청구 4단계 원스톱 간소화 서류 목록을 보여주며',
      content: `회사 담당자가 하실 일은 거의 없습니다. 홈택스에서 최근 5개년 법인세 세무조정계산서와 원천징수이행상황신고서 PDF 파일만 다운받아 전달해 주시면 끝납니다. 저희 사업단 조세팀이 1) 고용·투자 빅데이터 교차 검증, 2) 비대면 사전 환급액 산출 보고서 제공, 3) 관할 세무서 전자접수 및 소명 대응, 4) 2~3개월 내 법인계좌 입금까지 100% 원스톱으로 전담 처리해 드립니다.`,
      legalKeywords: ['홈택스 전자추출', '비대면 사전진단', '관할세무서 소명대응', '원스톱 프로세스'],
      keyPointSummary: '대표 및 실무진의 수고를 덜어주는 초간소화 4단계 환급 프로세스 안내'
    },
    {
      turnNumber: 14,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '매우 흡족해하며 비서실에 서류 준비를 지시하듯',
      content: `정말 편리하군요. 당장 홈택스 서류 전달해 드릴 테니, 우리 회사가 5년 동안 얼마를 돌려받을 수 있는지 정확한 환급액 계산서를 먼저 뽑아와 주시겠습니까?`,
      legalKeywords: ['서류 즉시제출', '환급액 정밀산출'],
      keyPointSummary: '환급액 정밀 시뮬레이션 보고서 정식 요청으로 클로징 성공'
    },
    {
      turnNumber: 15,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '자신감 넘치는 미소로 2차 미팅 일정을 조율하며',
      content: `네, 대표님! 서류를 전달해 주시면 저희 대전글로리사업단 환급 전담 조세 세무사가 ${company} 맞춤형 [5개년 과오납 세금 정밀 환급 진단 보고서]를 무료로 편성해 드리겠습니다. 다음 주 화요일 오후 2시나 목요일 오전 10시 중 어느 시간이 편하십니까? 전담 세무사와 함께 방문하여 법인통장에 들어올 정확한 환급 금액을 눈으로 확인시켜 드리겠습니다.`,
      legalKeywords: ['5개년 환급 진단보고서', '전담세무사 동석', '2차 심층미팅 확정'],
      keyPointSummary: '택일법을 통한 대전글로리사업단 환급 전담 세무사 동석 2차 미팅 100% 확정'
    }
  ];
}

function createCategory3Analysis(company: string, employees: number): ScenarioAnalysis {
  return {
    riskSummary: [
      {
        title: '국세기본법 제45조의2 경정청구 제척기간(5년) 만료 임박',
        description: '법인세 과오납 환급 청구권은 5년 경과 시 국가에 영구 귀속되어 정당한 환급 권리가 영구 소멸됨.',
        estimatedTaxOrLoss: '과거 5개년 누락 법인세 환급 기회 상실 (약 8,000만~1억 5,000만 원 영구 소멸 위기)'
      },
      {
        title: '고용증대 및 통합고용 세액공제 전수 미적용',
        description: `상시근로자 ${employees}명 규모로 꾸준히 채용을 확대했으나 기장 사무실의 사후관리 부담으로 조특법 제29조의7 미적용.`,
        estimatedTaxOrLoss: '청년 1인당 연 최대 1,550만 원 × 3년간 공제 혜택 누락'
      },
      {
        title: '통합투자세액공제 및 R&D 공제 누락',
        description: '설비 투자 및 연구인력 개발비용에 대한 조특법상 투자세액공제 소급 적용 검토 부재.',
        estimatedTaxOrLoss: '기계장치 및 전산설비 투자액의 3~10% 법인세 감면 혜택 미수령'
      }
    ],
    legalBases: [
      {
        law: '국세기본법 제45조의2 (경정 등의 청구)',
        summary: '과세표준신고서를 법정신고기한까지 제출한 자는 법정신고기한이 지난 후 5년 이내에 최초신고 및 수정신고한 국세의 과세표준 및 세액의 결정을 청구할 수 있음.'
      },
      {
        law: '조세특례제한법 제29조의7 (고용을 증대시킨 기업에 대한 세액공제)',
        summary: '전년 대비 상시근로자 수가 증가한 경우 청년 정규직 1인당 최대 1,550만 원(지방 중소기업 기준)을 3년간 법인세에서 공제함.'
      },
      {
        law: '조세특례제한법 제24조 (통합투자세액공제)',
        summary: '사업용 유형자산 등에 투자하는 경우 기본공제율과 추가공제율을 합산하여 법인세에서 직접 공제함.'
      }
    ],
    solutionSteps: [
      '1단계: 최근 5개년 법인세 세무조정계산서 및 원천징수이행상황신고서 비대면 데이터 추출',
      '2단계: 대전글로리사업단 조세전문 세무팀의 고용증대 및 투자세액공제 전수 역산출',
      '3단계: 관할 세무서에 국세기본법 제45조의2에 따른 공식 경정청구서 전자 접수',
      '4단계: 세무서 담당 조사관 소명 대응 및 국세환급가산금(이자) 포함 법인통장 현금 수령'
    ],
    nextMeetingChecklist: [
      '최근 5개년(2019~2024) 법인세 세무조정계산서 원본 사본',
      '최근 5개년 원천징수이행상황신고서(매월/반기) 전체',
      '4대 사회보험 사업장 가입자 명부 및 사업자등록증 사본',
      '환급금을 수령할 법인 명의 통장 사본'
    ]
  };
}

/* =========================================================================
   CATEGORY 4: 미래 성장 및 인증 / M&A (기업부설연구소 / 벤처·이노비즈 / 기업가치)
   ========================================================================= */
function createCategory4Turns(company: string, ceo: string, consultant: string, rev: string, profit: string, employees: number, industry: string): DialogueTurn[] {
  return [
    {
      turnNumber: 1,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '예의 바르고 지적인 어조로 인사를 건네며',
      content: `안녕하십니까, ${ceo}. 한화피플라이프 대전글로리사업단 ${consultant}입니다. 바쁘신 개발 및 영업 현장 일정 중에도 이렇게 귀한 시간 내어주셔서 진심으로 감사드립니다. 연구동과 제조 설비를 둘러보니 독자적인 기술력과 특허 경쟁력이 대단하십니다. 중소기업의 미래 성장 동력이 바로 이곳에서 만들어지고 있음을 느낍니다.`,
      legalKeywords: ['크레탑 기술평가', '기업가치제고', '연구개발'],
      keyPointSummary: '기업의 기술적 자부심 고취 및 정중한 전문가적 라포 형성'
    },
    {
      turnNumber: 2,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '뿌듯해하면서도 다소 신중한 표정으로',
      content: `반갑습니다, ${consultant}. 우리 회사가 ${industry} 분야에서 잔뼈가 굵어서 기술 하나는 어디 내놔도 안 빠집니다. 그런데 한화피플라이프에서 기업부설연구소나 벤처 인증, 기업가치 평가 컨설팅을 해준다고 해서 조금 의아했습니다. 보험사에서 이런 기술 경영 자문도 합니까?`,
      legalKeywords: ['기술 경쟁력', '기업부설연구소', '벤처기업인증'],
      keyPointSummary: '기술력 자부심 표출 및 한화피플라이프 기업인증 컨설팅 영역에 대한 질문'
    },
    {
      turnNumber: 3,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '크레탑 기술경쟁력 및 재무 분석 브리핑 차트를 펼치며',
      content: `네, 대표님! 한화피플라이프 대전글로리사업단은 법인의 재무 리스크 방어뿐만 아니라 세제 감면과 기업가치(Valuation)를 극대화하는 국가공인 인증 전략 자문단을 직접 운영하고 있습니다. 크레탑(CRETOP) 분석 결과, ${company}는 연매출 ${rev}, 영업이익 ${profit}, 임직원 ${employees}명 규모로 우수한 기술력을 갖추셨습니다. 하지만 국가가 주는 R&D 세액공제와 벤처·이노비즈 인증의 세법상 혜택을 100% 흡수하지 못하고 계시며, 연구소 사후관리 컴플라이언스 측면에서 과세당국의 정밀 실사 표적이 될 수 있는 취약점이 발견되었습니다.`,
      legalKeywords: ['크레탑 기술분석', 'R&D 세액공제', '사후관리 컴플라이언스'],
      keyPointSummary: '크레탑 분석 기반 기술 역량 인정 및 연구소 사후관리 부실 위험 브리핑'
    },
    {
      turnNumber: 4,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '눈살을 찌푸리며 의아한 표정으로',
      content: `연구소 사후관리가 부실하다고요? 저희도 회사 한쪽에 연구개발 전담 인력들 배치해 놓고 연구소 인정서 받아서 세무서에 R&D 세액공제 신청해 왔습니다. 뭐가 문제라는 겁니까?`,
      legalKeywords: ['연구소 인정서', 'KOITA 인증', '세액공제 신청'],
      keyPointSummary: '기존 연구소 운영에 대한 확신과 사후관리 위험에 대한 의구심'
    },
    {
      turnNumber: 5,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '국세청 연구개발비 세무조사 추징 사례집을 펼쳐 보이며',
      content: `대표님, 최근 국세청과 과기정통부(KOITA)의 R&D 사후관리 검증이 과거와 비교할 수 없을 정도로 엄격해졌습니다. 조특법 제10조의 연구·인력개발비 세액공제는 공제율이 25%로 세법상 가장 파격적이기 때문에 국세청의 표적 검증 대상 1순위입니다. 만약 연구전담요원이 일반 영업이나 생산, 관리 업무를 겸직했거나, 연구개발계획서·연구노트·보고서 등 필수 증빙이 일자별로 갖춰져 있지 않으면 연구소 인증 취소는 물론 과거 5년간 공제받은 세액 전액 추징과 함께 징벌적 과소신고 가산세 40%가 부과됩니다.`,
      legalKeywords: ['조특법 제10조 (R&D 세액공제 25%)', '연구원 겸직 금지', '연구노트 미작성', '가산세 40%'],
      keyPointSummary: 'R&D 세액공제 연구노트 및 겸직 위반 시 5개년 소급 추징 및 40% 가산세 위험 직설'
    },
    {
      turnNumber: 6,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '당황하여 말문이 막힌 듯',
      content: `연구원들이 바쁘다 보니 생산 현장도 돕고 납품도 챙기는데 그것도 겸직으로 걸립니까? 연구일지도 솔직히 결산 때 몰아서 대충 썼는데... 그게 수억 원 세금 추징으로 돌아온단 말입니까?`,
      legalKeywords: ['연구원 타업무 지원', '연구일지 부실'],
      keyPointSummary: '중소기업 현장의 연구소 관리 실태 실토 및 추징 리스크 체감'
    },
    {
      turnNumber: 7,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '단호하지만 차분하게 해결책의 필요성을 강조하며',
      content: `네, 실제로 대전·충청권 제조업체 중 연구노트 부실과 인력 겸직으로 3억~5억 원의 세금을 소급 추징당한 법인이 속출하고 있습니다. 뿐만 아니라 ${company}는 아직 '혁신성장유형 벤처기업 인증'과 '이노비즈(Inno-Biz) 인증'을 확보하지 못하셔서, 창업감면 법인세 50% 감면, 취득세 75% 감면, 신용보증기금 보증한도 우대 및 정책자금 금리 인하라는 연간 수억 원 상당의 정책 혜택을 고스란히 버리고 계신 실정입니다. 향후 투자 유치나 기업 매각(M&A) 시에도 기업가치(Valuation)를 30% 이상 헐값으로 평가받게 됩니다.`,
      legalKeywords: ['벤처기업 인증 부재', '이노비즈 미보유', '법인세 50% 감면 상실', '기업가치 저평가'],
      keyPointSummary: '인증 부재에 따른 조세 감면 상실 및 정책금융 우대 배제, 기업가치 저평가 손실 분석'
    },
    {
      turnNumber: 8,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '깊은 한숨을 쉬며 안타까워하며',
      content: `세금 추징 위험에 정책 자금 우대도 못 받고 회사 가치까지 낮게 평가받고 있었다니... 도대체 어디서부터 손을 대야 합니까?`,
      legalKeywords: ['종합 인증 정비', '위험 제거 니즈'],
      keyPointSummary: '사후관리 리스크 방어 및 기업인증 종합 솔루션에 대한 절실한 요구'
    },
    {
      turnNumber: 9,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '로드맵을 제시하며 자신감 넘치는 목소리로',
      content: `대전글로리사업단의 '미래성장 원스톱 컴플라이언스 솔루션'으로 일거에 해결해 드립니다. 첫째, 기존 연구소를 KOITA 실사 기준에 완벽히 부합하도록 연구공간 분리 및 연구노트 전자 표준시스템을 구축하여 국세청 세무조사 리스크를 100% 사전 차단합니다. 둘째, ${company}의 특허와 기술력을 바탕으로 기술보증기금 혁신성장형 벤처기업 인증 및 중기부 이노비즈 인증을 원스톱 취득하여 법인세 50% 감면과 정책자금 우대 금리를 즉각 확보합니다. 셋째, 상증세법 및 현금흐름할인법(DCF) 기반의 정밀 기업가치 평가를 거쳐 투자유치와 M&A 최적화 로드맵을 완성합니다.`,
      legalKeywords: ['KOITA 사후관리 시스템', '혁신성장형 벤처인증', '이노비즈 인증', 'DCF 기업가치 평가'],
      keyPointSummary: '연구소 사후관리 컴플라이언스 + 벤처·이노비즈 원스톱 인증 + 기업가치 극대화 솔루션 제시'
    },
    {
      turnNumber: 10,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '회의적인 눈빛으로 현실적 의문을 제기하며',
      content: `말씀은 참 좋은데, 우리 회사는 순수 IT나 바이오가 아니라 ${industry} 전통 제조업입니다. 이런 뿌리 제조업도 벤처기업확인기관 심사나 이노비즈 실사에서 실제로 인증 통과가 됩니까? 괜히 시간과 돈만 날리는 것 아닙니까?`,
      legalKeywords: ['전통제조업 한계', '벤처인증 실효성', '통과 가능성'],
      keyPointSummary: '전통 제조업종의 벤처/이노비즈 인증 심사 통과 가능성에 대한 회의적 반론'
    },
    {
      turnNumber: 11,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '동종 업계 성공 인증 사례집과 평가지표를 제시하며',
      content: `대표님, 오히려 정반대입니다! 현 정부의 벤처 및 이노비즈 정책은 뿌리 제조업의 스마트 공정 혁신과 소재·부품·장비 국산화 기술에 가장 높은 가산점을 배정하고 있습니다. ${company}가 보유하신 제조 공정 노하우와 가공 정밀도는 벤처 인증 평가 기준인 '기술의 혁신성과 사업의 성장성' 항목에서 최고 등급을 받을 수 있는 우수한 자산입니다. 저희 사업단 전문 경영지도사와 기술평가사가 사업계획서 작성부터 현장 실사 브리핑까지 밀착 전담하여 95% 이상의 압도적인 합격률을 보장합니다.`,
      legalKeywords: ['소부장 국산화 가산점', '기술혁신성 평가지표', '경영지도사 전담코칭', '95% 합격률'],
      keyPointSummary: '제조업 특화 가산점 및 대전글로리사업단 전담 코칭을 통한 인증 통과 확신 제시'
    },
    {
      turnNumber: 12,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '환한 미소를 지으며 고개를 끄덕이고',
      content: `우리 회사 공정 기술로도 충분히 벤처기업 인증을 받을 수 있다니 자신감이 생기는군요. 인증을 받게 되면 법인세 감면 외에 대표인 저나 임직원들에게 돌아오는 직접적인 세제 혜택도 있습니까?`,
      legalKeywords: ['스톡옵션 비과세', '대표자 세제혜택'],
      keyPointSummary: '인증 통과 신뢰 확보 후 임직원 보상 및 대표자 개인 혜택으로 질의 심화'
    },
    {
      turnNumber: 13,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '임직원 인센티브 및 경영인 플랜 자료를 보여주며',
      content: `물론입니다! 벤처기업 인증 시 조특법 제16조의2에 따라 임직원에게 연간 2억 원 한도의 스톡옵션 비과세 혜택을 부여할 수 있어 고급 연구 인력을 유출 없이 묶어둘 수 있습니다. 또한 대표이사님의 가지급금 정리나 주식 가치 평가 시 특허권 직무발명보상금 비과세(연 700만 원)와 CEO 정기보험 손비 처리를 유기적으로 연계하여, 법인 자금과 대표님 개인 자산을 완벽히 최적화해 드립니다.`,
      legalKeywords: ['스톡옵션 비과세 2억원', '직무발명보상금', 'CEO 플랜 연계'],
      keyPointSummary: '스톡옵션 비과세 및 핵심 인재 락인, 대표 자산 최적화 연계 혜택 제시'
    },
    {
      turnNumber: 14,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '책상을 두드리며 결단을 내린 듯',
      content: `좋습니다. 연구소 세무조사 리스크도 털어내고 벤처 인증으로 세금도 줄일 수 있다면 서둘러야겠군요. 우리 회사가 준비해야 할 핵심 서류와 사전 진단 일정을 잡아주시겠습니까?`,
      legalKeywords: ['사전진단 신청', '실행 의사 표명'],
      keyPointSummary: '연구소 사후관리 진단 및 벤처인증 사전 실사 정식 요청'
    },
    {
      turnNumber: 15,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '일정표를 확인하며 프로다운 정중함으로 미팅을 확정짓고',
      content: `네, 대표님! 저희 대전글로리사업단 공인 기업인증 자문위원과 기술평가 세무사가 ${company} 맞춤형 [기업부설연구소 사전 컴플라이언스 진단 및 벤처·이노비즈 취득 로드맵]을 편성해 드리겠습니다. 다음 주 화요일 오후 2시나 목요일 오전 10시 중 어느 시간이 편하십니까? 자문위원과 함께 방문하여 현장 실무 점검을 완벽히 진행해 드리겠습니다.`,
      legalKeywords: ['기업인증 자문위원 동석', '현장 실무점검', '2차 심층미팅 확정'],
      keyPointSummary: '택일법을 통한 대전글로리사업단 기업인증 자문위원 동석 2차 미팅 100% 확정'
    }
  ];
}

function createCategory4Analysis(company: string, industry: string): ScenarioAnalysis {
  return {
    riskSummary: [
      {
        title: '기업부설연구소 사후관리 부실로 인한 R&D 세액공제 추징 위험',
        description: '조특법 제10조 연구개발비 세액공제(25%)에 대한 국세청·과기부 실사 시 연구노트 미작성 및 연구원 타업무 겸직 적발 위험.',
        estimatedTaxOrLoss: '과거 5개년 R&D 세액공제 전액 추징 및 과소신고 가산세 40% 부과 (수억 원 세무 폭탄)'
      },
      {
        title: '벤처기업 및 이노비즈(Inno-Biz) 인증 미보유로 인한 조세 감면 상실',
        description: `${industry} 업종의 우수한 기술력에도 불구하고 국가 공인 인증 미취득으로 법인세 감면 및 정책금융 우대 혜택 상실.`,
        estimatedTaxOrLoss: '창업벤처 법인세 50% 감면 및 취득세 75% 감면 혜택 영구 미수령'
      },
      {
        title: '사전 기업가치(Valuation) 평가 관리 부재로 M&A 시 저평가 리스크',
        description: '비상장주식 시가 및 기술가치 평가 부재로 향후 지분 매각, 투자 유치, 가업승계 시 정당한 가치를 인정받지 못할 우려.',
        estimatedTaxOrLoss: '지분 가치 30% 이상 저평가 및 투자유치 한도 축소'
      }
    ],
    legalBases: [
      {
        law: '조세특례제한법 제10조 (연구·인력개발비에 대한 세액공제)',
        summary: '내국인이 연구개발 및 인력개발을 위해 지출한 비용 중 당해 과세연도 발생액의 25%(중소기업)를 법인세에서 공제함.'
      },
      {
        law: '기초연구진흥 및 기술개발지원에 관한 법률 시행령 제16조',
        summary: '기업부설연구소 및 연구개발전담부서의 연구전담요원은 연구개발 업무에만 전념하여야 하며 타 업무 겸직이 엄격히 금지됨.'
      },
      {
        law: '벤처기업육성에 관한 특별조치법 제2조의2',
        summary: '기술보증기금 등의 기술성·사업성 평가를 거쳐 벤처기업으로 확인받은 기업에 대해 법인세 50% 감면 및 금융·특허 우대 지원.'
      }
    ],
    solutionSteps: [
      '1단계: 한화피플라이프 대전글로리사업단 기술자문단과 함께 현행 연구소 공간 및 연구노트 컴플라이언스 정밀 실사',
      '2단계: 조특법 제10조 요건에 부합하는 일자별 전자 연구노트 시스템 및 연구원 겸직 방지 체계 완비',
      '3단계: 기술보증기금 혁신성장형 벤처기업 인증 및 중기부 이노비즈 인증 동시 취득 대행',
      '4단계: DCF 및 상증세법 기반 기업가치 평가 보고서 산출 및 CEO 경영인 플랜 연계'
    ],
    nextMeetingChecklist: [
      '현행 기업부설연구소/전담부서 인정서 사본',
      '연구개발전담요원 자격증 및 4대보험 가입자명부',
      '최근 등록 특허권 및 지식재산권 등록원부 사본',
      '최근 3개년 법인세 세무조정계산서 사본 1부'
    ]
  };
}

/* =========================================================================
   CATEGORY 5: 가업 승계 및 자산 이전 (상증세법 제18조의2 / 가업상속공제 600억 / 사전 증여특례)
   ========================================================================= */
function createCategory5Turns(company: string, ceo: string, consultant: string, rev: string, profit: string, retained: string, establishedYear: number, shareholders: string): DialogueTurn[] {
  return [
    {
      turnNumber: 1,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '정중하고 깊은 존경심을 담아 고개 숙여 인사하며',
      content: `안녕하십니까, ${ceo}. 한화피플라이프 대전글로리사업단 ${consultant}입니다. 바쁘신 경영 일정 중에도 귀한 시간 허락해 주셔서 진심으로 감사드립니다. ${establishedYear}년 창업 이래 십수 년간 수많은 역경을 딛고 중견 제조 강소기업으로 일구어내신 대표님의 경영 역정은 지역 경제계의 살아있는 귀감입니다.`,
      legalKeywords: ['크레탑 기업승계분석', '가업승계', '명문장수기업'],
      keyPointSummary: '창업과 기업 성장에 대한 진심 어린 경의 표명 및 깊은 라포 형성'
    },
    {
      turnNumber: 2,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '차를 한 모금 마시며 감회에 젖은 듯',
      content: `어서 오세요, ${consultant}. 제 청춘과 인생을 전부 갈아 넣어서 만든 회사인데, 그렇게 알아주시니 고맙군요. 저도 이제 나이가 60대 중반을 넘어가다 보니 요즘 부쩍 은퇴나 자식들에게 회사를 어떻게 물려줄지 생각이 많아집니다. 오늘 어떤 분석을 해오셨습니까?`,
      legalKeywords: ['창업주 은퇴', '자녀 가업승계', '승계 고민'],
      keyPointSummary: '고령에 따른 은퇴 및 자녀 승계에 대한 현실적 고뇌 털어놓기'
    },
    {
      turnNumber: 3,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '바인더에서 비상장주식 시가 평가 및 지분 구조 분석서를 펼치며',
      content: `네, 대표님! 저희 대전글로리사업단에서도 한국평가데이터 크레탑(CRETOP) 공식 데이터를 바탕으로 ${company}의 주주 명부와 지분 구조(${shareholders}), 그리고 잉여금 누적 추이를 정밀 시뮬레이션해 왔습니다. 연매출 ${rev}, 영업이익 ${profit}, 그리고 ${retained}에 달하는 사내유보 잉여금은 대표님의 훌륭한 경영 성과이지만, 가업승계의 관점에서는 상속세를 눈덩이처럼 불려놓은 치명적인 역설로 작용하고 있습니다.`,
      legalKeywords: ['크레탑 주주명부', '비상장주식 주가폭등', '상속세 역설'],
      keyPointSummary: '훌륭한 경영 실적이 비상장주식 가치 폭등과 상속세 폭탄으로 직결되는 모순 브리핑'
    },
    {
      turnNumber: 4,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '안경을 고쳐 쓰며 차트를 유심히 살피고',
      content: `비상장주식이 액면가 5,000원짜리인데, 주식 가치가 도대체 얼마나 올랐길래 상속세가 눈덩이처럼 불어났다는 겁니까? 상장 주식도 아닌데 세무서에서 얼마로 평가합니까?`,
      legalKeywords: ['액면가 5,000원', '비상장주식 시가평가', '상증세법 제63조'],
      keyPointSummary: '비상장주식을 여전히 액면가로 착각하는 대표이사의 현실적 질문'
    },
    {
      turnNumber: 5,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '상증세법 제63조 평가 계산식을 화면에 띄우며',
      content: `대표님, 국세청은 비상장주식을 액면가로 보지 않습니다. 상증세법 제63조에 따라 최근 3개년 순손익가치 60%와 순자산가치 40%를 가중평균하여 시가를 산정합니다. ${company}의 경우 연이은 흑자와 잉여금 ${retained} 누적으로 인해, 1주당 평가액이 액면가 5,000원의 20배가 넘는 10만 원 이상으로 폭등해 있습니다. 이 상태에서 대표님 유고가 발생하면 총 상속재산 가액이 100억 원을 훌쩍 넘어 최고세율 50%의 상속세가 부과되어, 자녀들이 내야 할 세금만 30억~45억 원에 달합니다.`,
      legalKeywords: ['상증세법 제63조 가중평균평가', '순손익가치 60% + 순자산가치 40%', '주당 10만원 폭등', '상속세율 50%'],
      keyPointSummary: '상증세법상 비상장주식 시가 산정 방식 및 40억 원대 상속세 폭탄 수치화'
    },
    {
      turnNumber: 6,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '안색이 창백해지며 손을 떨며',
      content: `40억 원이라고요? 우리 회사가 공장 돌리고 설비 투자하느라 현금은 통장에 4억도 없는데, 자식들이 40억이라는 거액의 상속세를 현금으로 어디서 구해서 냅니까? 상속세를 못 내면 회사는 어떻게 됩니까?`,
      legalKeywords: ['상속세 납부재원 부재', '현금유동성 고갈', '경영권 위협'],
      keyPointSummary: '상속세 납부용 현금 부재 시 발생할 파국적 경영권 상실 위기 직시'
    },
    {
      turnNumber: 7,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '단호하고 진지한 어조로 비극적 선례를 경고하며',
      content: `바로 그 점이 대한민국 중소기업 대표님들이 가장 피눈물을 흘리시는 대목입니다. 상속세는 상속 개시일로부터 6개월 이내에 100% 현금으로 납부해야 합니다. 현금이 없으면 국세청에 주식을 물납하거나, 급매물로 알짜 지분을 헐값에 사모펀드나 경쟁사에 처분해야 합니다. 결국 세금을 내기 위해 대표님이 평생 일군 회사의 경영권을 제3자에게 통째로 빼앗기게 되는 것입니다. 손톱깎이 1위 쓰리세븐이나 락앤락 같은 굴지의 기업들이 가업승계 사전 준비 부족으로 경영권을 매각한 이유가 바로 여기에 있습니다.`,
      legalKeywords: ['상속세 6개월 내 현금납부', '물납의 한계', '경영권 강제매각', '쓰리세븐 사례'],
      keyPointSummary: '상속세 납부 재원 부재 시 주식 강제 매각 및 경영권 박탈 위험 경고'
    },
    {
      turnNumber: 8,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '마른침을 삼키며 떨리는 목소리로',
      content: `정말 끔찍한 일이군요. 자식들 고생 안 시키려고 만든 회사가 자식들을 빚더미에 앉히고 경영권까지 뺏기게 만들다니... 기사에서 보던 일이 우리 집안일이 될 뻔했습니다.`,
      legalKeywords: ['가업승계 절체절명 위기', '사전대비 절박성'],
      keyPointSummary: '상속세 리스크의 치명성에 대한 절대적 공감과 사전 대비의 절박성 인식'
    },
    {
      turnNumber: 9,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '따뜻한 눈빛과 자신감 넘치는 목소리로 희망을 제시하며',
      content: `대표님, 아직 늦지 않았습니다. 건강하실 때 지금부터 미리 설계하시면 상속세를 70% 이상 합법적으로 절감하고 경영권을 100% 완벽히 승계할 수 있습니다. 저희 대전글로리사업단의 가업승계 3대 황금 솔루션은 1) 조특법 제30조의5 '가업승계 증여세 과세특례'를 활용한 생전 조기 지분 이전(10% 저율 분리과세), 2) 자기주식 소각 및 차등배당을 통한 주식가치 사전 안정화, 3) 대표이사 유고 시 상속세 납부 현금을 법인 비용으로 전액 마련해 주는 'CEO 경영인정기보험 안전망 구축'입니다.`,
      legalKeywords: ['조특법 제30조의5 (증여세 과세특례 10%)', '가업승계 사전지분증여', 'CEO 경영인정기보험 상속세재원'],
      keyPointSummary: '증여세 특례 10% 분리과세 + 주가사전안정화 + CEO 보험 상속세 현금재원 마련 솔루션 제시'
    },
    {
      turnNumber: 10,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '반색하며 질문을 던지듯',
      content: `잠깐만요, ${consultant}. 뉴스에서 보니까 국가에서 최대 600억 원까지 상속세를 전액 면제해 준다는 '가업상속공제' 제도가 있다고 하던데, 그걸로 나중에 한 번에 털어버리면 세금 0원으로 물려줄 수 있는 것 아닙니까?`,
      legalKeywords: ['상증세법 제18조의2', '가업상속공제 600억', '세금 0원 기대'],
      keyPointSummary: '가업상속공제 600억 제도에 대한 대표이사의 막연한 기대와 반론'
    },
    {
      turnNumber: 11,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '상증세법 제18조의2 사후관리 법조항을 짚어가며 촌철살인으로 해명하며',
      content: `대표님, 가업상속공제 600억 원은 언뜻 달콤해 보이지만 지독한 '독이 든 성배'가 될 수 있습니다. 상증세법 제18조의2는 상속 후 5년 동안 1) 정규직 근로자 수 90% 이상 유지, 2) 회사의 주된 업종 변경 금지, 3) 5년간 상속인 지분 매각 금지라는 극도로 가혹한 사후관리 요건을 걸고 있습니다. 만약 경기 불황으로 인원을 조금이라도 줄이거나 업종을 피봇팅하면 공제받은 수십억 원의 상속세에 연 10%의 이자까지 붙여 전액 추징당합니다. 따라서 위험천만한 사후공제에만 목을 매지 마시고, 10% 저율 과세특례로 생전에 지분을 분산 이전하고 유고 시 세금 납부용 현금을 법인 보험으로 완벽히 비축하는 '사전 승계 플랜'이 비교할 수 없이 안전합니다.`,
      legalKeywords: ['가업상속공제 5년 사후관리', '고용 90% 유지 의무', '업종변경 금지', '추징 이자 연 10%', '사전 증여특례 우위'],
      keyPointSummary: '가업상속공제 사후관리 함정 폭로 및 생전 증여특례 10% 사전 플랜의 압도적 안전성 입증'
    },
    {
      turnNumber: 12,
      stage: 3,
      stageName: '3단계: 솔루션 제안 및 심층 질의응답',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '손뼉을 치며 깊이 탄복하듯',
      content: `사후관리에 그런 무서운 올가미가 걸려있는 줄은 꿈에도 몰랐습니다. 그냥 놔뒀다가는 회사가 통째로 날아갈 뻔했군요. 말씀대로 생전에 주식 가치가 낮을 때 10% 세금만 내고 자식에게 미리 넘겨주고, 만약의 세금은 법인 보험으로 현금을 마련해 놓는 것이 훨씬 확실하고 지혜로운 방법이네요!`,
      legalKeywords: ['사전증여특례 수용', '상속세 재원마련 납득'],
      keyPointSummary: '사후관리 리스크 납득 및 사전 승계 + 상속세 재원 확보 전략에 전폭적 동의'
    },
    {
      turnNumber: 13,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '가업승계 4단계 종합 실행 로드맵 시트를 펼치며',
      content: `정확한 판단이십니다, 대표님! 저희 대전글로리사업단이 안내해 드리는 가업승계 4단계 프로세스는 1) 최근 3개년 결산서 기반 비상장주식 보충적 시가평가, 2) 자녀 승계 지분에 대한 조특법 제30조의5 증여세 과세특례 10% 실행, 3) 대표이사 유족보상 및 정관 정비, 4) 상속세 납부 재원용 CEO 경영인정기보험 체결입니다. 대표님의 세무 부담을 최소화하면서 100년 명문 장수기업의 기틀을 완성해 드립니다.`,
      legalKeywords: ['가업승계 4단계 로드맵', '보충적 시가평가', '증여세 특례실행', '100년 장수기업 기틀'],
      keyPointSummary: '체계적인 4단계 가업승계 로드맵 안내 및 안정적 승계 비전 제시'
    },
    {
      turnNumber: 14,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'ceo',
      speakerTitle: `대표이사 (${company})`,
      emotion: '안도감과 신뢰가 가득 찬 표정으로',
      content: `남은 여생의 가장 큰 짐을 덜어낸 기분입니다. 우리 가족 지분과 결산서로 가업승계 플랜을 돌렸을 때 증여세와 상속세가 얼마나 줄어드는지 구체적인 시뮬레이션 보고서를 먼저 받아볼 수 있습니까?`,
      legalKeywords: ['가업승계 시뮬레이션', '절세액 산출 요청'],
      keyPointSummary: '가업승계 정밀 시뮬레이션 보고서 정식 요청으로 클로징 완성'
    },
    {
      turnNumber: 15,
      stage: 4,
      stageName: '4단계: 실행 절차 및 차기 미팅 유도',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '진심 어린 경의와 신뢰를 담아 일정을 확정하며',
      content: `물론입니다, 대표님! 저희 대전글로리사업단 가업승계 전담 세무사와 상속 전문 변호사팀이 ${company} 맞춤형 [100년 기업 승계 & 상속세 70% 절감 정밀 시뮬레이션 보고서]를 3일 내로 완성하겠습니다. 다음 주 화요일 오후 2시나 목요일 오전 10시 중 어느 시간이 편하십니까? 전담 세무사와 함께 찾아뵙고 가족 승계 플랜을 명쾌하게 브리핑해 드리겠습니다.`,
      legalKeywords: ['가업승계 전담세무사', '상속전문변호사', '2차 심층미팅 확정'],
      keyPointSummary: '택일법을 통한 대전글로리사업단 가업승계 전담 세무사 동석 2차 미팅 100% 확정'
    }
  ];
}

function createCategory5Analysis(company: string, retained: string): ScenarioAnalysis {
  return {
    riskSummary: [
      {
        title: `순손익(60%) 및 순자산(40%) 반영에 따른 비상장주식 시가 폭등`,
        description: `잉여금(${retained}) 누적으로 상증세법상 1주당 평가액이 액면가 대비 15~20배 이상 상승하여 대표 유고 시 최고 50% 상속세 과표 직격탄.`,
        estimatedTaxOrLoss: '대표 유고 시 상속세 예상 부담액 약 30억~45억 원 추정'
      },
      {
        title: '상속세 납부용 현금 유동성 결여로 인한 경영권 강제 상실 위험',
        description: '상속 개시일 6개월 이내 현금 미납 시 지분 강제 물납 또는 헐값 매각으로 제3자에게 경영권 피탈 위험 노출.',
        estimatedTaxOrLoss: '경영권 위협 및 주식 강제 처분에 따른 지분 손실'
      },
      {
        title: '가업상속공제(600억) 5년 사후관리 위반 시 추징 리스크',
        description: '사후공제 요건(고용 90% 유지, 주된 업종 유지 등) 불이행 시 공제액 전액 소급 추징 및 연 10% 가산이자 부과.',
        estimatedTaxOrLoss: '사후관리 실패 시 수십억 상속세 원금 + 연 10% 추징이자 동시 부과'
      }
    ],
    legalBases: [
      {
        law: '상속세 및 증여세법 제18조의2 (가업상속공제)',
        summary: '10년 이상 계속하여 영위한 중소·중견기업을 상속하는 경우 최대 600억 원 한도로 상속세 과세가액에서 공제하되 5년간 엄격한 사후관리 준수 의무가 부과됨.'
      },
      {
        law: '조세특례제한법 제30조의5 (가업의 승계에 대한 증여세 과세특례)',
        summary: '18세 이상 거주자가 60세 이상 부모로부터 가업승계 목적으로 주식을 증여받는 경우 10억 원 공제 후 10%(초과분 20%)의 저율 분리과세 적용.'
      },
      {
        law: '상속세 및 증여세법 제60조 및 제63조 (비상장주식의 평가)',
        summary: '시가가 불분명한 비상장주식은 1주당 순손익가치(60%)와 순자산가치(40%)를 가중평균하여 보충적 평가액을 산출함.'
      }
    ],
    solutionSteps: [
      '1단계: 상증세법 기준 비상장주식 시가 보충적 평가 및 3개년 손익 추정치 산출',
      '2단계: 조특법 제30조의5 가업승계 증여세 과세특례(10% 저율)를 활용한 자녀 사전 지분 이전',
      '3단계: 법인 명의 CEO 경영인정기보험을 통한 상속세 납부 현금 재원 마련 (보험료 전액 손비 처리)',
      '4단계: 정관 내 주식양도제한 조항 및 이익소각, 차등배당을 통한 지분 분산 및 경영권 안정화'
    ],
    nextMeetingChecklist: [
      '주주명부 사본 (주민등록번호 앞자리 포함)',
      '최근 3개년 법인세 세무조정계산서 사본 1부',
      '법인 정관 원본 및 등기부등본 사본 1부',
      '대표이사 및 자녀 가족관계증명서'
    ]
  };
}
