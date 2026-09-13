type Report = Record<string, any>;

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
  const turns = [
    ['consultant', `안녕하십니까, ${ceo} 대표님. 한화피플라이프 대전글로리사업단 ${consultant}입니다. 귀한 시간 내주셔서 감사합니다.`],
    ['ceo', `어서 오세요. 저희 ${company}의 현황을 어떤 관점에서 검토하셨는지 설명해 주시겠습니까?`],
    ['consultant', `크레탑 리포트와 최근 재무지표를 바탕으로 ${company}의 매출 ${report.annualRevenue || '120억 원'}, 영업이익 ${report.operatingProfit || '14억 원'}을 먼저 확인했습니다.`],
    ['ceo', '사업 실적은 나쁘지 않은데, 특별히 주의할 부분이 있을까요?'],
    ['consultant', `현재 핵심 검토 대상은 미처분이익잉여금 ${report.retainedEarnings || '45억 원'}과 가지급금 ${report.provisionalPayment || '5억 원'}입니다.`],
    ['ceo', '잉여금은 회사에 남겨 둔 이익이고 가지급금도 일시적인 항목인데 문제가 큰가요?'],
    ['consultant', '잉여금은 비상장주식 평가액을 높일 수 있고, 가지급금은 인정이자와 상여 처분으로 이어질 수 있어 함께 관리해야 합니다.'],
    ['ceo', '그렇다면 매년 세금 부담이 실제로 발생할 수 있다는 말씀이군요.'],
    ['consultant', '맞습니다. 상법과 세법에 맞는 배당가능이익 검토, 주주총회 절차, 정관 정비를 순서대로 확인해야 합니다.'],
    ['ceo', '자기주식 취득이나 이익소각을 활용할 때 세무상 문제가 생기지는 않습니까?'],
    ['consultant', '객관적인 주식가치 평가와 적법한 의사록, 거래 목적과 자금 흐름을 갖추면 사전 검토를 통해 위험을 줄일 수 있습니다.'],
    ['ceo', '임원 퇴직금 규정이나 정관도 함께 점검할 수 있습니까?'],
    ['consultant', '네. 정관과 주주총회 결의를 점검하고, 임원보수와 퇴직금 규정을 회사 상황에 맞게 정비하는 단계도 포함하겠습니다.'],
    ['ceo', '실행 전에 절세 효과를 숫자로 확인할 수 있는 시뮬레이션이 필요하겠습니다.'],
    ['consultant', `좋습니다. 다음 미팅에는 ${company}의 최근 세무조정계산서, 정관, 주주명부를 바탕으로 ${categoryTitle} 맞춤 시뮬레이션과 실행 로드맵을 준비하겠습니다.`],
  ].map(([speaker, content], index) => ({
    turnNumber: index + 1,
    stage: (Math.min(4, Math.floor(index / 4) + 1)),
    stageName: `${Math.min(4, Math.floor(index / 4) + 1)}단계: ${index < 4 ? '라포 형성 및 리포트 브리핑' : index < 8 ? '문제점 제기 및 리스크 분석' : index < 12 ? '솔루션 제안 및 심층 질의응답' : '실행 절차 및 차기 미팅 유도'}`,
    speaker,
    speakerTitle: speaker === 'consultant' ? `한화피플라이프 대전글로리사업단 ${consultant}` : `${ceo} 대표이사`,
    content,
    legalKeywords: ['상법 제341조', '상법 제388조', '법인세법 제52조'],
    keyPointSummary: '리포트 수치 기반 핵심 상담 포인트',
  }));

  return {
    id: `scenario_${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    report,
    category,
    categoryTitle,
    dialogueTurns: turns,
    analysis: {
      riskSummary: [
        { title: `미처분이익잉여금 ${report.retainedEarnings || '45억 원'} 점검`, description: '누적 잉여금은 비상장주식 평가액과 승계 세 부담에 영향을 줄 수 있습니다.', estimatedTaxOrLoss: '전문 시뮬레이션 필요' },
        { title: `가지급금 ${report.provisionalPayment || '5억 원'} 인정이자 점검`, description: '업무무관 가지급금은 인정이자와 세무상 조정 대상이 될 수 있습니다.', estimatedTaxOrLoss: '연간 추가 세 부담 검토' },
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
