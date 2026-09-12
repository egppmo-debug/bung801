import React, { useState, useEffect, useRef } from 'react';
import { 
  PenLine, 
  Save, 
  Check, 
  Copy, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  FileText,
  ShieldAlert,
  CalendarCheck,
  RotateCcw
} from 'lucide-react';
import { DialogueTurn } from '../types';

interface ConsultantLiveNotesProps {
  scenarioId: string;
  companyName: string;
  ceoName: string;
  consultantName: string;
  currentTurnIndex: number;
  totalTurns: number;
  currentTurn?: DialogueTurn;
  notes: string;
  onChangeNotes: (notes: string) => void;
}

const COMMON_OBJECTIONS = [
  {
    label: '기장 세무사 이견',
    icon: AlertTriangle,
    prefix: '[고객 반론: 기장 세무사]',
    text: '대표이사: "우리 기장 세무사는 지금 건드리지 말고 가만히 두는 게 제일 안전하다고 하던데요?"',
  },
  {
    label: '세무조사 우려',
    icon: ShieldAlert,
    prefix: '[고객 반론: 세무조사 리스크]',
    text: '대표이사: "자사주 이익소각이나 정관 개정하면 국세청 세무조사 타깃이 되는 것 아닌가요?"',
  },
  {
    label: '시기상조/비용',
    icon: Clock,
    prefix: '[고객 반론: 비용 및 시기]',
    text: '대표이사: "지금 당장 급한 사업 확장과 매출 증대가 먼저라 여유가 생기면 나중에 검토하겠습니다."',
  },
  {
    label: '2차 자문미팅 확정',
    icon: CalendarCheck,
    prefix: '[상담 결론: 2차 미팅]',
    text: '대표이사 합의: 자문 세무사 및 변호사 동석 2차 정밀 시뮬레이션 보고서 일정 확정 (다음 주 화요일)',
  },
];

export const ConsultantLiveNotes: React.FC<ConsultantLiveNotesProps> = ({
  scenarioId,
  companyName,
  ceoName,
  consultantName,
  currentTurnIndex,
  totalTurns,
  currentTurn,
  notes,
  onChangeNotes,
}) => {
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Set initial last saved time
  useEffect(() => {
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [scenarioId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSaveStatus('saving');
    onChangeNotes(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setSaveStatus('saved');
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 400);
  };

  const handleCopy = () => {
    if (!notes.trim()) return;
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (!notes.trim()) return;
    if (window.confirm('작성 중인 실전 메모를 모두 지우시겠습니까? (삭제 후 복구할 수 없습니다)')) {
      onChangeNotes('');
      setSaveStatus('saved');
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  // Append text helper
  const appendText = (snippet: string) => {
    const currentVal = notes || '';
    const separator = currentVal.trim().length > 0 ? '\n\n' : '';
    const updated = currentVal + separator + snippet;
    onChangeNotes(updated);
    setSaveStatus('saved');
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }, 50);
  };

  // Quick insert current turn reference
  const handleInsertCurrentTurnTag = () => {
    const turnNum = currentTurn ? currentTurn.turnNumber : currentTurnIndex + 1;
    const speaker = currentTurn?.speakerTitle || '발화자';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    appendText(`[턴 ${turnNum} (${speaker}) 시점 메모 - ${now}]\n▶ `);
  };

  // Quick insert timestamp
  const handleInsertTimestamp = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    appendText(`[기록 시각 ${now}] `);
  };

  return (
    <div 
      id="consultant-live-notes-container"
      className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all hover:border-slate-700 space-y-4"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-inner shrink-0">
            <PenLine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>컨설턴트 실전 시뮬레이션 라이브 메모 & 고객 반론(Objection) 기록</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {companyName} ({ceoName} 대표) 상담 시뮬레이션 중 메모한 핵심 내용과 고객 반론은 시나리오와 함께 안전하게 자동 저장됩니다.
            </p>
          </div>
        </div>

        {/* Auto Save Status Badge & Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div 
            id="live-notes-save-badge"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400"
            title="브라우저 저장소 및 시나리오 객체에 실시간 자동 보관"
          >
            {saveStatus === 'saved' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-400 font-medium">자동 저장 완료</span>
                {lastSavedTime && <span className="text-slate-500 text-[10px]">({lastSavedTime})</span>}
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-amber-300 font-medium">저장 중...</span>
              </>
            )}
          </div>

          <button
            id="btn-copy-live-notes"
            onClick={handleCopy}
            disabled={!notes.trim()}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            title="메모 복사하기"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>복사</span>
              </>
            )}
          </button>

          <button
            id="btn-clear-live-notes"
            onClick={handleClear}
            disabled={!notes.trim()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 disabled:opacity-40 disabled:pointer-events-none transition"
            title="메모 전체 비우기"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Objection / Memo Tag Buttons */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>실전 고객 단골 반론 & 약속 퀵클릭 입력 (클릭 시 메모에 즉시 추가):</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInsertCurrentTurnTag}
              className="text-[10px] text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 transition"
            >
              <Plus className="w-3 h-3" />
              <span>현재 턴 {currentTurn?.turnNumber || currentTurnIndex + 1} 태그</span>
            </button>
            <button
              onClick={handleInsertTimestamp}
              className="text-[10px] text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1 transition"
            >
              <Clock className="w-3 h-3" />
              <span>시간 삽입</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {COMMON_OBJECTIONS.map((obj, i) => {
            const Icon = obj.icon;
            return (
              <button
                key={i}
                id={`btn-quick-objection-${i}`}
                onClick={() => appendText(`${obj.prefix}\n${obj.text}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-slate-100 text-xs transition flex items-center gap-1.5 group"
              >
                <Icon className="w-3 h-3 text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-[11.5px]">{obj.label}</span>
                <Plus className="w-3 h-3 text-slate-500 group-hover:text-orange-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Persistent Live Notes Text Area */}
      <div className="relative">
        <textarea
          id="consultant-live-notes-textarea"
          ref={textareaRef}
          value={notes}
          onChange={handleTextChange}
          rows={6}
          placeholder={`[컨설턴트 ${consultantName || '컨설턴트'} 전용 시뮬레이션 라이브 메모 & 고객 반론 노트]
- 대표이사의 돌발 질문이나 미처 준비하지 못한 반론을 실시간으로 적어보세요.
- 예: "대표이사가 배우자 증여공제 6억 원 활용 가능 여부를 추가 질문함. 다음 미팅 전 과세표준 시뮬레이션 필요"
- 작성된 내용은 시나리오와 함께 안전하게 영구 저장되며 대본 인쇄/TXT 내보내기에도 함께 포함됩니다.`}
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 transition leading-relaxed font-sans resize-y min-h-[140px]"
        />
      </div>

      {/* Bottom Info Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span>글자 수: <strong className="text-slate-300">{notes.length.toLocaleString()}</strong>자</span>
          <span>·</span>
          <span>줄 수: <strong className="text-slate-300">{notes ? notes.split('\n').length : 0}</strong>줄</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>* 대본 전체 내보내기 & 인쇄 시 이 메모가 보고서 하단에 자동 동봉됩니다.</span>
        </div>
      </div>
    </div>
  );
};
