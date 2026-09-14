import React, { useState } from 'react';
import { 
  X, 
  Mic2, 
  Sparkles, 
  Send, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  Volume2, 
  Copy,
  ChevronRight,
  User,
  Briefcase
} from 'lucide-react';
import { DialogueTurn } from '../types';
import { speechService } from '../utils/tts';

interface InteractiveRoleplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCeoTurn: DialogueTurn | null;
  companyName: string;
  categoryTitle: string;
}

interface RoleplayFeedback {
  score: number;
  grade: string;
  strengths: string[];
  weaknesses: string[];
  recommendedAnswer: string;
  coachingTip: string;
}

export const InteractiveRoleplayModal: React.FC<InteractiveRoleplayModalProps> = ({
  isOpen,
  onClose,
  targetCeoTurn,
  companyName,
  categoryTitle,
}) => {
  const [consultantAnswer, setConsultantAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<RoleplayFeedback | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultantAnswer?.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/roleplay/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ceoQuestion: targetCeoTurn.content,
          consultantAnswer,
          category: categoryTitle,
          companyName,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || '피드백 요청 실패');
      }

      const data: RoleplayFeedback = await res.json();
      setFeedback(data);
    } catch (err: any) {
      setErrorMessage(err.message || '피드백을 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakRecommended = () => {
    if (feedback?.recommendedAnswer) {
      speechService.speak(feedback.recommendedAnswer, 'consultant');
    }
  };

  if (!isOpen || !targetCeoTurn) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Mic2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>실전 컨설팅 롤플레잉 트레이닝</span>
                <span className="text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-semibold">
                  AI 마스터 코치
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                대표이사의 날카로운 반론에 직접 답변하고 세법·상법 전문성 피드백을 받아보세요.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Target CEO Question */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-blue-300">
                {targetCeoTurn.speakerTitle} 의 질문/반론 (턴 {targetCeoTurn.turnNumber})
              </span>
              {targetCeoTurn.emotion && (
                <span className="text-xs text-amber-400 italic">
                  ({targetCeoTurn.emotion})
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-200 leading-relaxed pl-8">
              "{targetCeoTurn.content}"
            </p>
          </div>

          {/* Consultant Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-orange-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>컨설턴트 실전 대응 발언 입력:</span>
              </label>
              <span className="text-[11px] text-slate-400">
                상법/세법 근거와 정중한 태도로 설득해 보세요.
              </span>
            </div>

            <textarea
              id="textarea-roleplay-answer"
              rows={4}
              value={consultantAnswer}
              onChange={(e) => setConsultantAnswer(e.target.value)}
              placeholder="대표님, 그 점에 대해 걱정하시는 것은 지극히 당연합니다. 하지만 상법 제388조와 2024년 개정 세법에 따르면..."
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-orange-500 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>팁: 공감(경청) → 법률·판례 근거 제시 → 안전성 확약 순으로 말해보세요.</span>
              </div>

              <button
                type="submit"
                id="btn-submit-feedback"
                disabled={isLoading || !consultantAnswer?.trim()}
                className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-orange-950/40 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950 shrink-0" />
                    <span>분석 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span>점수 분석</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Feedback Result Card */}
          {feedback && (
            <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/40 shadow-2xl space-y-4 animate-in fade-in">
              {/* Score banner */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {feedback.grade}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">실전 상담 대응 종합 점수</div>
                    <div className="text-lg font-black text-slate-100">
                      {feedback.score}점 <span className="text-xs text-slate-400 font-normal">/ 100점</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800">
                    한화피플라이프 코칭 결과
                  </span>
                </div>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    칭찬할 점 (우수 포인트)
                  </span>
                  <ul className="space-y-1 text-slate-300 list-disc pl-3">
                    {feedback.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    보완할 점 (세법/상법 전문성)
                  </span>
                  <ul className="space-y-1 text-slate-300 list-disc pl-3">
                    {feedback.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Model Answer */}
              <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    한화피플라이프 수석컨설턴트 모범 답변 스크립트
                  </span>
                  <button
                    onClick={handleSpeakRecommended}
                    className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-950/60 px-2 py-1 rounded border border-amber-600/40 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>음성으로 듣기</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  "{feedback.recommendedAnswer}"
                </p>
              </div>

              {/* One Point Coaching Tip */}
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex items-start gap-2.5 text-xs text-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-300 block mb-0.5">마스터 트레이너 원포인트 팁</span>
                  <p className="text-slate-300 leading-relaxed">{feedback.coachingTip}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
