import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  Check, 
  FolderOpen, 
  Clock, 
  Trash2, 
  ArrowRight, 
  Building2, 
  AlertCircle,
  Search,
  RefreshCw,
  LogOut,
  FileCheck,
  ChevronRight,
  ShieldAlert,
  Layers,
  Database,
  ExternalLink
} from 'lucide-react';
import { User } from 'firebase/auth';
import { CorporateReport, ConsultingCategory, DEFAULT_CONSULTANT_NAME } from '../types';
import { CATEGORY_INFO, SAMPLE_REPORTS } from '../data/sampleReports';
import { initAuth, googleSignIn, logoutGoogle } from '../utils/googleAuth';
import { listDriveDocuments, fetchGoogleDocContent, fetchDrivePdfBase64, DriveFileItem } from '../utils/googleDrive';
import { ProblemDiagnosisCard } from './ProblemDiagnosisCard';

interface LoadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadReport: (report: CorporateReport, autoGenerate?: boolean) => void;
  currentConsultantName: string;
  initialCategory?: ConsultingCategory;
}

export const LoadReportModal: React.FC<LoadReportModalProps> = ({
  isOpen,
  onClose,
  onLoadReport,
  currentConsultantName,
  initialCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'file' | 'sample' | 'history'>('drive');
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Google Auth states
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);

  // Google Drive files states
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isFetchingDrive, setIsFetchingDrive] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');
  const [driveFilter, setDriveFilter] = useState<'all' | 'docs' | 'pdf'>('all');

  // Parsed CRETOP report preview state before final confirmation
  const [analyzedPreview, setAnalyzedPreview] = useState<CorporateReport | null>(null);
  // Selected category for the loaded report
  const [selectedCategory, setSelectedCategory] = useState<ConsultingCategory>(initialCategory || 'category_2');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory, isOpen]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // History from localStorage
  const [savedHistory, setSavedHistory] = useState<Array<{ date: string; report: CorporateReport }>>(() => {
    try {
      const saved = localStorage.getItem('hanwha_report_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Init Google Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        loadDriveFiles(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive files
  const loadDriveFiles = async (token: string, search?: string) => {
    setIsFetchingDrive(true);
    setErrorMessage(null);
    try {
      const files = await listDriveDocuments(token, search);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      setErrorMessage(err.message || 'Google Drive 파일을 불러오지 못했습니다.');
    } finally {
      setIsFetchingDrive(false);
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    setUnauthorizedDomain(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
        await loadDriveFiles(result.accessToken);
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.warn('Google login note:', err?.message || err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        const host = window.location.hostname || 'localhost';
        setUnauthorizedDomain(host);
        setErrorMessage(`접속 도메인(${host})이 Firebase 승인 목록에 없습니다. 아래 해결 가이드를 확인해 주세요.`);
      } else {
        setErrorMessage(err.message || 'Google 로그인에 실패했습니다. 팝업 차단 여부를 확인해 주세요.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google Logout
  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setAccessToken(null);
    setDriveFiles([]);
  };

  // Call backend AI to analyze CRETOP document (text or pdfBase64)
  const analyzeCretopReport = async (params: {
    text?: string;
    pdfBase64?: string;
    fileName: string;
    sourceType: 'google_drive' | 'local_file' | 'sample';
  }) => {
    setIsLoading(true);
    setLoadingStep('크레탑(CRETOP) 법인 리포트 문서 AI 정밀 분석 중...');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/report/analyze-cretop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: params.text,
          pdfBase64: params.pdfBase64,
          fileName: params.fileName,
          consultantName: currentConsultantName || DEFAULT_CONSULTANT_NAME,
          sourceType: params.sourceType,
        }),
      });

      if (!res.ok) {
        const responseText = await res.text();
        let errorMessage = '';
        try {
          errorMessage = JSON.parse(responseText).error || '';
        } catch {
          errorMessage = responseText;
        }
        if (res.status === 413) {
          throw new Error('리포트 파일이 너무 큽니다. 50MB 이하의 PDF 또는 문서 파일을 사용해 주세요.');
        }
        throw new Error(errorMessage || '크레탑 리포트 분석에 실패했습니다.');
      }

      const data = await res.json();
      if (data.report) {
        setAnalyzedPreview(data.report);
        setSelectedCategory(data.report.category || initialCategory || 'category_2');
      } else {
        throw new Error('리포트 분석 데이터를 수신하지 못했습니다.');
      }
    } catch (err: any) {
      console.error('Analyze Cretop error:', err);
      setErrorMessage(err.message || '크레탑 리포트 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Handle Google Drive file selection
  const handleSelectDriveFile = async (file: DriveFileItem) => {
    if (!accessToken) {
      setErrorMessage('Google 계정 인증이 필요합니다.');
      return;
    }

    setIsLoading(true);
    setLoadingStep(`Google Drive에서 [${file.name}] 다운로드 중...`);
    setErrorMessage(null);

    try {
      const isGoogleDoc = file.mimeType === 'application/vnd.google-apps.document';
      const isPdf = file.mimeType === 'application/pdf' || file.name.endsWith('.pdf');

      if (isGoogleDoc) {
        const docText = await fetchGoogleDocContent(accessToken, file.id);
        await analyzeCretopReport({
          text: docText,
          fileName: file.name,
          sourceType: 'google_drive',
        });
      } else if (isPdf) {
        const { base64 } = await fetchDrivePdfBase64(accessToken, file.id);
        await analyzeCretopReport({
          pdfBase64: base64,
          fileName: file.name,
          sourceType: 'google_drive',
        });
      } else {
        // General text fallback
        const text = await fetchGoogleDocContent(accessToken, file.id);
        await analyzeCretopReport({
          text,
          fileName: file.name,
          sourceType: 'google_drive',
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || '파일을 불러오는 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  // Handle Local File upload (PDF, Docs, TXT)
  const processLocalFile = (file: File) => {
    setErrorMessage(null);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      setIsLoading(true);
      setLoadingStep(`PDF 파일 [${file.name}] 읽는 중...`);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          let binary = '';
          const bytes = new Uint8Array(buffer);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);

          await analyzeCretopReport({
            pdfBase64: base64,
            fileName: file.name,
            sourceType: 'local_file',
          });
        } catch (err: any) {
          setErrorMessage(err.message || 'PDF 파일을 처리하지 못했습니다.');
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Text or Docx/TXT
      setIsLoading(true);
      setLoadingStep(`문서 파일 [${file.name}] 읽는 중...`);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          await analyzeCretopReport({
            text,
            fileName: file.name,
            sourceType: 'local_file',
          });
        } catch (err: any) {
          setErrorMessage(err.message || '문서 파일을 처리하지 못했습니다.');
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  // Load realistic CRETOP sample document for instant trial
  const handleSelectSampleCretop = (sampleKey: 'sample_daeil' | 'sample_hightech' | 'sample_dongwon') => {
    let sampleDocText = '';
    let docName = '';

    if (sampleKey === 'sample_daeil') {
      docName = '[크레탑 분석] (주)대일정밀_기업분석보고서.pdf';
      sampleDocText = `
[한국평가데이터 CRETOP 기업종합분석보고서]
기업명: (주)대일정밀
대표이사: 김태진 (1964년생)
주요업종: 자동차 엔진용 정밀 금속가공 및 조립
설립연도: 2012년 4월 (업력 13년)
결산기: 2023년 12월
기업신용등급: BBB+ (양호)
현금흐름등급: CR-2 (우수)

[재무상태표 및 손익 현황 요약]
- 최근 연매출액: 165억 원 (전년 대비 12% 성장)
- 최근 영업이익: 18억 5,000만 원 (영업이익률 11.2%)
- 당기순이익: 14억 2,000만 원
- 자본총계: 78억 원
- 미처분이익잉여금: 45억 원 (사내유보금 과다 축적)
- 유동자산 중 단기대여금(가지급금): 7억 2,000만 원 (대표이사 인정이자 매년 발생 중)
- 부채총계: 98억 원 (부채비율 125%)
- 임직원 수: 42명 (상시 근로자)
- 주주 및 지분 구조: 김태진 대표이사 70%, 배우자 이영희 20%, 장남 김현우 10%
- 정관 현황: 2012년 설립 당시 법무사 표준정관 유지. 임원 퇴직금 지급규정 없음(근로기준법 준용 위험), 유족보상 규정 부재, 중간배당 규정 없음.

[크레탑 종합 분석 의견]
우수한 기술력과 납품 실적으로 매출과 영업이익이 매년 급증하고 있으나, 누적된 미처분이익잉여금(45억)으로 인해 비상장주식 1주당 보충적 평가액이 설립 시(5,000원) 대비 12배 이상 급등함.
특히 대표이사 가지급금(7.2억) 방치 시 연 4.6% 인정이자(약 3,300만 원)에 대해 매년 상여처분 소득세가 가산되며, 지급이자 손금불산입 법인세 패널티가 가중됨.
자사주 이익소각 플랜 및 배당정책을 활용한 가지급금 정리와 잉여금 출구전략 수립이 최우선 시급 과제임.
`;
    } else if (sampleKey === 'sample_hightech') {
      docName = '[크레탑 분석] (주)한국하이텍_기업신용평가서.pdf';
      sampleDocText = `
[CRETOP 중견기업 정밀 신용분석 보고서]
기업명: (주)한국하이텍
대표이사: 박성호 (1958년생)
주요업종: 반도체 검사장비 부품 및 센서 모듈 제조
설립연도: 2008년 2월 (업력 17년)
기업신용등급: A- (우수)
현금흐름등급: CR-1 (최우수)

[재무 현황]
- 연매출액: 235억 원
- 영업이익: 32억 원
- 미처분이익잉여금: 68억 원
- 가지급금: 2억 원
- 부채비율: 85% (초우량)
- 주주지분: 대표이사 85%, 차남 15% (장남은 관계사 근무)
- 임직원 수: 58명
- 특이사항: 대표이사 60대 후반 진입, 2세(차남)가 상무로 입사하여 경영 수업 중이나 상속세 예상 세액이 35억 원 이상 추정되어 가업상속공제 요건(10년 사후관리, 고용유지) 충족 여부 및 사전 지분 분산이 시급한 상황.
`;
    } else {
      docName = '[크레탑 분석] 동원오토모티브(주)_재무분석보고서.pdf';
      sampleDocText = `
[한국평가데이터 CRETOP 기업분석표]
기업명: 동원오토모티브(주)
대표이사: 정동원
주요업종: 친환경차 알루미늄 다이캐스팅 부품 제조
설립연도: 2015년 6월
기업신용등급: BBB0 (보통)
현금흐름등급: CR-3 (보통)

[재무 현황]
- 연매출액: 95억 원
- 영업이익: 8억 5,000만 원
- 미처분이익잉여금: 24억 원
- 가지급금: 0원
- 부채비율: 145%
- 임직원 수: 28명
- 정관 현황: 2015년 원시정관 그대로 방치. 대표이사 급여 및 상여금 한도 주총결의 누락, 임원퇴직금 지급배수 규정 부재로 대표 퇴직 시 전액 근로소득세 과세 위험.
`;
    }

    analyzeCretopReport({
      text: sampleDocText,
      fileName: docName,
      sourceType: 'sample',
    });
  };

  // Filter drive files by search query and type
  const filteredDriveFiles = driveFiles.filter((file) => {
    if (driveFilter === 'docs' && file.mimeType !== 'application/vnd.google-apps.document') {
      return false;
    }
    if (driveFilter === 'pdf' && file.mimeType !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return false;
    }
    return true;
  });

  // Confirm loading the analyzed report
  const handleConfirmReport = (autoGenerate: boolean = false) => {
    if (!analyzedPreview) return;
    const finalReport: CorporateReport = {
      ...analyzedPreview,
      category: selectedCategory,
    };
    onLoadReport(finalReport, autoGenerate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-orange-950/40 shrink-0">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  법인 분석 리포트 불러오기 (크레탑 기반 구글 문서 / PDF)
                </h2>
                <span className="text-xs font-semibold text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/40">
                  담당: {currentConsultantName || DEFAULT_CONSULTANT_NAME}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                구글 드라이브(Google Drive) 또는 내 PC의 크레탑(CRETOP) 분석 리포트를 불러와 가상 시나리오를 생성합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 bg-slate-950/90 border-b border-slate-800">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center animate-pulse">
                <Sparkles className="w-7 h-7 text-orange-400 animate-spin" />
              </div>
            </div>
            <div>
              <div className="text-base font-bold text-slate-100">
                {loadingStep || '크레탑(CRETOP) 법인 리포트 AI 정밀 판독 중...'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                재무상태표, 손익계산서, 신용등급, 가지급금 인정이자, 주주지분율을 추출하고 있습니다.
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-slate-200 text-[11px]"
            >
              닫기
            </button>
          </div>
        )}

        {/* If Analyzed Preview is Ready, show confirmation screen */}
        {analyzedPreview ? (
          <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4 bg-slate-950/40">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <span>크레탑(CRETOP) 법인 분석 판독 완료</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({analyzedPreview.sourceDocName || '분석 문서'})
                    </span>
                  </h3>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/30">
                    추천 과제: {CATEGORY_INFO[analyzedPreview.category]?.code} {CATEGORY_INFO[analyzedPreview.category]?.name}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  리포트에서 재무 지표와 핵심 리스크가 정상 추출되었습니다. 확인 후 즉시 가상 상담 시나리오를 생성할 수 있습니다.
                </p>
              </div>
            </div>

            {/* Extracted Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">기업명 / 대표자</div>
                <div className="text-xs font-bold text-slate-100 mt-0.5 truncate">
                  {analyzedPreview.companyName}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {analyzedPreview.ceoName} 대표 ({analyzedPreview.establishedYear}년 설립)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">신용등급 / 현금흐름</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  {analyzedPreview.creditRating || 'BBB'} / {analyzedPreview.cashFlowRating || 'CR-2'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  부채비율: {analyzedPreview.debtRatio}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">연매출액 / 영업이익</div>
                <div className="text-xs font-bold text-amber-300 mt-0.5">
                  {analyzedPreview.annualRevenue}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  영업익: {analyzedPreview.operatingProfit}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-rose-400 font-semibold">잉여금 / 가지급금</div>
                <div className="text-xs font-bold text-rose-300 mt-0.5">
                  잉여금: {analyzedPreview.retainedEarnings}
                </div>
                <div className="text-[10px] text-orange-400 mt-0.5 truncate font-semibold">
                  가지급금: {analyzedPreview.provisionalPayment}
                </div>
              </div>
            </div>

            {/* CRETOP AI Summary */}
            {analyzedPreview.cretopSummary && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>크레탑 정밀 분석 소견 및 대전글로리사업단 공략 포인트</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {analyzedPreview.cretopSummary}
                </p>
              </div>
            )}

            {/* AI Problem Diagnosis and 5 Consulting Categories Recommendation */}
            <ProblemDiagnosisCard
              report={analyzedPreview}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              showCategoryCards={true}
            />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setAnalyzedPreview(null)}
                className="w-full sm:w-auto px-3.5 py-2.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                ← 다른 리포트 선택
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleConfirmReport(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition text-xs cursor-pointer"
                >
                  수치 검토 및 확인
                </button>

                <button
                  onClick={() => handleConfirmReport(true)}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-orange-950/40 text-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>
                    {selectedCategory === (analyzedPreview.recommendedCategory || 'category_2') ? '⭐ ' : ''}
                    [{CATEGORY_INFO[selectedCategory]?.code}] <span className="sm:hidden">즉시 생성</span><span className="hidden sm:inline">15턴 시나리오 즉시 생성</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 text-xs overflow-x-auto scrollbar-none">
              <button
                id="tab-load-drive"
                onClick={() => setActiveTab('drive')}
                className={`pb-2 px-2.5 sm:pb-2.5 sm:px-3 font-semibold border-b-2 transition flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-xs ${
                  activeTab === 'drive'
                    ? 'border-orange-500 text-orange-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="sm:hidden">드라이브</span>
                <span className="hidden sm:inline">구글 드라이브</span>
              </button>

              <button
                id="tab-load-file"
                onClick={() => setActiveTab('file')}
                className={`pb-2 px-2.5 sm:pb-2.5 sm:px-3 font-semibold border-b-2 transition flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-xs ${
                  activeTab === 'file'
                    ? 'border-orange-500 text-orange-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="sm:hidden">내 파일</span>
                <span className="hidden sm:inline">내 파일 (PDF / 문서)</span>
              </button>

              <button
                id="tab-load-sample"
                onClick={() => setActiveTab('sample')}
                className={`pb-2 px-2.5 sm:pb-2.5 sm:px-3 font-semibold border-b-2 transition flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-xs ${
                  activeTab === 'sample'
                    ? 'border-orange-500 text-orange-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="sm:hidden">샘플(3종)</span>
                <span className="hidden sm:inline">크레탑 실전 샘플 (3종)</span>
              </button>

              <button
                id="tab-load-history"
                onClick={() => setActiveTab('history')}
                className={`pb-2 px-2.5 sm:pb-2.5 sm:px-3 font-semibold border-b-2 transition flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-xs ${
                  activeTab === 'history'
                    ? 'border-orange-500 text-orange-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="sm:hidden">최근({savedHistory.length})</span>
                <span className="hidden sm:inline">최근 작업 리포트 ({savedHistory.length})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 overflow-y-auto flex-1 text-xs">
              {/* TAB 1: GOOGLE DRIVE */}
              {activeTab === 'drive' && (
                <div className="space-y-4">
                  {!googleUser || !accessToken ? (
                    <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                        <FolderOpen className="w-7 h-7" />
                      </div>
                      <div className="max-w-md mx-auto">
                        <h3 className="text-sm font-bold text-slate-100">
                          Google 드라이브 연결
                        </h3>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                          구글 계정으로 로그인하여 드라이브에 보관된 크레탑(CRETOP) 분석 구글 문서 또는 PDF 리포트를 간편하게 불러옵니다.
                        </p>
                      </div>

                      {/* Google Sign-in button compliant with workspace_integration skill */}
                      <div className="pt-2">
                        <button
                          id="btn-google-signin"
                          onClick={handleGoogleLogin}
                          disabled={isLoggingIn}
                          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>{isLoggingIn ? '구글 계정 연결 중...' : 'Google 계정으로 로그인'}</span>
                        </button>
                      </div>

                      {/* Unauthorized Domain Error Guidance Card */}
                      {unauthorizedDomain && (
                        <div className="text-left bg-amber-950/50 border border-amber-500/40 rounded-xl p-4 space-y-3 text-xs text-amber-200 mt-2">
                          <div className="flex items-center gap-2 font-bold text-amber-300">
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Firebase 인증 승인 도메인 등록 필요</span>
                          </div>
                          
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            현재 접속 중인 도메인 <code className="text-amber-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 font-bold">{unauthorizedDomain}</code>이 Firebase Authentication의 <strong>승인된 도메인(Authorized Domains)</strong>에 등록되어 있지 않아 로그인이 차단되었습니다.
                          </p>

                          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2 text-[11px]">
                            <div className="font-semibold text-slate-200">🛠️ 해결 방법 (2가지):</div>
                            
                            {unauthorizedDomain === '127.0.0.1' && (
                              <div className="p-2 bg-slate-950 rounded border border-amber-500/30 flex items-center justify-between gap-2">
                                <div>
                                  <div className="font-bold text-amber-300">방법 1: localhost로 접속 (가장 빠름)</div>
                                  <div className="text-slate-400 text-[10px]">127.0.0.1 대신 localhost로 접속하면 즉시 승인됩니다.</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    window.location.hostname = 'localhost';
                                  }}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px] transition shrink-0 cursor-pointer"
                                >
                                  localhost로 이동
                                </button>
                              </div>
                            )}

                            <div className="space-y-1 text-slate-300">
                              <div className="font-bold text-slate-200">방법 2: Firebase 콘솔에 도메인 추가</div>
                              <ol className="list-decimal list-inside space-y-0.5 text-slate-400 text-[10px] pl-1">
                                <li>
                                  <a 
                                    href="https://console.firebase.google.com/project/gen-lang-client-0243488691/authentication/settings" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-amber-400 underline font-semibold inline-flex items-center gap-0.5"
                                  >
                                    Firebase 콘솔 인증 설정 열기 <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </li>
                                <li><strong>Authentication</strong> → <strong>Settings(설정)</strong> → <strong>승인된 도메인(Authorized domains)</strong> 이동</li>
                                <li><strong>[도메인 추가]</strong> 버튼 클릭 후 <code className="text-amber-300 font-mono bg-slate-800 px-1 rounded">{unauthorizedDomain}</code> 입력 및 저장</li>
                              </ol>
                            </div>
                          </div>

                          <div className="pt-1 flex items-center justify-between gap-2 border-t border-amber-500/20">
                            <span className="text-[10px] text-slate-400">구글 로그인 없이 바로 파일 사용하기:</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('file');
                                setErrorMessage(null);
                              }}
                              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>내 파일 (PDF) 탭으로 이동</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500">
                        * 읽기 전용(ReadOnly) 권한으로 접근하며, 파일이 임의로 수정 또는 삭제되지 않습니다.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Connected User Bar */}
                      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {googleUser.photoURL ? (
                            <img
                              src={googleUser.photoURL}
                              alt={googleUser.displayName || 'Google User'}
                              className="w-7 h-7 rounded-full border border-slate-700"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                              {(googleUser.displayName || googleUser.email || 'G')[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                              <span>{googleUser.displayName || '구글 사용자'}</span>
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                                연결됨
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">
                              {googleUser.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadDriveFiles(accessToken, driveSearch)}
                            disabled={isFetchingDrive}
                            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                            title="새로고침"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingDrive ? 'animate-spin' : ''}`} />
                          </button>
                          <button
                            onClick={handleGoogleLogout}
                            className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-rose-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition flex items-center gap-1"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>로그아웃</span>
                          </button>
                        </div>
                      </div>

                      {/* Search and Filters */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                          <input
                            type="text"
                            value={driveSearch}
                            onChange={(e) => setDriveSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') loadDriveFiles(accessToken, driveSearch);
                            }}
                            placeholder="기업명 또는 리포트명 검색 (예: 크레탑, 재무분석, 삼양)..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setDriveFilter('all')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                              driveFilter === 'all'
                                ? 'bg-orange-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            전체
                          </button>
                          <button
                            onClick={() => setDriveFilter('docs')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                              driveFilter === 'docs'
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <FileText className="w-3 h-3 text-blue-300" />
                            <span>구글 문서</span>
                          </button>
                          <button
                            onClick={() => setDriveFilter('pdf')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                              driveFilter === 'pdf'
                                ? 'bg-red-600 text-white font-bold'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className="text-[10px] font-black text-rose-300">PDF</span>
                          </button>
                        </div>
                      </div>

                      {/* Drive Files List */}
                      {isFetchingDrive ? (
                        <div className="py-12 text-center text-slate-400">
                          <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-orange-400" />
                          <p>Google 드라이브 파일 목록을 조회하고 있습니다...</p>
                        </div>
                      ) : filteredDriveFiles.length === 0 ? (
                        <div className="py-12 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 space-y-2">
                          <FolderOpen className="w-8 h-8 mx-auto text-slate-600" />
                          <p className="font-semibold text-slate-300">표시할 구글 문서 또는 PDF 파일이 없습니다.</p>
                          <p className="text-[11px] text-slate-500">
                            드라이브에 크레탑 리포트 구글 문서나 PDF를 저장하거나 검색어를 변경해 보세요.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                          {filteredDriveFiles.map((file) => {
                            const isDoc = file.mimeType === 'application/vnd.google-apps.document';
                            const isPdf = file.mimeType === 'application/pdf' || file.name.endsWith('.pdf');
                            return (
                              <div
                                key={file.id}
                                onClick={() => handleSelectDriveFile(file)}
                                className="p-3 bg-slate-950/60 border border-slate-800 hover:border-orange-500/60 rounded-xl cursor-pointer flex items-center justify-between group transition hover:bg-slate-800/40"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isDoc 
                                      ? 'bg-blue-950/80 text-blue-400 border border-blue-500/40' 
                                      : 'bg-red-950/80 text-red-400 border border-red-500/40'
                                  }`}>
                                    {isDoc ? <FileText className="w-4 h-4" /> : <span className="font-black text-[10px]">PDF</span>}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="font-semibold text-slate-200 text-xs truncate group-hover:text-orange-300 transition">
                                      {file.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                                      <span>{isDoc ? '구글 문서 (Google Docs)' : 'PDF 파일'}</span>
                                      {file.modifiedTime && (
                                        <span>수정일: {new Date(file.modifiedTime).toLocaleDateString()}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 text-orange-400 font-semibold text-xs opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition">
                                  <span>분석</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: LOCAL FILE UPLOAD (PDF / DOCS) */}
              {activeTab === 'file' && (
                <div className="space-y-4">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        processLocalFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                      dragActive
                        ? 'border-orange-500 bg-orange-950/20 text-orange-300'
                        : 'border-slate-700 hover:border-slate-500 bg-slate-950/40 text-slate-300'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-orange-400 border border-slate-700 shadow-inner">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">
                        크레탑(CRETOP) 법인 분석 리포트 파일 드래그 또는 클릭하여 선택
                      </div>
                      <div className="text-slate-400 text-xs mt-1">
                        지원 포맷: <span className="text-orange-400 font-semibold">PDF (.pdf)</span> 또는 <span className="text-blue-400 font-semibold">구글 문서 내보내기/문서 (.docx, .txt)</span>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processLocalFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-slate-400 text-[11px] leading-relaxed">
                    <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      <span>크레탑 리포트 AI 판독 안내</span>
                    </div>
                    <p>
                      한국평가데이터(KoDATA)의 크레탑(CRETOP) 정밀 분석 리포트 또는 이를 바탕으로 정리된 법인 상태 분석 문서를 업로드하면,
                      Gemini 모델이 재무제표(재무상태표, 손익계산서), 기업신용등급, 가지급금 인정이자, 미처분이익잉여금, 주주지분율을 판독하여 4단계 실전 상담 시나리오를 구성합니다.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: 3 CRETOP REALISTIC SAMPLES */}
              {activeTab === 'sample' && (
                <div className="space-y-3">
                  <div className="text-slate-300 text-xs">
                    실제 CRETOP 법인 리포트 기반 샘플 3종 중 하나를 선택하여 즉시 AI 분석 및 시나리오 생성을 체험할 수 있습니다:
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Sample 1: Daeil Precision */}
                    <div
                      onClick={() => handleSelectSampleCretop('sample_daeil')}
                      className="p-3.5 rounded-xl border border-slate-800 hover:border-orange-500/60 bg-slate-950/60 hover:bg-slate-800/60 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/30">
                          [B-02] 재무구조 및 세무최적화 추천
                        </span>
                        <span className="text-xs text-orange-400 group-hover:underline flex items-center gap-1 font-semibold">
                          선택 및 분석 <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="font-bold text-slate-100 text-xs">
                        (주)대일정밀 (대표: 김태진) | 신용등급 BBB+ / 매출 165억
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        미처분이익잉여금 45억 원 과다 축적 + 대표이사 가지급금 7억 2,000만 원 (4.6% 인정이자 과세 리스크 시한폭탄)
                      </div>
                    </div>

                    {/* Sample 2: Hankook HighTech */}
                    <div
                      onClick={() => handleSelectSampleCretop('sample_hightech')}
                      className="p-3.5 rounded-xl border border-slate-800 hover:border-orange-500/60 bg-slate-950/60 hover:bg-slate-800/60 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                          [E-05] 가업 승계 및 자산 이전 추천
                        </span>
                        <span className="text-xs text-purple-400 group-hover:underline flex items-center gap-1 font-semibold">
                          선택 및 분석 <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="font-bold text-slate-100 text-xs">
                        (주)한국하이텍 (대표: 박성호) | 신용등급 A- / 매출 235억
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        잉여금 68억으로 인한 주가 1주당 가치 급등, 대표이사 60대 후반, 2세 지분 이전 및 가업상속공제 사전대비 요망
                      </div>
                    </div>

                    {/* Sample 3: Dongwon Auto */}
                    <div
                      onClick={() => handleSelectSampleCretop('sample_dongwon')}
                      className="p-3.5 rounded-xl border border-slate-800 hover:border-orange-500/60 bg-slate-950/60 hover:bg-slate-800/60 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
                          [A-01] 경영 효율화 및 제도 정비 추천
                        </span>
                        <span className="text-xs text-blue-400 group-hover:underline flex items-center gap-1 font-semibold">
                          선택 및 분석 <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="font-bold text-slate-100 text-xs">
                        동원오토모티브(주) (대표: 정동원) | 신용등급 BBB0 / 매출 95억
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        설립 10년째 표준정관 유지, 임원퇴직금 규정 및 유족보상 규정 부재로 대표 퇴직 시 전액 근로소득세 과세 위험
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: RECENT HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {savedHistory.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      <p>최근 분석하거나 저장한 리포트 기록이 없습니다.</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        구글 드라이브 또는 파일에서 리포트를 분석하면 이곳에 자동으로 보관됩니다.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedHistory.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setAnalyzedPreview(item.report);
                            setSelectedCategory(item.report.category || initialCategory || 'category_2');
                          }}
                          className="p-3 bg-slate-950/70 border border-slate-800 hover:border-orange-500/60 rounded-xl cursor-pointer flex items-center justify-between group transition"
                        >
                          <div>
                            <div className="font-bold text-slate-100 flex items-center gap-2">
                              <span>{item.report.companyName || '무제 리포트'}</span>
                              <span className="text-[10px] text-slate-400">({item.report.ceoName} 대표)</span>
                              {item.report.sourceDocName && (
                                <span className="text-[10px] text-orange-400 bg-orange-950/60 px-1.5 py-0.2 rounded border border-orange-500/30">
                                  {item.report.sourceDocName}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              저장일: {item.date} | 매출 {item.report.annualRevenue} | 잉여금 {item.report.retainedEarnings} | 가지급금 {item.report.provisionalPayment}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-orange-400 font-semibold group-hover:underline">
                              불러오기
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = savedHistory.filter((_, i) => i !== idx);
                                setSavedHistory(updated);
                                localStorage.setItem('hanwha_report_history', JSON.stringify(updated));
                              }}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
