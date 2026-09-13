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

  const drafts: TurnDraft[] = [
    { speaker: 'consultant', content: `안녕하십니까, ${ceo} 대표님. 한화피플라이프 대전글로리사업단 ${consultant}입니다. 오늘은 상품을 먼저 권하는 자리가 아니라 ${company}의 크레탑 리포트에 나타난 숫자가 실제 경영과 세금에 어떤 의미인지 함께 확인하는 자리로 준비했습니다.`, keyPointSummary: '크레탑 리포트와 상담 목적 안내' },
    { speaker: 'ceo', content: `어서 오세요. 저희는 ${industry} 업종으로 ${report.establishedYear || 2014}년에 시작해 왔습니다. 기장 세무사님이 매년 신고를 잘해 주고 있는데, 별도로 컨설팅을 받아야 할 만큼 구체적인 문제가 있는지부터 듣고 싶습니다.`, keyPointSummary: '기존 세무대리인에 대한 신뢰와 상담 경계' },
    { speaker: 'consultant', content: `먼저 성과부터 말씀드리겠습니다. 최근 매출은 ${revenue}, 영업이익은 ${profit}으로 사업 자체는 안정적으로 보입니다. 주주구조는 ${shareholders}, 임직원은 ${employees}명이고, 이익이 쌓이는 과정에서 나중에 한 번에 세금이 발생할 수 있는 구조가 만들어졌는지가 오늘의 핵심입니다.`, keyPointSummary: '경영 성과 인정과 리포트 수치 브리핑' },
    { speaker: 'ceo', content: '실적이 좋은 것이 오히려 문제가 될 수 있다는 뜻인가요? 매출과 이익이 늘면 회사 가치가 올라가는 것은 당연한 일이라고 생각했습니다. 구체적으로 어떤 숫자를 먼저 봐야 합니까?', keyPointSummary: '실적과 세무 리스크에 대한 대표의 질문' },
    { speaker: 'consultant', content: `맞습니다. 이익 자체가 잘못된 것은 아닙니다. 다만 현재 미처분이익잉여금이 ${retained}이고 가지급금이 ${provisional}으로 확인되면, 잉여금은 비상장주식 평가액을 높이고 가지급금은 매년 인정이자와 대표자 상여 처분의 원인이 될 수 있습니다. 성장의 결과가 승계세와 소득세 부담으로 연결되지 않도록 출구전략을 미리 설계해야 합니다.`, keyPointSummary: '잉여금과 가지급금의 연결 리스크' },
    { speaker: 'ceo', content: `가지급금은 공장과 거래처에 먼저 지출한 금액이 섞여 있을 뿐이고, 잉여금도 회사에 남겨 둔 돈입니다. 당장 회사 통장에서 빠져나간 것도 아닌데 왜 세금 문제가 된다는 것인지, 실제 과세 과정을 쉽게 설명해 주세요.`, keyPointSummary: '가지급금과 잉여금의 성격에 대한 반론' },
    { speaker: 'consultant', content: `가지급금은 업무 관련 증빙이 완성되지 않으면 회사가 대표에게 빌려준 돈으로 볼 수 있습니다. 그러면 적정 이자를 계산해 법인의 익금에 넣고 대표자 상여로 처분할 수 있으며, 차입금이 있는 경우 지급이자 손금불산입까지 겹칠 수 있습니다. 잉여금은 현금 잔액과 동일하지 않지만 주식 평가에 영향을 주기 때문에 지분 이전 시 세금 재원이 부족해지는 것이 더 큰 문제입니다.`, keyPointSummary: '인정이자·상여처분·주식평가 설명' },
    { speaker: 'ceo', content: '제가 걱정하는 것은 세무조사입니다. 과거 장부를 전부 다시 들춰서 문제가 되거나, 자사주 취득과 배당을 절세 목적으로 했다고 부인당할 가능성은 없습니까?', keyPointSummary: '세무조사와 거래 부인 가능성에 대한 반론' },
    { speaker: 'consultant', content: `그 우려가 현실적이어서 절차를 먼저 설계해야 합니다. 최근 3개년 세무조정계산서와 가지급금 발생 원인을 거래별로 확인하고, 배당가능이익과 주식가치를 독립적으로 산정한 뒤, 상법상 주주총회 결의와 자금 흐름을 남겨야 합니다. 단순히 세금을 피하는 거래가 아니라 실제 채권·채무 정리와 주주 간 지분 정리라는 점을 문서로 설명할 수 있어야 합니다.`, keyPointSummary: '세무 리스크를 줄이는 사전 검토 원칙' },
    { speaker: 'ceo', content: `${focus}를 우선한다고 하셨는데, 우리 회사에는 무엇부터 적용하는 것이 현실적입니까? 한 번에 배당이나 소각을 진행하면 운영자금이 부족해질까 봐 걱정됩니다.`, keyPointSummary: '현금흐름과 실행 가능성에 대한 우려' },
    { speaker: 'consultant', content: `한 번에 실행하지 않고 세 단계로 나누겠습니다. 첫째, 실제 업무 관련성이 입증되는 가지급금과 그렇지 않은 금액을 구분합니다. 둘째, 운영자금과 세금을 제외한 배당가능이익을 계산해 배당·자기주식 취득·상환안을 비교합니다. 셋째, ${articles} 상태를 점검해 정관과 주주총회 결의에 필요한 근거를 보완합니다.`, keyPointSummary: '현금흐름을 보존하는 단계별 해결책' },
    { speaker: 'ceo', content: '자기주식 취득이나 이익소각을 하면 주주별 세금이 달라질 수 있지 않습니까? 가족 주주도 있고 지분율도 서로 다른데, 특정 주주에게 유리하다는 문제가 생기면 어떻게 합니까?', keyPointSummary: '주주별 과세와 형평성에 대한 반론' },
    { speaker: 'consultant', content: `그래서 모든 주주에게 같은 조건을 적용한다고 가정하고 끝내면 안 됩니다. 주주별 취득가액, 보유기간, 지분율, 특수관계 여부를 반영해 의제배당과 양도소득세 가능성을 각각 계산해야 합니다. 상법 제341조 절차, 객관적인 평가보고서, 주주별 세후 수령액을 함께 제시한 뒤 의사결정을 받아야 특정 주주에게 이익을 준 거래라는 오해를 줄일 수 있습니다.`, keyPointSummary: '주주별 세금과 절차 통제' },
    { speaker: 'ceo', content: `정관에는 임원 퇴직금이나 보수 관련 내용이 오래된 채로 남아 있습니다. 이것도 지금 같이 바꾸면 과거 지급분까지 문제가 되는 것은 아닌지, 변경 절차는 복잡하지 않은지 궁금합니다.`, keyPointSummary: '정관과 과거 지급분에 대한 질문' },
    { speaker: 'consultant', content: `과거 지급분을 무조건 소급해 고치는 것이 아니라 과거 결의와 실제 지급 내역을 먼저 분리해 검토하겠습니다. 앞으로의 임원보수와 퇴직금은 상법 제388조에 따른 정관 또는 주주총회 근거를 명확히 하고 회사 규모와 이익 수준에 맞는 한도를 정해야 합니다. 다음 미팅에서 ${company}에 맞춘 현 상태, 배당안, 자기주식 취득안의 세후 현금흐름 비교표를 제시하겠습니다.`, keyPointSummary: '정관·임원 규정 정비와 비교 시뮬레이션 약속' },
    { speaker: 'ceo', content: '좋습니다. 말로만 절세 효과를 듣기보다는 우리 회사 숫자로 비교표를 보고 결정하고 싶습니다. 어떤 자료를 준비하면 되고, 결과를 확인하는 데 얼마나 걸립니까?', keyPointSummary: '구체적인 실행자료 요청' },
    { speaker: 'consultant', content: `최근 3개년 재무제표와 세무조정계산서, 정관, 주주명부, 가지급금 원장과 상환 내역을 준비해 주십시오. 그 자료로 현 상태, 배당 중심안, 자기주식 취득·소각안, ${categoryTitle} 실행안의 세후 현금흐름과 예상 세금을 비교하겠습니다. ${company}의 대표님이 선택할 수 있는 대안과 위험요인을 문서로 정리해 다음 미팅에서 함께 결정하겠습니다.`, keyPointSummary: '자료 요청과 2차 미팅 확정' },
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
