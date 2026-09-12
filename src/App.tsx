import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  Scale, 
  BookOpen, 
  CheckCircle2, 
  MessageSquare, 
  Award,
  ChevronRight,
  Printer,
  Mic2,
  Play,
  RotateCcw,
  Layers,
  FolderOpen,
  Headphones,
  Upload,
  ArrowRight,
  UserCheck,
  Plus,
  Check,
  Info
} from 'lucide-react';
import { 
  ConsultingCategory, 
  CorporateReport, 
  GeneratedScenario, 
  DialogueTurn,
  DEFAULT_CONSULTANT_NAME,
  createEmptyReport
} from './types';
import { CATEGORY_INFO, SAMPLE_REPORTS } from './data/sampleReports';
import { Header } from './components/Header';
import { ReportInputPanel } from './components/ReportInputPanel';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { DialogueViewer } from './components/DialogueViewer';
import { ConsultingAnalysisDeck } from './components/ConsultingAnalysisDeck';
import { InteractiveRoleplayModal } from './components/InteractiveRoleplayModal';
import { PrintExportModal } from './components/PrintExportModal';
import { LoadReportModal } from './components/LoadReportModal';
import { Mp3DownloadModal } from './components/Mp3DownloadModal';
import { ConsultantLiveNotes } from './components/ConsultantLiveNotes';
import { ProblemDiagnosisCard } from './components/ProblemDiagnosisCard';
import { SecurityLockScreen } from './components/SecurityLockScreen';
import { AdminSecurityModal } from './components/AdminSecurityModal';
import { 
  SecurityConfig, 
  DEFAULT_SECURITY_CONFIG, 
  fetchSecurityConfig, 
  subscribeSecurityConfig 
} from './lib/firebase';
import { speechService } from './utils/tts';

export function App() {
  // Security lock state: Always starts in locked mode whenever the app begins
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Security credentials state from Firebase Firestore
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(() => {
    try {
      const cached = localStorage.getItem('daejeon_glory_security_config');
      return cached ? JSON.parse(cached) : DEFAULT_SECURITY_CONFIG;
    } catch {
      return DEFAULT_SECURITY_CONFIG;
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  // Theme state: Default is Light Mode ('light'), toggleable to Dark Mode ('dark')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('daejeon_glory_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return false; // '라이트모드' 기본
    } catch {
      return false;
    }
  });

  // Sync theme class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      try {
        localStorage.setItem('daejeon_glory_theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      try {
        localStorage.setItem('daejeon_glory_theme', 'light');
      } catch {}
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Sync credentials with Firebase Firestore in real-time
  useEffect(() => {
    fetchSecurityConfig()
      .then((cfg) => {
        setSecurityConfig(cfg);
        setIsFirebaseLoading(false);
      })
      .catch((err) => {
        console.warn('[Firebase] Init error:', err);
        setIsFirebaseLoading(false);
      });

    // Real-time listener: updates propagate immediately across all connected FA smartphones & PCs
    const unsubscribe = subscribeSecurityConfig((updated) => {
      setSecurityConfig(updated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUnlock = () => {
    try {
      sessionStorage.setItem('daejeon_glory_unlocked', 'true');
    } catch {}
    setIsUnlocked(true);
  };

  const handleLockScreen = () => {
    try {
      sessionStorage.removeItem('daejeon_glory_unlocked');
    } catch {}
    setIsUnlocked(false);
  };

  // Consultant name: Default "담소영 단장", editable and persisted in localStorage
  const [consultantName, setConsultantName] = useState<string>(() => {
    try {
      return localStorage.getItem('hanwha_consultant_name') || DEFAULT_CONSULTANT_NAME;
    } catch {
      return DEFAULT_CONSULTANT_NAME;
    }
  });

  const handleUpdateConsultantName = (name: string) => {
    const trimmed = name.trim() || DEFAULT_CONSULTANT_NAME;
    setConsultantName(trimmed);
    try {
      localStorage.setItem('hanwha_consultant_name', trimmed);
    } catch (e) {
      console.warn(e);
    }
    setReport((prev) => ({
      ...prev,
      consultantName: trimmed,
    }));
    if (scenario) {
      setScenario((prev) => prev ? {
        ...prev,
        report: {
          ...prev.report,
          consultantName: trimmed,
        }
      } : null);
    }
  };

  // Category and Report states (Initial state starts empty as requested: "기본 샘플 데이터는 삭제하고")
  const [currentCategory, setCurrentCategory] = useState<ConsultingCategory>('category_2');
  const [report, setReport] = useState<CorporateReport>(() => 
    createEmptyReport('category_2', consultantName)
  );

  // Scenario state: restored from localStorage if available, or null (clean slate)
  const [scenario, setScenario] = useState<GeneratedScenario | null>(() => {
    try {
      const saved = localStorage.getItem('hanwha_active_scenario');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id) {
          const savedNotes = localStorage.getItem(`hanwha_scenario_notes_${parsed.id}`) 
            || (parsed.report?.companyName ? localStorage.getItem(`hanwha_company_notes_${parsed.report.companyName}`) : null);
          if (savedNotes !== null && savedNotes !== undefined) {
            parsed.consultantLiveNotes = savedNotes;
          }
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Handler to update live notes and keep them saved alongside the scenario
  const handleUpdateScenarioNotes = (newNotes: string) => {
    setScenario((prev) => {
      if (!prev) return null;
      const updated: GeneratedScenario = {
        ...prev,
        consultantLiveNotes: newNotes,
      };
      try {
        localStorage.setItem(`hanwha_scenario_notes_${prev.id}`, newNotes);
        if (prev.report?.companyName) {
          localStorage.setItem(`hanwha_company_notes_${prev.report.companyName}`, newNotes);
        }
        localStorage.setItem('hanwha_active_scenario', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist live notes:', e);
      }
      return updated;
    });
  };

  const [activeViewTab, setActiveViewTab] = useState<'script' | 'analysis'>('script');
  const [isInputOpen, setIsInputOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Audio playback states (browser TTS playback)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const isAutoPlayingRef = useRef(false);

  // Modals
  const [isRoleplayOpen, setIsRoleplayOpen] = useState(false);
  const [roleplayCeoTurn, setRoleplayCeoTurn] = useState<DialogueTurn | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoadReportModalOpen, setIsLoadReportModalOpen] = useState(false);
  const [isMp3ModalOpen, setIsMp3ModalOpen] = useState(false);
  const [selectedTurnForMp3, setSelectedTurnForMp3] = useState<number | undefined>(undefined);

  // Category switch handler
  const handleSelectCategory = (cat: ConsultingCategory) => {
    handleStopAudio();
    setCurrentCategory(cat);
    setReport((prev) => ({
      ...prev,
      category: cat,
    }));
  };

  // Reset to sample for the category if user explicitly desires
  const handleResetToSample = () => {
    const sample = SAMPLE_REPORTS[currentCategory];
    setReport({
      ...sample,
      consultantName,
    });
  };

  // Clear report form completely
  const handleClearReport = () => {
    setReport(createEmptyReport(currentCategory, consultantName));
  };

  // Handle report loaded from Modal (file upload, text parse, preset, history)
  const handleReportLoaded = (loadedReport: CorporateReport, autoGenerate?: boolean) => {
    const updated = {
      ...loadedReport,
      category: loadedReport.category || currentCategory,
      consultantName: loadedReport.consultantName || consultantName || DEFAULT_CONSULTANT_NAME,
    };
    setReport(updated);
    setCurrentCategory(updated.category);
    setIsInputOpen(!autoGenerate);
    setScenario(null); // Clear previous scenario so user can review the loaded report and generate
    try {
      localStorage.removeItem('hanwha_active_scenario');
    } catch {}

    if (autoGenerate) {
      handleGenerateAI(updated);
    }
  };

  // Save report to local history
  const saveToHistory = (savedReport: CorporateReport) => {
    try {
      const existing = localStorage.getItem('hanwha_report_history');
      const list = existing ? JSON.parse(existing) : [];
      const item = {
        date: new Date().toISOString().split('T')[0],
        report: savedReport,
      };
      // Keep up to 10 recent reports
      const updated = [item, ...list.filter((x: any) => x.report.companyName !== savedReport.companyName)].slice(0, 10);
      localStorage.setItem('hanwha_report_history', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Generate new scenario via Gemini API
  const handleGenerateAI = async (overrideReport?: CorporateReport) => {
    const activeReport = overrideReport || {
      ...report,
      category: currentCategory,
    };
    if (!activeReport.companyName.trim()) {
      alert('법인 리포트의 기업명을 입력해 주시거나 [리포트 불러오기]를 이용해 주세요.');
      setIsInputOpen(true);
      return;
    }

    setIsGenerating(true);
    handleStopAudio();

    try {
      const payloadReport = {
        ...activeReport,
        category: activeReport.category || currentCategory,
        consultantName: activeReport.consultantName || consultantName || DEFAULT_CONSULTANT_NAME,
      };
      setReport(payloadReport);

      const res = await fetch('/api/scenario/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: payloadReport }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'AI 시나리오 생성 요청에 실패했습니다.');
      }

      const data = await res.json();
      if (data.scenario) {
        const cachedNotes = localStorage.getItem(`hanwha_scenario_notes_${data.scenario.id}`)
          || localStorage.getItem(`hanwha_company_notes_${payloadReport.companyName}`)
          || '';
        const fullScenario: GeneratedScenario = {
          ...data.scenario,
          consultantLiveNotes: cachedNotes,
        };
        setScenario(fullScenario);
        try {
          localStorage.setItem('hanwha_active_scenario', JSON.stringify(fullScenario));
        } catch (e) {
          console.warn(e);
        }
        setIsInputOpen(false);
        setActiveTurnIndex(0);
        saveToHistory(payloadReport);
      }
    } catch (err: any) {
      console.error(err);
      alert(`[안내] ${err.message}\nGEMINI API 키 설정 및 연결 상태를 확인해 주세요.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Audio Playback Controls (Browser TTS)
  const handlePlayTurn = (turnIndex: number) => {
    if (!scenario || turnIndex < 0 || turnIndex >= scenario.dialogueTurns.length) return;

    speechService.stop();
    setActiveTurnIndex(turnIndex);
    setIsPlaying(true);
    setIsPaused(false);

    const turn = scenario.dialogueTurns[turnIndex];
    speechService.speak(turn.content, turn.speaker, {
      rate: playbackSpeed,
      onEnd: () => {
        if (isAutoPlayingRef.current) {
          if (turnIndex + 1 < scenario.dialogueTurns.length) {
            handlePlayTurn(turnIndex + 1);
          } else {
            isAutoPlayingRef.current = false;
            setIsPlaying(false);
            setIsPaused(false);
          }
        } else {
          setIsPlaying(false);
          setIsPaused(false);
        }
      },
    });
  };

  const handlePlayAll = () => {
    if (!scenario || scenario.dialogueTurns.length === 0) return;
    isAutoPlayingRef.current = true;
    handlePlayTurn(0);
  };

  const handlePauseAudio = () => {
    speechService.pause();
    setIsPaused(true);
  };

  const handleResumeAudio = () => {
    speechService.resume();
    setIsPaused(false);
  };

  const handleStopAudio = () => {
    isAutoPlayingRef.current = false;
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handlePrevTurn = () => {
    if (activeTurnIndex > 0) {
      handlePlayTurn(activeTurnIndex - 1);
    }
  };

  const handleNextTurn = () => {
    if (scenario && activeTurnIndex < scenario.dialogueTurns.length - 1) {
      handlePlayTurn(activeTurnIndex + 1);
    }
  };

  const handleChangeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying && !isPaused) {
      handlePlayTurn(activeTurnIndex);
    }
  };

  // Roleplay Practice
  const handlePracticeTurn = (ceoTurn: DialogueTurn) => {
    setRoleplayCeoTurn(ceoTurn);
    setIsRoleplayOpen(true);
    handleStopAudio();
  };

  const handleOpenGeneralRoleplay = () => {
    if (!scenario) return;
    const ceoTurn = scenario.dialogueTurns.find((t) => t.speaker === 'ceo');
    if (ceoTurn) {
      handlePracticeTurn(ceoTurn);
    }
  };

  // MP3 Download Triggers
  const handleOpenFullMp3Modal = () => {
    setSelectedTurnForMp3(undefined);
    setIsMp3ModalOpen(true);
  };

  const handleOpenSingleTurnMp3 = (turnIndex: number) => {
    setSelectedTurnForMp3(turnIndex);
    setIsMp3ModalOpen(true);
  };

  // Reset to new scenario
  const handleResetNewScenario = () => {
    handleStopAudio();
    setScenario(null);
    setReport(createEmptyReport(currentCategory, consultantName));
    setIsInputOpen(true);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const currentCategoryInfo = CATEGORY_INFO[currentCategory];

  // If locked, render the Daejeon Glory Security Lock Screen
  if (!isUnlocked) {
    return (
      <>
        <SecurityLockScreen
          securityConfig={securityConfig}
          onUnlock={handleUnlock}
          onOpenAdminAuth={() => setIsAdminModalOpen(true)}
          isFirebaseLoading={isFirebaseLoading}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
        />
        <AdminSecurityModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          securityConfig={securityConfig}
          onLockScreen={handleLockScreen}
          onConfigUpdated={(newCfg) => setSecurityConfig(newCfg)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-slate-950 transition-colors duration-200">
      {/* Top Header */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        onOpenRoleplay={handleOpenGeneralRoleplay}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenLoadReport={() => setIsLoadReportModalOpen(true)}
        onOpenMp3Modal={handleOpenFullMp3Modal}
        onToggleInput={() => setIsInputOpen(!isInputOpen)}
        isInputOpen={isInputOpen}
        isGenerating={isGenerating}
        consultantName={consultantName}
        onChangeConsultantName={handleUpdateConsultantName}
        hasScenario={!!scenario}
        onResetNewScenario={handleResetNewScenario}
        onOpenAdminCenter={() => setIsAdminModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Report Input & Settings Panel */}
        {isInputOpen && (
          <ReportInputPanel
            report={report}
            onChangeReport={setReport}
            onGenerateAI={handleGenerateAI}
            onClearReport={handleClearReport}
            onOpenLoadReport={() => setIsLoadReportModalOpen(true)}
            onSelectCategory={handleSelectCategory}
            isGenerating={isGenerating}
            onClose={() => setIsInputOpen(false)}
          />
        )}

        {/* CASE A: No Scenario Generated Yet (Clean State) */}
        {!scenario ? (
          <div className="space-y-6">
            {/* Welcome & Report Loading Workspace Card */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/70 border border-orange-500/30 text-orange-300 text-[11px] sm:text-xs font-semibold mb-4 max-w-full">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shrink-0"></span>
                  <span className="truncate">한화피플라이프 대전글로리사업단 컨설팅 지원 시스템</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight leading-tight">
                  법인 분석 리포트를 불러와 <br />
                  <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    4단계 실전 상담 시나리오(15턴)
                  </span>를 생성하세요.
                </h2>

                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  담당 컨설턴트 <strong className="text-slate-200">{consultantName}</strong> 님의 명의로 
                  고객사와의 실제 미팅 전 과정을 다루는 15턴 장문 심층 대화 스크립트와 상법·세법 근거 보고서가 생성됩니다.
                </p>
              </div>

              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {/* 1. File / Text Load */}
                <div 
                  onClick={() => setIsLoadReportModalOpen(true)}
                  className="p-5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-orange-500/40 hover:border-orange-500 cursor-pointer transition group shadow-lg shadow-orange-950/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-slate-100 mb-1 flex items-center justify-between">
                    <span>리포트 불러오기</span>
                    <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    준비된 <strong className="text-slate-300">JSON/TXT 파일 업로드</strong> 또는 상담 메모 텍스트 스마트 자동 파싱
                  </p>
                </div>

                {/* 2. Direct Form Fill */}
                <div 
                  onClick={() => {
                    setIsInputOpen(true);
                    const el = document.getElementById('input-company-name');
                    if (el) el.focus();
                  }}
                  className="p-5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-slate-100 mb-1 flex items-center justify-between">
                    <span>직접 리포트 작성</span>
                    <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    기업명, 매출액, 가지급금, 잉여금 등 핵심 지표를 입력 폼에 직접 타이핑
                  </p>
                </div>
              </div>

              {/* If report filled: STEP 2 - AI Problem Diagnosis & 5 Consulting Categories Selection */}
              {report.companyName.trim() && (
                <div className="mt-8 space-y-4">
                  <ProblemDiagnosisCard
                    report={report}
                    selectedCategory={currentCategory}
                    onSelectCategory={handleSelectCategory}
                    showCategoryCards={true}
                  />

                  {/* Generate Button Row */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></span>
                      <span>
                        선택된 상담 과제: <strong className="text-orange-300 font-bold">[{currentCategoryInfo.code}] {currentCategoryInfo.name}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleGenerateAI()}
                      disabled={isGenerating}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-orange-950/60 transition cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Gemini AI가 [{currentCategoryInfo.code}] 15턴 시나리오 작성 중...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-slate-950" />
                          <span>[{currentCategoryInfo.code}] 주제로 4단계 실전 시나리오 생성하기</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4-Stage Consulting Structure Preview Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-bold text-orange-400 bg-orange-950/50 px-2 py-0.5 rounded">1단계</span>
                <h4 className="font-bold text-slate-200 text-xs mt-2">라포 형성 & 브리핑</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  대전글로리사업단 컨설턴트로서 정중한 인사 및 기업 성장 노력 치하, 사전 분석 재무지표 브리핑
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded">2단계</span>
                <h4 className="font-bold text-slate-200 text-xs mt-2">문제점 제기 & 리스크</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  가지급금 4.6% 인정이자 소득세, 잉여금 주가급등 상속세 50% 과표 등 구체적 손실액 추정 경고
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded">3단계</span>
                <h4 className="font-bold text-slate-200 text-xs mt-2">솔루션 & 반론해명</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  상법·세법 조문 인용, "세무조사 우려/기장 세무사 이견" 대표의 날카로운 질문에 전문 해명
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded">4단계</span>
                <h4 className="font-bold text-slate-200 text-xs mt-2">실행 절차 & 미팅확정</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  1~4단계 추진 일정표 제시, 세무사·변호사 자문위원 동석 2차 시뮬레이션 미팅 100% 확정
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* CASE B: Scenario is Generated & Active */
          <>
            {/* Corporate Summary & Briefing Banner */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl mb-6 backdrop-blur">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">
                        {currentCategoryInfo.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {currentCategoryInfo.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        | 담당 컨설턴트: <strong className="text-amber-300">{scenario.report.consultantName || consultantName}</strong>
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1 flex items-center gap-3">
                      <span>{scenario.report.companyName}</span>
                      <span className="text-sm font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                        {scenario.report.ceoName} 대표이사
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      업종: {scenario.report.industry} ({scenario.report.establishedYear}년 설립) · 임직원 {scenario.report.employeeCount}명
                    </p>
                  </div>
                </div>

                {/* Quick Metrics Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">연매출액</span>
                    <span className="text-xs font-bold text-slate-200">{scenario.report.annualRevenue || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">영업이익</span>
                    <span className="text-xs font-bold text-slate-200">{scenario.report.operatingProfit || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/30 text-center">
                    <span className="text-[10px] text-amber-400 block">미처분이익잉여금</span>
                    <span className="text-xs font-bold text-amber-300">{scenario.report.retainedEarnings || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-500/30 text-center">
                    <span className="text-[10px] text-rose-400 block">가지급금 (인정이자)</span>
                    <span className="text-xs font-bold text-rose-300">{scenario.report.provisionalPayment || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Continuous Audio Player Bar with MP3 Download */}
            <AudioPlayerBar
              isPlaying={isPlaying}
              isPaused={isPaused}
              currentTurnIndex={activeTurnIndex}
              totalTurns={scenario.dialogueTurns.length}
              currentTurn={scenario.dialogueTurns[activeTurnIndex]}
              playbackSpeed={playbackSpeed}
              onChangeSpeed={handleChangeSpeed}
              onPlayAll={handlePlayAll}
              onPause={handlePauseAudio}
              onResume={handleResumeAudio}
              onStop={handleStopAudio}
              onPrevTurn={handlePrevTurn}
              onNextTurn={handleNextTurn}
              onOpenMp3Modal={handleOpenFullMp3Modal}
            />

            {/* View Switcher: 4-Stage Dialogue Script vs Consulting Analysis Deck */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-6 gap-3">
              <div className="flex items-center gap-2">
                <button
                  id="tab-view-script"
                  onClick={() => setActiveViewTab('script')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeViewTab === 'script'
                      ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>4단계 실전 상담 대본 ({scenario.dialogueTurns.length}턴)</span>
                </button>

                <button
                  id="tab-view-analysis"
                  onClick={() => setActiveViewTab('analysis')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeViewTab === 'analysis'
                      ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>핵심 리스크 진단 & 상법·세법 근거 덱</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* MP3 Download Button */}
                <button
                  onClick={handleOpenFullMp3Modal}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-emerald-950"
                  title="MP3 음원 파일 다운로드"
                >
                  <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MP3 다운로드</span>
                </button>

                <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 ml-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    컨설턴트: {consultantName}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    대표이사: {scenario.report.ceoName}
                  </span>
                </div>
              </div>
            </div>

            {/* View Content */}
            {activeViewTab === 'script' ? (
              <div className="space-y-6">
                <DialogueViewer
                  dialogueTurns={scenario.dialogueTurns}
                  activePlayingIndex={activeTurnIndex}
                  isPlaying={isPlaying}
                  onPlayTurn={handlePlayTurn}
                  onPracticeTurn={handlePracticeTurn}
                  onOpenMp3Modal={handleOpenFullMp3Modal}
                  onDownloadTurnMp3={handleOpenSingleTurnMp3}
                />

                {/* Persistent Consultant Live Notes & Objections Recorder */}
                <ConsultantLiveNotes
                  scenarioId={scenario.id}
                  companyName={scenario.report.companyName}
                  ceoName={scenario.report.ceoName}
                  consultantName={scenario.report.consultantName || consultantName}
                  currentTurnIndex={activeTurnIndex}
                  totalTurns={scenario.dialogueTurns.length}
                  currentTurn={scenario.dialogueTurns[activeTurnIndex]}
                  notes={scenario.consultantLiveNotes || ''}
                  onChangeNotes={handleUpdateScenarioNotes}
                />
              </div>
            ) : (
              <ConsultingAnalysisDeck
                analysis={scenario.analysis}
                companyName={scenario.report.companyName}
                ceoName={scenario.report.ceoName}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-400">한화피플라이프 대전글로리사업단</span>
            <span>담당: {consultantName} | 법인 컨설팅 가상 시나리오 AI</span>
          </div>
          <div>
            상법 제388조 · 인정이자 4.6% · 조특법 제29조의7 · 상증세법 가업승계 특례 정밀 반영
          </div>
        </div>
      </footer>

      {/* Interactive Roleplay Coaching Modal */}
      {scenario && (
        <InteractiveRoleplayModal
          isOpen={isRoleplayOpen}
          onClose={() => setIsRoleplayOpen(false)}
          targetCeoTurn={roleplayCeoTurn}
          companyName={scenario.report.companyName}
          categoryTitle={scenario.categoryTitle}
        />
      )}

      {/* Print / Export Modal */}
      {scenario && (
        <PrintExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          scenario={scenario}
        />
      )}

      {/* Load Report Modal */}
      <LoadReportModal
        isOpen={isLoadReportModalOpen}
        onClose={() => setIsLoadReportModalOpen(false)}
        onLoadReport={handleReportLoaded}
        currentConsultantName={consultantName}
        initialCategory={currentCategory}
      />

      {/* MP3 Audio Download Modal */}
      {scenario && (
        <Mp3DownloadModal
          isOpen={isMp3ModalOpen}
          onClose={() => setIsMp3ModalOpen(false)}
          scenario={scenario}
          selectedTurnIndex={selectedTurnForMp3}
        />
      )}

      {/* Admin Security Control Center Modal */}
      <AdminSecurityModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        securityConfig={securityConfig}
        onLockScreen={handleLockScreen}
        onConfigUpdated={(newCfg) => setSecurityConfig(newCfg)}
      />
    </div>
  );
}

export default App;
