import React, { useState } from 'react';
import { 
  Briefcase, 
  User, 
  Volume2, 
  Copy, 
  Check, 
  Scale, 
  Sparkles, 
  ArrowRight, 
  MessageSquare,
  Mic,
  Bookmark,
  Headphones,
  Download
} from 'lucide-react';
import { DialogueTurn } from '../types';

interface DialogueViewerProps {
  dialogueTurns: DialogueTurn[];
  activePlayingIndex: number;
  isPlaying: boolean;
  onPlayTurn: (index: number) => void;
  onPracticeTurn: (ceoTurn: DialogueTurn) => void;
  onOpenMp3Modal?: () => void;
  onDownloadTurnMp3?: (turnIndex: number) => void;
}

export const DialogueViewer: React.FC<DialogueViewerProps> = ({
  dialogueTurns,
  activePlayingIndex,
  isPlaying,
  onPlayTurn,
  onPracticeTurn,
  onOpenMp3Modal,
  onDownloadTurnMp3,
}) => {
  const [selectedStage, setSelectedStage] = useState<number | 'all'>('all');
  const [copiedTurnIndex, setCopiedTurnIndex] = useState<number | null>(null);

  const stageTabs = [
    { id: 'all', label: '전체 대화 (15턴)', desc: '전체 상담 흐름' },
    { id: 1, label: '1단계: 라포 & 브리핑', desc: '인사, 재무 지표 요약' },
    { id: 2, label: '2단계: 리스크 분석', desc: '과세·손실 시한폭탄 경고' },
    { id: 3, label: '3단계: 솔루션 & 반론해명', desc: '법적근거·핵심 Q&A' },
    { id: 4, label: '4단계: 실행 & 미팅확정', desc: '로드맵·차기 미팅 확정' },
  ];

  const filteredTurns = selectedStage === 'all'
    ? dialogueTurns
    : dialogueTurns.filter((t) => t.stage === selectedStage);

  const handleCopy = (turn: DialogueTurn, index: number) => {
    const text = `[${turn.speakerTitle}] (${turn.emotion || ''})\n"${turn.content}"`;
    navigator.clipboard.writeText(text);
    setCopiedTurnIndex(index);
    setTimeout(() => setCopiedTurnIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 4-Stage Navigation Tabs & Top MP3 Button */}
      <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-md">
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {stageTabs.map((tab) => {
            const isActive = selectedStage === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-stage-${tab.id}`}
                onClick={() => setSelectedStage(tab.id as any)}
                className={`flex-1 min-w-[120px] px-3 py-2 rounded-xl text-left transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-200 border-orange-500/50 shadow-sm shadow-orange-950'
                    : 'bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800/80'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{tab.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{tab.desc}</div>
              </button>
            );
          })}
        </div>

        {onOpenMp3Modal && (
          <button
            id="btn-viewer-mp3-all"
            onClick={onOpenMp3Modal}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-200 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm shadow-emerald-950 transition shrink-0"
            title="전체 15턴 대화 MP3 다운로드"
          >
            <Headphones className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400 shrink-0" />
            <span className="sm:hidden">MP3 다운</span>
            <span className="hidden sm:inline">전체 대화 MP3 파일 다운로드</span>
          </button>
        )}
      </div>

      {/* Script List Container */}
      <div className="space-y-4">
        {filteredTurns.map((turn) => {
          const originalIndex = dialogueTurns.findIndex(
            (t) => t.turnNumber === turn.turnNumber
          );
          const isCurrentActive = isPlaying && activePlayingIndex === originalIndex;
          const isConsultant = turn.speaker === 'consultant';

          return (
            <div
              key={turn.turnNumber}
              id={`turn-${turn.turnNumber}`}
              className={`rounded-2xl p-5 border transition-all duration-300 ${
                isCurrentActive
                  ? isConsultant
                    ? 'bg-slate-900/95 border-orange-500 shadow-xl shadow-orange-950/50 ring-2 ring-orange-500/30'
                    : 'bg-slate-900/95 border-blue-500 shadow-xl shadow-blue-950/50 ring-2 ring-blue-500/30'
                  : isConsultant
                  ? 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                  : 'bg-slate-950/80 border-slate-800/60 hover:border-slate-700'
              }`}
            >
              {/* Header: Turn Number, Stage, Speaker, and Quick Actions */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border ${
                      isConsultant
                        ? 'bg-orange-950/60 border-orange-500/40 text-orange-300'
                        : 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                    }`}
                  >
                    {turn.turnNumber}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        {isConsultant ? (
                          <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        {turn.speakerTitle}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {turn.stageName}
                      </span>
                    </div>

                    {turn.emotion && (
                      <span className="text-[11px] text-slate-400 italic">
                        {turn.emotion}
                      </span>
                    )}
                  </div>
                </div>

                {/* Turn Actions */}
                <div className="flex items-center gap-1.5">
                  {!isConsultant && (
                    <button
                      id={`btn-practice-turn-${turn.turnNumber}`}
                      onClick={() => onPracticeTurn(turn)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 transition"
                      title="이 질문에 직접 컨설팅 답변해보기 (AI 코칭)"
                    >
                      <Mic className="w-3 h-3 text-indigo-400" />
                      <span>답변 연습</span>
                    </button>
                  )}

                  <button
                    id={`btn-play-turn-${turn.turnNumber}`}
                    onClick={() => onPlayTurn(originalIndex)}
                    className={`p-1.5 rounded-lg transition ${
                      isCurrentActive
                        ? 'bg-orange-500 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title="이 턴 음성 듣기"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {onDownloadTurnMp3 && (
                    <button
                      id={`btn-mp3-turn-${turn.turnNumber}`}
                      onClick={() => onDownloadTurnMp3(originalIndex)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-400 transition"
                      title="이 턴 단독 MP3 다운로드"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    id={`btn-copy-turn-${turn.turnNumber}`}
                    onClick={() => handleCopy(turn, originalIndex)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="대사 복사"
                  >
                    {copiedTurnIndex === originalIndex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Dialogue Content */}
              <div
                className={`p-4 rounded-xl text-sm leading-relaxed border transition-colors ${
                  isConsultant
                    ? 'bg-slate-950/60 text-slate-100 border-slate-800'
                    : 'bg-slate-900/60 text-slate-200 border-slate-800'
                }`}
              >
                <p className="whitespace-pre-line font-medium text-[13.5px] tracking-normal">
                  {turn.content}
                </p>
              </div>

              {/* Bottom Metadata: Legal citations and Key point takeaways */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                {turn.legalKeywords && turn.legalKeywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-emerald-400" />
                      근거/키워드:
                    </span>
                    {turn.legalKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-800/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {turn.keyPointSummary && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
                    <Bookmark className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-slate-300">{turn.keyPointSummary}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
