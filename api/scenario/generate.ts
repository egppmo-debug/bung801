type Report = Record<string, any>;

type TurnDraft = {
  speaker: 'consultant' | 'ceo';
  content: string;
  keyPointSummary: string;
};

function createScenario(report: Report) {
  const company = report.companyName || '주식회사 법인고객';
  const ceo = report.ceoName || '대표이사';
  const consultant = report.consultantName || '남소영 단장';
  const category = report.category || 'category_2';
  const categoryTitle = category === 'category_1' ? '경영 효율화 및 제도 정비'
    : category === 'category_3' ? '경정청구 세금환급'
    : category === 'category_4' ? '미래 성장 및 인증 / M&A'
    : category === 'category_5' ? '가업 승계 및 자산 이전'
    : '재무구조 및 세무최적화';
  const industry = report.industry || '제조 및 유통업';
  const revenue = report.annualRevenue || '120억 원';
  const profit = report.operatingProfit || '14억 원';
  const retained = report.retainedEarnings || '45억 원';
  const provisional = report.provisionalPayment || '5억 원';
  const shareholders = report.shareholders || '대표이사 70%, 배우자 30%';
  const employees = report.employeeCount || 0;
  const articles = report.articlesStatus || '설립 당시 표준정관 유지';
  const focus = category === 'category_1' ? '정관과 임원보수·퇴직금 규정 정비'
    : category === 'category_3' ? '고용 및 연구개발 세액공제 누락 여부와 경정청구'
    : category === 'category_4' ? '연구소·인증 요건과 기업가치 개선'
    : category === 'category_5' ? '주식가치 관리와 2세 승계 재원 설계'
    : '가지급금과 미처분이익잉여금의 세무·재무 정리';
  const topic = category === 'category_1'
    ? {
      risk: `현재 ${articles} 상태라 임원보수·퇴직금·중간배당의 근거가 약합니다. 대표님이 실제로 회사를 위해 수행한 역할과 지급액이 있어도 정관과 주주총회 결의가 부족하면 손금 인정과 지급의 정당성을 설명하기 어려워집니다.`,
      objection: '임원보수와 퇴직금 규정을 지금 바꾸면 과거에 지급한 보수까지 문제가 되고, 주주총회를 다시 열어야 해서 경영 부담만 커지는 것 아닌가요?',
      solution: '과거 지급분과 앞으로의 지급분을 분리해 장부와 의사록을 먼저 대조하겠습니다. 이후 상법 제388조에 따라 정관의 위임 범위, 주주총회 결의, 임원별 보수한도를 정비하고 퇴직금 지급배수와 유족보상 규정을 회사 규모에 맞춰 새로 설계하겠습니다.',
      documents: '현행 정관, 최근 3개년 주주총회·이사회 의사록, 임원별 보수대장과 퇴직금 규정',
      laws: ['상법 제388조', '법인세법 시행령 제44조', '상법 제462조'],
    }
    : category === 'category_3'
    ? {
      risk: `임직원 ${employees}명 규모와 최근 고용 흐름을 보면 고용증대·통합고용·연구개발 세액공제 누락 여부를 확인할 필요가 있습니다. 신고가 끝났다는 사실과 공제받을 수 있는 항목을 모두 검토했다는 것은 다르며, 경정청구 기한이 지나면 환급 기회가 사라질 수 있습니다.`,
      objection: '기존 세무사님이 이미 신고한 법인세인데 경정청구를 하면 세무조사를 자초하는 것 아닌가요? 환급액도 확실하지 않은데 비용만 들까 걱정됩니다.',
      solution: '먼저 신고서와 급여대장을 대조해 실제 고용 증가와 공제 요건을 확인하고, 증빙이 부족한 연도는 신청하지 않겠습니다. 연도별 예상 환급액과 수임료를 비교한 뒤 근거가 충분한 연도만 국세기본법 제45조의2에 따라 경정청구하고, 사후 질의에 대비한 증빙 목록도 함께 준비하겠습니다.',
      documents: '최근 5개년 법인세 신고서·세무조정계산서, 원천징수이행상황신고서, 근로자 명부와 연구개발비 증빙',
      laws: ['국세기본법 제45조의2', '조세특례제한법 제29조의7', '조세특례제한법 제10조'],
    }
    : category === 'category_4'
    ? {
      risk: `${industry}의 성장성을 숫자로 증명하려면 연구소·벤처·이노비즈 인증의 현재 요건과 사후관리부터 점검해야 합니다. 인증이 단순한 명패에 그치면 정책자금과 R&D 세액공제 기회를 놓치고, 향후 투자나 M&A 때 기업가치 설명도 약해집니다.`,
      objection: '인증을 받아도 매출이 바로 늘어나는 것은 아니고 연구전담인력과 서류 관리 비용이 발생할 텐데, 우리 회사가 감당할 만한 투자입니까?',
      solution: '먼저 현재 인력과 연구개발비로 충족 가능한 인증부터 선별하고, 인증을 위한 형식적인 조직을 만들지 않겠습니다. 연구소 설치 전후의 세액공제, 정책자금, 거래처 신뢰 효과를 비용과 비교하고, 향후 M&A 실사에서 필요한 IP·재무·인증 자료를 한 묶음으로 관리하겠습니다.',
      documents: '연구개발비 명세, 연구전담인력 현황, 특허·기술자료, 최근 재무제표와 인증 이력',
      laws: ['조세특례제한법 제10조', '기초연구진흥법', '벤처기업육성에 관한 특별조치법'],
    }
    : category === 'category_5'
    ? {
      risk: `주주구조는 ${shareholders}이고 미처분이익잉여금은 ${retained}입니다. 이익이 누적될수록 비상장주식 평가액이 올라가 2세에게 지분을 이전할 때 증여세 재원이 커질 수 있으므로, 대표님의 은퇴 시점이 아니라 지금부터 지분·경영·재원 계획을 함께 세워야 합니다.`,
      objection: '아직 승계를 확정한 것도 아닌데 지금 자녀에게 지분을 넘기면 경영권이 흔들리고, 주식 평가액이 바뀌어 세금을 더 내게 되는 것 아닌가요?',
      solution: '즉시 지분을 이전하지 않고 대표님의 은퇴 예상 시점, 자녀의 근무·경영 참여, 주식가치 변화와 가업상속공제 요건을 먼저 시뮬레이션하겠습니다. 그 결과를 바탕으로 주식 이전 시기, 배당 재원, 보험·현금성 자산을 조합해 세금 납부 때문에 경영권을 매각하는 상황을 막겠습니다.',
      documents: '주주명부, 가족관계와 자녀의 근무이력, 최근 3개년 재무제표, 정관과 가업 관련 사업자 자료',
      laws: ['상속세 및 증여세법 제18조의2', '조세특례제한법 제30조의5', '상법 제341조'],
    }
    : {
      risk: `미처분이익잉여금은 ${retained}, 가지급금은 ${provisional}으로 확인됩니다. 이 두 항목을 따로 보면 단순한 장부 숫자처럼 보이지만, 함께 누적되면 주식가치 상승과 인정이자·상여처분이 동시에 발생할 수 있어 ${focus}가 시급합니다.`,
      objection: '가지급금은 사업 과정에서 생긴 임시 지출이고 잉여금은 회사에 남겨 둔 이익인데, 왜 지금 세금을 내야 하는지 납득하기 어렵습니다.',
      solution: '거래별 증빙을 확인해 업무 관련 금액과 대표자 귀속 금액을 분리하고, 배당가능이익과 운영자금을 계산한 뒤 배당·상환·자기주식 취득안을 비교하겠습니다. 적법한 주주총회 결의와 객관적인 주식가치 평가를 남겨 세무상 부인 위험도 함께 관리하겠습니다.',
      documents: '최근 3개년 법인세 세무조정계산서, 가지급금 원장과 상환내역, 정관과 주주명부',
      laws: ['법인세법 제52조', '상법 제341조', '상법 제388조'],
    };

  const drafts: TurnDraft[] = [
    { speaker: 'consultant', content: `안녕하십니까, ${ceo} 대표님. 한화피플라이프 대전글로리사업단 ${consultant}입니다. 오늘은 상품을 먼저 권하는 자리가 아니라 ${company}의 크레탑 리포트에 나타난 숫자가 실제 경영과 세금에 어떤 의미인지 함께 확인하는 자리로 준비했습니다.`, keyPointSummary: '크레탑 리포트와 상담 목적 안내' },
    { speaker: 'ceo', content: `어서 오세요. 저희는 ${industry} 업종으로 ${report.establishedYear || 2014}년에 시작해 왔습니다. 기장 세무사님이 매년 신고를 잘해 주고 있는데, 별도로 컨설팅을 받아야 할 만큼 구체적인 문제가 있는지부터 듣고 싶습니다.`, keyPointSummary: '기존 세무대리인에 대한 신뢰와 상담 경계' },
    { speaker: 'consultant', content: `먼저 성과부터 말씀드리겠습니다. 최근 매출은 ${revenue}, 영업이익은 ${profit}으로 사업 자체는 안정적으로 보입니다. 주주구조는 ${shareholders}, 임직원은 ${employees}명이고, 이익이 쌓이는 과정에서 나중에 한 번에 세금이 발생할 수 있는 구조가 만들어졌는지가 오늘의 핵심입니다.`, keyPointSummary: '경영 성과 인정과 리포트 수치 브리핑' },
    { speaker: 'ceo', content: '실적이 좋은 것이 오히려 문제가 될 수 있다는 뜻인가요? 매출과 이익이 늘면 회사 가치가 올라가는 것은 당연한 일이라고 생각했습니다. 구체적으로 어떤 숫자를 먼저 봐야 합니까?', keyPointSummary: '실적과 세무 리스크에 대한 대표의 질문' },
    { speaker: 'consultant', content: topic.risk, keyPointSummary: '선택 카테고리의 핵심 리스크 진단' },
    { speaker: 'ceo', content: topic.objection, keyPointSummary: '선택 카테고리에 대한 대표의 현실적인 반론' },
    { speaker: 'consultant', content: topic.solution, keyPointSummary: '카테고리별 법률 근거와 단계별 해결책' },
    { speaker: 'ceo', content: '제가 걱정하는 것은 세무조사입니다. 과거 장부를 전부 다시 들춰서 문제가 되거나, 자사주 취득과 배당을 절세 목적으로 했다고 부인당할 가능성은 없습니까?', keyPointSummary: '세무조사와 거래 부인 가능성에 대한 반론' },
    { speaker: 'consultant', content: `이번 상담의 실행 순서는 명확합니다. 먼저 ${topic.documents}를 받아 사실관계를 확정하고, 그 다음 ${topic.laws.join('·')}에 맞는 요건을 대조하겠습니다. 요건을 충족하지 못하는 항목은 무리하게 진행하지 않고, 가능한 대안과 예상 세금을 비교표로 제시하겠습니다.`, keyPointSummary: '카테고리별 증빙과 법적 요건 확인' },
    { speaker: 'ceo', content: `${focus}를 우선한다고 하셨는데, 우리 회사에는 무엇부터 적용하는 것이 현실적입니까? 한 번에 배당이나 소각을 진행하면 운영자금이 부족해질까 봐 걱정됩니다.`, keyPointSummary: '현금흐름과 실행 가능성에 대한 우려' },
    { speaker: 'consultant', content: `한 번에 실행하지 않고 세 단계로 나누겠습니다. 첫째, ${topic.documents}를 기준으로 현재 상태를 진단합니다. 둘째, ${topic.laws.join('·')}에 따른 가능 여부와 예상 세후 효과를 계산합니다. 셋째, ${articles} 상태를 포함한 회사의 제도와 의사록을 보완한 뒤 대표님이 선택한 안만 실행합니다.`, keyPointSummary: '현금흐름과 카테고리 요건을 반영한 단계별 해결책' },
    { speaker: 'ceo', content: '자기주식 취득이나 이익소각을 하면 주주별 세금이 달라질 수 있지 않습니까? 가족 주주도 있고 지분율도 서로 다른데, 특정 주주에게 유리하다는 문제가 생기면 어떻게 합니까?', keyPointSummary: '주주별 과세와 형평성에 대한 반론' },
    { speaker: 'consultant', content: `카테고리가 ${categoryTitle}인 만큼 일반적인 절세안 하나만 제시하지 않겠습니다. 회사의 현금흐름, 주주별 이해관계, ${industry} 업종의 성장계획을 함께 놓고 보겠습니다. 최종 보고서에는 실행하지 않았을 때의 비용, 실행했을 때의 세금, 대표님이 준비해야 할 서류와 의사결정 시점을 나란히 표시하겠습니다.`, keyPointSummary: '카테고리 목적과 회사 상황을 함께 반영' },
    { speaker: 'ceo', content: `정관에는 임원 퇴직금이나 보수 관련 내용이 오래된 채로 남아 있습니다. 이것도 지금 같이 바꾸면 과거 지급분까지 문제가 되는 것은 아닌지, 변경 절차는 복잡하지 않은지 궁금합니다.`, keyPointSummary: '정관과 과거 지급분에 대한 질문' },
    { speaker: 'consultant', content: `과거 자료를 무조건 소급해 고치는 것이 아니라, 해당 카테고리와 직접 관련된 과거 거래와 현재 제도를 분리해 검토하겠습니다. ${topic.solution} 다음 미팅에서는 ${company}의 현 상태와 ${categoryTitle} 실행안의 비용·세후 효과·실행 일정을 함께 제시하겠습니다.`, keyPointSummary: '카테고리별 제도 정비와 실행 시뮬레이션 약속' },
    { speaker: 'ceo', content: '좋습니다. 말로만 절세 효과를 듣기보다는 우리 회사 숫자로 비교표를 보고 결정하고 싶습니다. 어떤 자료를 준비하면 되고, 결과를 확인하는 데 얼마나 걸립니까?', keyPointSummary: '구체적인 실행자료 요청' },
    { speaker: 'consultant', content: `${topic.documents}를 준비해 주십시오. 그 자료로 ${categoryTitle}의 현 상태, 실행안, 보류안에 따른 세후 현금흐름과 예상 리스크를 비교하겠습니다. ${company} 대표님이 선택할 수 있는 대안과 위험요인을 문서로 정리하고, 다음 미팅에서는 실행 여부와 첫 번째 조치까지 함께 결정하겠습니다.`, keyPointSummary: '카테고리별 자료 요청과 2차 미팅 확정' },
  ];

  const dialogueTurns = drafts.map((draft, index) => ({
    turnNumber: index + 1,
    stage: Math.min(4, Math.floor(index / 4) + 1),
    stageName: `${Math.min(4, Math.floor(index / 4) + 1)}단계: ${index < 4 ? '라포 형성 및 리포트 브리핑' : index < 8 ? '문제점 제기 및 리스크 분석' : index < 12 ? '솔루션 제안 및 심층 질의응답' : '실행 절차 및 차기 미팅 유도'}`,
    speaker: draft.speaker,
    speakerTitle: draft.speaker === 'consultant' ? `한화피플라이프 대전글로리사업단 ${consultant}` : `${ceo} 대표이사`,
    content: draft.content,
    legalKeywords: ['상법 제341조', '상법 제388조', '법인세법 제52조'],
    keyPointSummary: draft.keyPointSummary,
  }));

  return {
    id: `scenario_${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    report,
    category,
    categoryTitle,
    dialogueTurns,
    analysis: {
      riskSummary: [
        { title: `미처분이익잉여금 ${retained} 점검`, description: '누적 잉여금은 비상장주식 평가액과 승계 세 부담에 영향을 줄 수 있습니다.', estimatedTaxOrLoss: '전문 시뮬레이션 필요' },
        { title: `가지급금 ${provisional} 인정이자 점검`, description: '업무무관 가지급금은 인정이자와 세무상 조정 대상이 될 수 있습니다.', estimatedTaxOrLoss: '연간 추가 세 부담 검토' },
      ],
      legalBases: [
        { law: '상법 제341조', summary: '자기주식 취득 및 이익소각 절차를 검토합니다.' },
        { law: '상법 제388조', summary: '임원 보수와 퇴직금 규정을 정관 및 주주총회 결의와 함께 점검합니다.' },
        { law: '법인세법 제52조', summary: '특수관계인 거래와 가지급금 인정이자 여부를 확인합니다.' },
      ],
      solutionSteps: ['현행 정관과 주주명부 점검', '최근 세무조정계산서 분석', '주식가치 및 세금 시뮬레이션', '실행 절차와 사후관리 수립'],
      nextMeetingChecklist: ['최근 3개년 법인세 세무조정계산서', '법인 정관 및 주주명부', '법인 등기부등본', '최근 결산 재무제표'],
    },
  };
}

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  const report = req.body?.report as Report | undefined;
  if (!report?.companyName?.trim() || !report.category) {
    return res.status(400).json({ error: '유효한 법인 분석 리포트 데이터가 필요합니다.' });
  }
  return res.status(200).json({ scenario: createScenario(report) });
}

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };
