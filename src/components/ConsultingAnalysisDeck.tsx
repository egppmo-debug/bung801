import React from 'react';
import { 
  AlertTriangle, 
  Scale, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  TrendingDown, 
  ShieldAlert,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { ConsultingAnalysis } from '../types';

interface ConsultingAnalysisDeckProps {
  analysis: ConsultingAnalysis;
  companyName: string;
  ceoName: string;
}

export const ConsultingAnalysisDeck: React.FC<ConsultingAnalysisDeckProps> = ({
  analysis,
  companyName,
  ceoName,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Core Risks Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{companyName} 현 상태 유지 시 핵심 리스크 진단</span>
              <span className="text-xs text-rose-400 font-semibold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                시한폭탄 경고
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              대표이사 방치 시 누적될 실제 과세 부담 및 법적 책임 분석
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {analysis.riskSummary.map((risk, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/30 hover:border-rose-700/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-rose-200">{risk.title}</h4>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                    {risk.estimatedTaxOrLoss}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {risk.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Legal Bases & Statutes Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              상법 및 세법 법적 근거 (국세청 예규 및 대법원 판례)
            </h3>
            <p className="text-xs text-slate-400">
              세무조사 및 과세관청 부인 리스크를 원천 차단하는 합법 제도적 근거
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysis.legalBases.map((item, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/30 transition-all"
            >
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                {item.law}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Solution Roadmap & Next Meeting Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 4-Stage Solution Steps */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                컨설턴트 실행 솔루션 4단계 로드맵
              </h3>
              <p className="text-xs text-slate-400">
                절차적 정당성을 확보하는 순차적 실행 프로세스
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {analysis.solutionSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Next Meeting Checklist */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                차기 미팅 확정 & 준비 서류 체크리스트
              </h3>
              <p className="text-xs text-slate-400">
                대전글로리사업단 전문 자문단 동석 및 필수 수임 서류
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {analysis.nextMeetingChecklist.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
              >
                <UserCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
