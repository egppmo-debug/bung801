import { ConsultingCategory, CorporateReport } from '../types';

export const CATEGORY_INFO: Record<
  ConsultingCategory,
  {
    code: string;
    name: string;
    badge: string;
    description: string;
    coreRisks: string[];
    coreSolutions: string[];
    laws: string[];
  }
> = {
  category_1: {
    code: '카테고리 1',
    name: '경영 효율화 및 제도 정비',
    badge: '정관정비 / 임원보수 / 노무',
    description: '임원 보수·상여·퇴직금 지급규정, 원시정관 개정, 배당 및 지배구조 개편, 노무 리스크 예방',
    coreRisks: [
      '정관 내 임원 퇴직금 규정 부재 시 전액 손금불산입 및 근로소득세 최고세율(최대 49.5%) 추징',
      '상법 제388조 위반 시 주주총회 결의 없는 임원보수는 부당행위계산부인 대상',
      '유족보상 및 재해보상 규정 미비로 인한 대표 유고 시 유족간 분쟁 및 세무 리스크'
    ],
    coreSolutions: [
      '상법 및 세법 요건에 부합하는 정관 전면 개정 (중간배당, 자기주식, 주식매수선택권 등)',
      '임원 퇴직금·유족보상 지급규정 주주총회 특별결의 제정',
      '경영인정기보험을 활용한 퇴직재원 마련 및 법인 손비 처리 플랜'
    ],
    laws: ['상법 제388조 (이사의 보수)', '법인세법 시행령 제44조 (임원퇴직금 손금산입)', '소득세법 제22조']
  },
  category_2: {
    code: '카테고리 2',
    name: '재무구조 및 세무최적화',
    badge: '잉여금 처분 / 가지급금 / 자사주',
    description: '미처분이익잉여금 처분, 가지급금 정리, 자기주식 취득(이익소각), 차등배당, 법인세 절세',
    coreRisks: [
      '잉여금 누적으로 비상장주식 평가액 폭등 → 상속·증여 시 최고세율 50% 과표 직격탄',
      '가지급금에 대한 매년 4.6% 인정이자 계산 및 대표 상여처분(소득세 누진가산)',
      '법인 차입금 이자 중 가지급금 상당액 지급이자 손금불산입(법인세 추가 부담)',
      '대표 퇴임 또는 폐업 시 가지급금 전액 대표 상여처분으로 일시 소득세 폭탄'
    ],
    coreSolutions: [
      '배당재원 및 잉여금을 활용한 자기주식 취득 후 이익소각 플랜',
      '특허권(직무발명) 또는 대표 개인 자산 양수도를 통한 가지급금 상계',
      '배우자 증여재산공제(6억원)를 활용한 주식 증여 및 법인 감자 소각 전략',
      '정기배당 및 차등배당을 통한 지분 분산 및 종합소득세 분산 플랜'
    ],
    laws: ['법인세법 제28조 (지급이자의 손금불산입)', '법인세법 제52조 (부당행위계산의 부인)', '상법 제341조 (자기주식의 취득)']
  },
  category_3: {
    code: '카테고리 3',
    name: '경정청구(세금환급)',
    badge: '5년 과오납 환급 / 고용증대세액공제',
    description: '국세기본법 제45조의2에 근거한 지난 5년간 과오납 법인세 정밀 환급, 조특법상 고용·투자 세액공제',
    coreRisks: [
      '일반 기장 세무사의 단순 장부 작성으로 조특법상 각종 세액공제·감면 누락',
      '5년 경과 시 국세기본법상 제척기간 만료로 정당한 과오납 환급 권리 영구 소멸',
      '상시근로자 증가에도 불구하고 고용증대세액공제(청년 1인당 최대 1,550만원/년) 미적용'
    ],
    coreSolutions: [
      '사후 세무조사 리스크 없는 국세기본법 제45조의2 정당한 권리 행사 경정청구',
      '조특법 제29조의7 고용증대세액공제 및 통합고용세액공제 5개년 전수 분석',
      '연구개발(R&D) 세액공제, 통합투자세액공제 소급 적용을 통한 수천만~수억원 법인통장 환급'
    ],
    laws: ['국세기본법 제45조의2 (경정 등의 청구)', '조세특례제한법 제29조의7 (고용증대세액공제)', '조특법 제24조 (통합투자세액공제)']
  },
  category_4: {
    code: '카테고리 4',
    name: '미래 성장 및 인증 / M&A',
    badge: '기업부설연구소 / 벤처 / 기업가치',
    description: '기업부설연구소·전담부서 설립, 벤처기업/이노비즈 인증, 비상장 기업가치 평가, 지분매각 및 M&A',
    coreRisks: [
      '연구소 사후관리(인력변동, 도면미비 등) 소홀로 연구인력개발비 세액공제 추징 리스크',
      '인증 부재로 인한 정책자금 융자 가점 탈락 및 법인세·취득세 감면 혜택 상실',
      '사전 기업가치 관리 부재로 투자유치나 M&A 매각 협상 시 헐값 평가'
    ],
    coreSolutions: [
      '기업부설연구소/연구개발전담부서 KOITA 인증 및 사후관리 컴플라이언스 체계 구축',
      '혁신성장유형 벤처기업 인증 및 이노비즈(Inno-Biz) 인증을 통한 법인세 50% 감면 및 우대금리 확보',
      '현금흐름할인법(DCF) 및 상증세법상 주가 평가를 기반으로 한 투자유치/M&A 로드맵'
    ],
    laws: ['기초연구진흥 및 기술개발지원에 관한 법률', '벤처기업육성에 관한 특별조치법', '조특법 제10조 (연구·인력개발비 세액공제)']
  },
  category_5: {
    code: '카테고리 5',
    name: '가업 승계 및 자산 이전',
    badge: '비상장주식평가 / 가업상속공제 / 특례',
    description: '상증세법상 비상장주식 보충적 평가액 관리, 가업상속공제(최대 600억), 증여세 과세특례, 가족법인 승계',
    coreRisks: [
      '순손익가치(60%)와 순자산가치(40%) 반영 시 비상장주식 주가 폭등으로 상속세 부담 가중',
      '사전 준비 없이 대표 유고 시 주식 상속세 납부를 위한 지분 강제 매각 및 경영권 위협',
      '가업상속공제 5년간 사후관리 요건(고용 90%, 지분유지, 주된업종 변경제한) 미숙지로 사후 추징'
    ],
    coreSolutions: [
      '조특법 제30조의5 증여세 과세특례(10%~20% 저율 분리과세)를 활용한 생전 조기 지분 이전',
      '상속세및증여세법 제18조의2 가업상속공제(10년~30년 이상 영위 시 300억~600억원 공제) 정밀 플랜',
      '대표이사 유고 시 상속세 재원(현금) 마련을 위한 CEO 경영인정기보험 컨설팅',
      '가족법인(지주회사) 설립을 통한 신규 사업 자산 배분 및 주가 희석 전략'
    ],
    laws: ['상속세 및 증여세법 제18조의2 (가업상속공제)', '조특법 제30조의5 (가업승계 증여세 과세특례)', '상증세법 제60조 및 제63조 (비상장주식 평가)']
  }
};

export const SAMPLE_REPORTS: Record<ConsultingCategory, CorporateReport> = {
  category_1: {
    companyName: '(주)대덕정밀기계',
    ceoName: '김진성',
    consultantName: '담소영 단장',
    industry: '정밀 금형 및 자동차 부품 가공',
    establishedYear: 2008,
    annualRevenue: '145억 원',
    operatingProfit: '16억 원',
    retainedEarnings: '42억 원',
    provisionalPayment: '3억 2,000만 원',
    shareholders: '김진성(대표) 80%, 배우자 20%',
    employeeCount: 42,
    articlesStatus: '설립 당시 2008년 표준정관 그대로 사용 중. 임원퇴직금 규정 및 중간배당 조항 없음.',
    debtRatio: '115%',
    category: 'category_1',
    customNote: '대표가 15년 넘게 회사를 키웠으나 퇴직금 규정이 없어 은퇴 자금 수령 시 세금 우려가 큼. 최근 노무 점검 대비 및 지배구조 정비 시급.'
  },
  category_2: {
    companyName: '(주)한빛케미칼',
    ceoName: '이동현',
    consultantName: '담소영 단장',
    industry: '산업용 정밀화학 코팅제 제조',
    establishedYear: 2011,
    annualRevenue: '180억 원',
    operatingProfit: '21억 원',
    retainedEarnings: '58억 원',
    provisionalPayment: '7억 8,000만 원',
    shareholders: '이동현(대표) 75%, 배우자 15%, 자녀(성년) 10%',
    employeeCount: 38,
    articlesStatus: '2015년 일부 개정되었으나 자기주식 취득 및 차등배당 규정 미비.',
    debtRatio: '138%',
    category: 'category_2',
    customNote: '과거 공장 증축 및 원자재 급등기 법인 계좌에서 인출한 대표 가지급금이 7억 8천만원 누적됨. 인정이자 4.6%로 매년 수천만원 소득세 추가 납부 중이며 잉여금 58억으로 주가가 액면가의 20배 이상 폭등.'
  },
  category_3: {
    companyName: '(주)한국테크놀로지',
    ceoName: '정성호',
    consultantName: '담소영 단장',
    industry: '반도체 검사장비 및 제어 소프트웨어',
    establishedYear: 2017,
    annualRevenue: '95억 원',
    operatingProfit: '11억 원',
    retainedEarnings: '24억 원',
    provisionalPayment: '8,000만 원',
    shareholders: '정성호(대표) 65%, 공동창업자 25%, 엔젤투자자 10%',
    employeeCount: 48,
    articlesStatus: '2021년 벤처인증 당시 정관 갱신 완료.',
    debtRatio: '85%',
    category: 'category_3',
    customNote: '최근 5년간 매년 5~10명씩 청년 엔지니어를 적극 채용했으나 기장 세무대리인이 고용증대세액공제 및 통합고용세액공제를 일반 법인세 신고에서 누락함. 5개년 경정청구 시 약 1억 5천만~2억 원 상당 환급 예상.'
  },
  category_4: {
    companyName: '(주)글로벌센서',
    ceoName: '박태환',
    consultantName: '담소영 단장',
    industry: '스마트팩토리 산업용 IoT 센서 모듈',
    establishedYear: 2018,
    annualRevenue: '130억 원',
    operatingProfit: '17억 원',
    retainedEarnings: '35억 원',
    provisionalPayment: '1억 5,000만 원',
    shareholders: '박태환(대표) 60%, 기술이사 20%, 벤처캐피탈 20%',
    employeeCount: 34,
    articlesStatus: '주식매수선택권 규정 도입 완료, 이노비즈 만료 갱신 대기 중.',
    debtRatio: '98%',
    category: 'category_4',
    customNote: '내년 시리즈B 기관투자 유치 및 전략적 M&A 지분 매각을 검토 중. 기업부설연구소 R&D 인력 관리와 벤처·이노비즈 재인증을 통한 기업가치 극대화가 핵심 목표.'
  },
  category_5: {
    companyName: '(주)삼우정공',
    ceoName: '조병국',
    consultantName: '담소영 단장',
    industry: '방산 부품 및 유압 밸브 정밀가공',
    establishedYear: 1996,
    annualRevenue: '210억 원',
    operatingProfit: '26억 원',
    retainedEarnings: '74억 원',
    provisionalPayment: '2억 원',
    shareholders: '조병국(대표, 67세) 85%, 배우자 15%',
    employeeCount: 56,
    articlesStatus: '1996년 설립 당시 수기 정관 거의 유지. 가업승계 관련 규정 전무.',
    debtRatio: '78%',
    category: 'category_5',
    customNote: '업력 28년차, 대표 고령(67세). 아들(38세, 전무이사로 7년째 재직 중)에게 경영권을 안정적으로 넘기고자 함. 비상장주식 가치가 주당 35만원으로 추정되어 상속세 과표만 수십억원에 달해 가업승계 증여특례 및 가업상속공제 플랜 필수.'
  }
};
