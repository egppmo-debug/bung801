import React from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Award, 
  Check, 
  ArrowRight,
  Info,
  Scale,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { CorporateReport, ConsultingCategory, CompanyProblem } from '../types';
import { CATEGORY_INFO } from '../data/sampleReports';
import { diagnoseCorporateReport } from '../utils/problemDiagnoser';

interface ProblemDiagnosisCardProps {
  report: CorporateReport;
  selectedCategory: ConsultingCategory;
  onSelectCategory: (category: ConsultingCategory) => void;
  showCategoryCards?: boolean;
  className?: string;
  compact?: boolean;
}

export const ProblemDiagnosisCard: React.FC<ProblemDiagnosisCardProps> = ({
  report,
  selectedCategory,
  onSelectCategory,
  showCategoryCards = true,
  className = '',
  compact = false,
}) => {
  // If report doesn't have problems or recommendation calculated yet, run diagnosis
  const diagnosis = React.useMemo(() => {
    return diagnoseCorporateReport(report);
  }, [
    report.companyName,
    report.retainedEarnings,
    report.provisionalPayment,
    report.articlesStatus,
    report.employeeCount,
    report.establishedYear,
    report.customNote,
    report.cretopSummary,
  ]);

  const recommendedCategory = report.recommendedCategory || diagnosis.recommendedCategory;
  const recommendationReason = report.recommendationReason || diagnosis.recommendationReason;
  const problems: CompanyProblem[] = (report.companyProblems && report.companyProblems.length > 0)
    ? report.companyProblems
    : diagnosis.companyProblems;

  const suitabilities = report.categorySuitabilities || diagnosis.categorySuitabilities;
  const recCatInfo = CATEGORY_INFO[recommendedCategory] || CATEGORY_INFO.category_2;
  const isCurrentlyRecommended = selectedCategory === recommendedCategory;

  return (
    <div className={`rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-orange-500/50 shadow-2xl p-4 sm:p-5 space-y-4 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black tracking-wider text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 px-2.5 py-0.5 rounded uppercase flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-slate-950" />
              <span>AI 당면 문제 진단 & 카테고리 추천</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {report.companyName || '법인'} 실전 분석
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5">
            <span>회사의 당면 리스크 진단 및 최적 5대 컨설팅 과제 제안</span>
          </h3>
        </div>

        {/* Highlighted Recommendation Badge */}
        <div className="flex items-center gap-2 bg-orange-950/80 border border-orange-500/60 px-3.5 py-2 rounded-xl shadow-inner shrink-0">
          <Award className="w-4 h-4 text-orange-400 shrink-0" />
          <div className="text-right">
            <div className="text-[10px] text-orange-300/80 font-medium">AI 최우선 추천 과제</div>
            <div className="text-xs sm:text-sm font-extrabold text-orange-200">
              [{recCatInfo.code}] {recCatInfo.name}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Narrative Box */}
      <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
          <div className="font-bold text-orange-300 flex items-center gap-1.5">
            <span>💡 왜 [{recCatInfo.name}] 상담을 우선적으로 진행해야 하는가?</span>
          </div>
          <p className="text-slate-200">
            {recommendationReason}
          </p>
        </div>
      </div>

      {/* Immediate Problems List (기업 핵심 당면 과제) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>분석된 기업 당면 과제 및 세무·경영 리스크 ({problems.length}건)</span>
          </div>
          <span className="text-[11px] text-slate-400">시급성 높은 순으로 정렬</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {problems.map((prob, idx) => {
            const isCritical = prob.severity === 'critical';
            const isHigh = prob.severity === 'high';
            const relatedCatInfo = CATEGORY_INFO[prob.relatedCategory];

            return (
              <div 
                key={idx}
                className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                  isCritical 
                    ? 'bg-rose-950/20 border-rose-800/60 text-slate-200 shadow-sm'
                    : isHigh
                    ? 'bg-amber-950/20 border-amber-800/60 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}>
                      {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}
                      <span>{isCritical ? '🚨 긴급 과제' : isHigh ? '⚠️ 주의 리스크' : '💡 개선 과제'}</span>
                    </span>

                    {relatedCatInfo && (
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        연계: {relatedCatInfo.code}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 leading-snug">
                    {prob.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    {prob.description}
                  </p>
                </div>

                {prob.financialImpact && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">예상 손실/추징액:</span>
                    <span className="font-bold text-rose-400">{prob.financialImpact}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Category Selector (Interactive Cards) */}
      {showCategoryCards && (
        <div className="pt-2 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>5대 컨설팅 카테고리 적합도 및 상담 주제 선택:</span>
            </div>
            
            {!isCurrentlyRecommended && (
              <button
                type="button"
                onClick={() => onSelectCategory(recommendedCategory)}
                className="text-[11px] font-bold text-orange-300 hover:text-orange-200 bg-orange-950/70 hover:bg-orange-900/80 border border-orange-500/50 px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>AI 추천 [{recCatInfo.code}]로 즉시 변경</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {(Object.keys(CATEGORY_INFO) as ConsultingCategory[]).map((catKey) => {
              const cat = CATEGORY_INFO[catKey];
              const isSelected = selectedCategory === catKey;
              const isTopRec = recommendedCategory === catKey;
              const suitItem = suitabilities.find((s) => s.category === catKey);
              const score = suitItem ? suitItem.score : (isTopRec ? 95 : 60);

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => onSelectCategory(catKey)}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-orange-500/20 border-orange-500 text-orange-200 shadow-lg shadow-orange-950/50 ring-2 ring-orange-500/60'
                      : isTopRec
                      ? 'bg-slate-900 border-amber-500/60 hover:border-amber-400 text-slate-300'
                      : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top badging */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-orange-500 text-slate-950'
                          : isTopRec
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {cat.code}
                      </span>

                      {isTopRec && (
                        <span className="text-[9px] font-bold text-amber-300 bg-amber-950/90 border border-amber-500/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          ⭐ AI 추천
                        </span>
                      )}
                    </div>

                    <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {cat.name}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">적합도:</span>
                    <span className={`text-[11px] font-extrabold ${
                      score >= 90 ? 'text-orange-400' : score >= 70 ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {score}%
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400 ring-2 ring-orange-950"></span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
