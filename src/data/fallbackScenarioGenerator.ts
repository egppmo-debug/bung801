import { CorporateReport, GeneratedScenario, ConsultingCategory, DialogueTurn } from '../types';
import { CATEGORY_INFO } from './sampleReports';

export function createResilientScenario(report: CorporateReport): GeneratedScenario {
  const categoryKey: ConsultingCategory = (report.category as ConsultingCategory) || 'category_2';
  const catInfo = CATEGORY_INFO[categoryKey] || CATEGORY_INFO.category_2;
  const company = report.companyName || '주식회사 법인고객';
  const ceo = report.ceoName ? `${report.ceoName} 대표님` : '대표님';
  const consultant = report.consultantName || '담소영 단장';
  const rev = report.annualRevenue || '120억 원';
  const profit = report.operatingProfit || '14억 원';
  const retained = report.retainedEarnings || '45억 원';
  const prov = report.provisionalPayment || '5억 8,000만 원';
  const shares = report.shareholders || '대표 70%, 배우자 30%';

  const turns: DialogueTurn[] = [
    {
      turnNumber: 1,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'consultant',
      speakerTitle: `${consultant} (한화피플라이프 대전글로리사업단)`,
      emotion: '정중하고 신뢰감 있는 미소로 명함을 건네며',
      content: `안녕하십니까, ${ceo}. 한화피플라이프 대전글로리사업단 ${consultant}입니다. 바쁘신 일정 중에도 귀한 시간 내주셔서 진심으로 감사드립니다. 공장과 사옥을 둘러보니 임직원분들의 열정이 대단하십니다.`,
      legalKeywords: ['기업가치분석', '크레탑(CRETOP)'],
      keyPointSummary: '정중한 인사와 사업장 분위기 칭찬을 통한 친밀감 형성'
    },
    {
      turnNumber: 2,
      stage: 1,
      stageName: '1단계: 라포 형성 및 리포트 브리핑',
      speaker: 'ceo',
      speakerTitle: `${report.ceoName || '대표이사'} (${company})`,
      emotion: '차 한 잔을 권하며 다소 관망하는 표정으로',
      content: `어서 오세요, ${consultant}. 안 그래도 요새 법인 관련해서 찾아오는 분들이 많은데, 저희는 ${report.establishedYear || 2012}년 설립 이후 기장 세무사님과 회계 처리를 깔끔히 해와서 큰 문제는 없을 텐데요.`,
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
      speakerTitle: `${report.ceoName || '대표이사'} (${company})`,
      emotion: '리포트의 깔끔한 그래프와 지표를 들여다보며 흥미를 보이며',
      content: `허허, 제 책상 위에 있는 결산서보다 보기 쉽게 정리되어 있군요. 그런데 오늘 특별히 짚어주실 내용이 무엇인가요?`,
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
      speakerTitle: `${report.ceoName || '대표이사'} (${company})`,
      emotion: '약간 당황하며 안경을 고쳐 쓰고',
      content: `잉여금이야 회사가 돈을 잘 벌어서 통장에 유보해 둔 건데 그게 왜 폭탄입니까? 그리고 가지급금은 공장 신축하고 연구비 쓰다 보니 일시적으로 잡힌 건데요.`,
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
      content: `대표님, 상증세법상 비상장주식 보충적 평가 시 순자산가치와 순손익가치에 잉여금이 전액 반영되어 주당 가치가 액면가 5,000원에서 8~10배 이상 폭등합니다. 이 상태에서 대표님 신변에 변동이 생기거나 지분을 증여하시면 최고 세율 50%의 상속세 폭탄을 맞게 됩니다. 게다가 가지급금 ${prov}은 매년 4.6% 정기 인정이자 약 ${Math.round(parseInt(prov) || 2600 * 0.046)}만 원이 대표님 상여로 처분되어 근로소득세가 누진 추징됩니다.`,
      legalKeywords: ['상증세법 제60조', '보충적평가액', '법인세법 제52조(인정이자 4.6%)'],
      keyPointSummary: '주가 급등에 따른 상속세 50% 직격탄 및 4.6% 인정이자 소득세 누진 손실 수치화'
    },
    {
      turnNumber: 8,
      stage: 2,
      stageName: '2단계: 문제점 제기 및 리스크 분석',
      speaker: 'ceo',
      speakerTitle: `${report.ceoName || '대표이사'} (${company})`,
      emotion: '표정이 굳어지며 심각성을 인지한 듯',
      content: `매년 수천만 원의 세금이 인정이자로 새어나가고, 주식 가치가 올라서 상속세가 수십억 나온다는 말입니까? 기장 세무사한테 물어보면 매번 나중에 정리하자고만 하던데요.`,
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
      speakerTitle: `${report.ceoName || '대표이사'} (${company})`,
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
      speakerTitle: `${report.ceoName || '대표이사'} (${company})`,
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
      speakerTitle: `${report.ceoName || '대표이사'} (${company})`,
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
      keyPointSummary: '택일법(Alternative Choice)을 통한 2차 세무사 동석 미팅 100% 확정 유도'
    }
  ];

  return {
    id: `scenario_${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    report,
    category: categoryKey,
    categoryTitle: catInfo.name,
    analysis: {
      riskSummary: [
        {
          title: `누적 미처분이익잉여금(${retained})에 따른 비상장주식 평가액 급등`,
          description: '잉여금 과다로 상증세법상 주당 가치가 폭등하여 대표 유고 시 최고 50% 상속세 과표 부담 가중.',
          estimatedTaxOrLoss: '상속·증여세 예상 부담액 약 12억~25억 원 추정'
        },
        {
          title: `가지급금(${prov}) 4.6% 인정이자 및 상여 처분`,
          description: '법인세법 제52조에 따라 매년 4.6% 정기 인정이자가 대표 상여로 가산되어 최고세율 근로소득세 부과.',
          estimatedTaxOrLoss: `연간 소득세 및 법인세 추가 부담 약 ${Math.round((parseInt(prov) || 2800) * 0.046)}만 원/년`
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
    },
    dialogueTurns: turns
  };
}
