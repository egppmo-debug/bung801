import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Printer, 
  FileText, 
  FolderOpen,
  Headphones,
  User,
  Edit2,
  Check,
  RotateCcw,
  Plus,
  Sun,
  Moon
} from 'lucide-react';
import { ConsultingCategory, DEFAULT_CONSULTANT_NAME } from '../types';
import { CATEGORY_INFO } from '../data/sampleReports';

interface HeaderProps {
  currentCategory: ConsultingCategory;
  onSelectCategory: (category: ConsultingCategory) => void;
  onOpenRoleplay?: () => void;
  onOpenExport: () => void;
  onOpenLoadReport: () => void;
  onOpenMp3Modal: () => void;
  onToggleInput: () => void;
  isInputOpen: boolean;
  isGenerating: boolean;
  consultantName: string;
  onChangeConsultantName: (newName: string) => void;
  hasScenario: boolean;
  onResetNewScenario: () => void;
  onOpenAdminCenter?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenRoleplay,
  onOpenExport,
  onOpenLoadReport,
  onOpenMp3Modal,
  onToggleInput,
  isInputOpen,
  isGenerating,
  consultantName,
  onChangeConsultantName,
  hasScenario,
  onResetNewScenario,
  onOpenAdminCenter,
  isDarkMode = false,
  onToggleTheme,
}) => {
  const [isEditingConsultant, setIsEditingConsultant] = useState(false);
  const [editNameInput, setEditNameInput] = useState(consultantName || DEFAULT_CONSULTANT_NAME);

  const handleSaveConsultantName = () => {
    const trimmed = editNameInput.trim();
    if (trimmed) {
      onChangeConsultantName(trimmed);
    }
    setIsEditingConsultant(false);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* DESKTOP LAYOUT (lg and above): Single spacious bar */}
        <div className="hidden lg:flex items-center justify-between min-h-[72px] py-2.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hanwha Brand Badge / App Logo (Click to open Admin Security Control Center) */}
            <button
              type="button"
              id="btn-app-logo-admin-desktop"
              onClick={onOpenAdminCenter}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:via-orange-500 hover:to-red-500 active:scale-95 flex items-center justify-center shadow-lg shadow-orange-950/50 ring-1 ring-orange-400/30 hover:ring-orange-400/60 shrink-0 transition-all cursor-pointer group"
              title="관리자 보안 통제 센터 열기"
              aria-label="관리자 보안 통제 센터 열기"
            >
              <Building2 className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-orange-400 uppercase bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30 whitespace-nowrap">
                  한화피플라이프 대전글로리사업단
                </span>

                {/* Editable Consultant Badge */}
                {isEditingConsultant ? (
                  <div className="flex items-center gap-1 bg-slate-900 border border-orange-500/50 rounded px-1.5 py-0.5">
                    <span className="text-[11px] text-slate-400">담당:</span>
                    <input
                      type="text"
                      value={editNameInput}
                      onChange={(e) => setEditNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveConsultantName();
                        if (e.key === 'Escape') setIsEditingConsultant(false);
                      }}
                      className="bg-slate-950 text-orange-200 text-xs px-1 py-0.5 rounded border border-slate-700 w-24 focus:outline-none focus:border-orange-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveConsultantName}
                      className="p-1 text-emerald-400 hover:text-emerald-300 transition"
                      title="저장"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditNameInput(consultantName || DEFAULT_CONSULTANT_NAME);
                      setIsEditingConsultant(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/30 transition group whitespace-nowrap"
                    title="클릭하여 담당 컨설턴트명 직접 수정"
                  >
                    <User className="w-3 h-3 text-amber-400" />
                    <span className="font-semibold">담당: {consultantName || DEFAULT_CONSULTANT_NAME}</span>
                    <Edit2 className="w-2.5 h-2.5 text-amber-400 opacity-60 group-hover:opacity-100" />
                  </button>
                )}

                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gemini 3.8 & Flash TTS 연동
                </span>
              </div>

              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2 mt-0.5 whitespace-nowrap">
                법인컨설팅 4단계 실전 가상 시나리오 AI
              </h1>
            </div>
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Load Report Button */}
            <button
              id="btn-load-report"
              onClick={onOpenLoadReport}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-orange-950/70 hover:bg-orange-900 text-orange-200 border border-orange-500/40 transition-all flex items-center gap-1.5 shadow-sm shadow-orange-950 whitespace-nowrap cursor-pointer"
              title="법인 분석 리포트 파일/텍스트 불러오기"
            >
              <FolderOpen className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>리포트 불러오기</span>
            </button>

            {/* Input Toggle */}
            <button
              id="btn-toggle-input"
              onClick={onToggleInput}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isInputOpen
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title={isInputOpen ? "리포트 패널 닫기" : "리포트 직접 수정"}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>{isInputOpen ? '닫기' : '수정'}</span>
            </button>

            {/* MP3 Download Button */}
            {hasScenario && (
              <button
                id="btn-header-mp3"
                onClick={onOpenMp3Modal}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-950 whitespace-nowrap cursor-pointer"
                title="상담 대본 MP3 음성 파일 다운로드"
              >
                <Headphones className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>MP3 다운</span>
              </button>
            )}

            {/* Print/Copy Export */}
            <button
              id="btn-open-export"
              onClick={onOpenExport}
              disabled={!hasScenario}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              title="인쇄 및 대화 복사"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>인쇄/복사</span>
            </button>

            {/* New Scenario Reset */}
            {hasScenario && (
              <button
                id="btn-reset-new"
                onClick={onResetNewScenario}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition cursor-pointer"
                title="새 상담 리포트 작성 (초기화)"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {/* Divider */}
            <div className="h-4 w-px bg-slate-800 mx-0.5" />

            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                id="btn-header-theme-toggle"
                onClick={onToggleTheme}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
                    <span className="text-amber-300 font-medium">라이트</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-500 animate-in spin-in-180 duration-300" />
                    <span className="text-slate-600 font-medium">다크</span>
                  </>
                )}
              </button>
            )}

          </div>
        </div>

        {/* MOBILE & TABLET LAYOUT (< lg): Clean, non-overlapping 2-tier horizontal arrangement */}
        <div className="lg:hidden flex flex-col gap-2 py-2 sm:py-2.5">
          {/* Row 1: Company Name & Consultant on Left, Admin & Theme Utilities on Right */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              {/* Brand Badge / App Logo (Click to open Admin Security Control Center) */}
              <button
                type="button"
                id="btn-app-logo-admin-mobile"
                onClick={onOpenAdminCenter}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:via-orange-500 hover:to-red-500 active:scale-95 flex items-center justify-center shadow-md shadow-orange-950/50 ring-1 ring-orange-400/30 shrink-0 transition-all cursor-pointer group"
                title="관리자 보안 통제 센터 열기"
                aria-label="관리자 보안 통제 센터 열기"
              >
                <Building2 className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
              </button>

              {/* Company Name & Consultant Badge: strictly horizontal */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-orange-400 bg-orange-950/70 px-2 py-0.5 rounded border border-orange-500/30 whitespace-nowrap">
                  <span className="hidden sm:inline">한화피플라이프 </span>대전글로리사업단
                </span>

                {/* Consultant Badge */}
                {isEditingConsultant ? (
                  <div className="flex items-center gap-1 bg-slate-900 border border-orange-500/50 rounded px-1.5 py-0.5">
                    <span className="text-[10px] text-slate-400">담당:</span>
                    <input
                      type="text"
                      value={editNameInput}
                      onChange={(e) => setEditNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveConsultantName();
                        if (e.key === 'Escape') setIsEditingConsultant(false);
                      }}
                      className="bg-slate-950 text-orange-200 text-xs px-1 py-0.5 rounded border border-slate-700 w-20 focus:outline-none focus:border-orange-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveConsultantName}
                      className="p-0.5 text-emerald-400 hover:text-emerald-300 transition"
                      title="저장"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditNameInput(consultantName || DEFAULT_CONSULTANT_NAME);
                      setIsEditingConsultant(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 px-1.5 py-0.5 rounded border border-amber-500/30 transition whitespace-nowrap shrink-0"
                    title="담당 컨설턴트명 직접 수정"
                  >
                    <User className="w-2.5 h-2.5 text-amber-400" />
                    <span>담당: {consultantName || DEFAULT_CONSULTANT_NAME}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Utility Icons (Right) */}
            <div className="flex items-center gap-1.5 shrink-0">

              {onToggleTheme && (
                <button
                  id="btn-header-theme-toggle-mobile"
                  onClick={onToggleTheme}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg border border-slate-800 transition"
                  title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
                >
                  {isDarkMode ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Row 2: App Title on Left, Action Buttons on Right - completely horizontal */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/70 min-w-0">
            {/* App Title */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
              <h1 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight whitespace-nowrap truncate">
                법인컨설팅 4단계 실전 가상 시나리오 AI
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap shrink-0">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini AI
              </span>
            </div>

            {/* Action Buttons (Mobile / Tablet) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Load Report Button */}
              <button
                id="btn-load-report-mobile"
                onClick={onOpenLoadReport}
                className="px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg bg-orange-950/80 hover:bg-orange-900 text-orange-200 border border-orange-500/40 transition flex items-center gap-1 shadow-sm whitespace-nowrap"
                title="리포트 파일/텍스트 불러오기"
              >
                <FolderOpen className="w-3 h-3 text-orange-400 shrink-0" />
                <span>불러오기</span>
              </button>

              {/* Input Toggle */}
              <button
                id="btn-toggle-input-mobile"
                onClick={onToggleInput}
                className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-lg border transition flex items-center gap-1 whitespace-nowrap ${
                  isInputOpen
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title={isInputOpen ? "리포트 패널 닫기" : "리포트 직접 수정"}
              >
                <FileText className="w-3 h-3 shrink-0" />
                <span>{isInputOpen ? '닫기' : '수정'}</span>
              </button>

              {/* MP3 Download Button */}
              {hasScenario && (
                <button
                  id="btn-header-mp3-mobile"
                  onClick={onOpenMp3Modal}
                  className="px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 transition flex items-center gap-1 whitespace-nowrap"
                  title="MP3 음성 파일 다운로드"
                >
                  <Headphones className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>MP3</span>
                </button>
              )}

              {/* Tablet only: Print/Export Button */}
              {hasScenario && (
                <button
                  id="btn-open-export-mobile"
                  onClick={onOpenExport}
                  className="hidden sm:flex px-2 py-1 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition items-center gap-1 whitespace-nowrap"
                  title="인쇄 및 복사"
                >
                  <Printer className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>인쇄</span>
                </button>
              )}

              {/* New Scenario Reset */}
              {hasScenario && (
                <button
                  id="btn-reset-new-mobile"
                  onClick={onResetNewScenario}
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
                  title="새 상담 리포트 작성"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
