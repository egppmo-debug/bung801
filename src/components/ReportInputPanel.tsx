import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Scale, 
  FileCheck, 
  ChevronDown, 
  ChevronUp, 
  FolderOpen, 
  Check, 
  Trash2, 
  Info,
  Award
} from 'lucide-react';
import { CorporateReport, ConsultingCategory, DEFAULT_CONSULTANT_NAME } from '../types';
import { CATEGORY_INFO, SAMPLE_REPORTS } from '../data/sampleReports';
import { diagnoseCorporateReport } from '../utils/problemDiagnoser';

interface ReportInputPanelProps {
  report: CorporateReport;
  onChangeReport: (updated: CorporateReport) => void;
  onGenerateAI: () => void;
  onResetToSample?: () => void;
  onClearReport: () => void;
  onOpenLoadReport: () => void;
  onSelectCategory?: (category: ConsultingCategory) => void;
  isGenerating: boolean;
  onClose: () => void;
}

export const ReportInputPanel: React.FC<ReportInputPanelProps> = ({
  report,
  onChangeReport,
  onGenerateAI,
  onResetToSample,
  onClearReport,
  onOpenLoadReport,
  onSelectCategory,
  isGenerating,
  onClose,
}) => {
  const currentCat = CATEGORY_INFO[report.category] || CATEGORY_INFO.category_2;
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Compute problem diagnosis and recommended category for this corporate report
  const diagnosis = React.useMemo(() => {
    return diagnoseCorporateReport(report);
  }, [
    report.companyName,
    report.retainedEarnings,
    report.provisionalPayment,
    report.articlesStatus,
    report.employeeCount,
    report.establishedYear,
  ]);

  const recommendedCat = report.recommendedCategory || diagnosis.recommendedCategory;
  const recCatInfo = CATEGORY_INFO[recommendedCat] || CATEGORY_INFO.category_2;
  const recReason = report.recommendationReason || diagnosis.recommendationReason;

  const handleFieldChange = (field: keyof CorporateReport, value: any) => {
    onChangeReport({
      ...report,
      [field]: value,
    });
  };

  const handleCategoryChange = (cat: ConsultingCategory) => {
    onChangeReport({
      ...report,
      category: cat,
    });
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  const isFormValid = !!report.companyName.trim();

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl mb-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">
              {currentCat.code} 적용 중
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {currentCat.name}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>법인 분석 리포트 데이터 설정</span>
            <span className="text-xs text-slate-400 font-normal hidden sm:inline">
              (수치 근거 기반 4단계 실전 스크립트의 원천 데이터)
            </span>
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Load Report File Button */}
          <button
            id="btn-panel-load-report"
            onClick={onOpenLoadReport}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 transition flex items-center gap-1 sm:gap-1.5 shadow-md shadow-orange-950/40"
            title="리포트 파일(.pdf/.docx/.txt) 불러오기"
          >
            <FolderOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">파일 불러오기</span>
            <span className="hidden sm:inline">리포트 파일 불러오기</span>
          </button>

          {/* Clear Form */}
          <button
            id="btn-clear-report"
            onClick={onClearReport}
            className="px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 border border-slate-700 transition flex items-center gap-1"
            title="입력 내용 비우기"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>비우기</span>
          </button>

          {/* Generate Scenario AI */}
          <button
            id="btn-generate-ai"
            onClick={onGenerateAI}
            disabled={isGenerating || !isFormValid}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 transition flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-orange-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950 shrink-0" />
                <span className="sm:hidden">작성 중...</span>
                <span className="hidden sm:inline">Gemini 15턴 작성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="sm:hidden">[{currentCat.code}] AI 생성</span>
                <span className="hidden sm:inline">[{currentCat.code}] 4단계 실전 시나리오 AI 생성</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5 Categories Selector in Report Input Panel */}
      <div className="py-3 border-b border-slate-800/80 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span>컨설팅 주제 선택 (5대 카테고리 중 택1):</span>
          </span>
          <span className="text-[11px] text-orange-400 font-medium">
            현재 적용: {currentCat.name}
          </span>
        </div>

        {/* AI Recommendation alert inside panel if company report has data */}
        {report.companyName.trim() && (
          <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-start sm:items-center gap-2">
              <Award className="w-4 h-4 text-orange-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-bold text-orange-300 mr-1.5">
                  [AI 당면 문제 진단 최적 추천]:
                </span>
                <span className="text-slate-200 font-semibold">
                  [{recCatInfo.code}] {recCatInfo.name}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {recReason}
                </p>
              </div>
            </div>

            {report.category !== recommendedCat && (
              <button
                type="button"
                onClick={() => handleCategoryChange(recommendedCat)}
                className="shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 transition flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>추천 적용</span>
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(CATEGORY_INFO) as ConsultingCategory[]).map((catKey) => {
            const cat = CATEGORY_INFO[catKey];
            const isSelected = report.category === catKey;
            const isRec = recommendedCat === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleCategoryChange(catKey)}
                className={`p-2 rounded-xl border text-left transition flex items-center justify-between text-xs cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500/20 border-orange-500 text-orange-200 ring-1 ring-orange-500/50 shadow-sm'
                    : isRec
                    ? 'bg-slate-900 border-amber-500/50 hover:border-amber-400 text-slate-300'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1">
                    <span className={`font-bold text-[10px] ${isSelected ? 'text-orange-400' : 'text-slate-500'}`}>
                      {cat.code}
                    </span>
                    {isRec && (
                      <span className="text-[9px] text-amber-300 bg-amber-950/80 border border-amber-500/40 px-1 py-0.2 rounded">
                        추천
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-xs truncate mt-0.5">
                    {cat.name}
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Overview Card */}
      <div className="mt-4 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
        <div className="flex items-center justify-between text-slate-300 font-semibold mb-2">
          <span className="flex items-center gap-1.5 text-orange-400">
            <ShieldAlert className="w-4 h-4" />
            [{currentCat.code}] 핵심 컨설팅 리스크 & 솔루션 기준
          </span>
          <span className="text-[11px] text-slate-500">
            시나리오 생성 시 자동 법조문 인용
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="font-bold text-rose-400 flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3" />
              <span>핵심 진단 리스크</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
              {currentCat.coreRisks.map((risk, i) => (
                <li key={i} className="truncate">{risk}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>적용 법령 및 솔루션</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-1">
              {currentCat.laws.map((law, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300 font-mono">
                  {law}
                </span>
              ))}
            </div>
            <p className="text-slate-400 text-[11px] truncate">{currentCat.coreSolutions[0]}</p>
          </div>
        </div>
      </div>

      {/* Main Input Form Fields */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            기업명 <span className="text-orange-400">*</span>
          </label>
          <input
            id="input-company-name"
            type="text"
            value={report.companyName}
            onChange={(e) => handleFieldChange('companyName', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
            placeholder="예: (주)대덕정밀기계"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            대표자명 <span className="text-orange-400">*</span>
          </label>
          <input
            id="input-ceo-name"
            type="text"
            value={report.ceoName}
            onChange={(e) => handleFieldChange('ceoName', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
            placeholder="예: 김진성"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>담당 컨설턴트명</span>
            <span className="text-[10px] text-orange-400 font-normal">수정 가능</span>
          </label>
          <input
            id="input-consultant-name"
            type="text"
            value={report.consultantName}
            onChange={(e) => handleFieldChange('consultantName', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-orange-200 font-semibold focus:outline-none focus:border-orange-500"
            placeholder={DEFAULT_CONSULTANT_NAME}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            주요 업종 및 사업
          </label>
          <input
            id="input-industry"
            type="text"
            value={report.industry}
            onChange={(e) => handleFieldChange('industry', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
            placeholder="예: 정밀 금형 및 자동차 부품 가공"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            최근 연매출
          </label>
          <input
            id="input-annual-revenue"
            type="text"
            value={report.annualRevenue}
            onChange={(e) => handleFieldChange('annualRevenue', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
            placeholder="예: 145억 원"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            최근 영업이익
          </label>
          <input
            id="input-operating-profit"
            type="text"
            value={report.operatingProfit}
            onChange={(e) => handleFieldChange('operatingProfit', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
            placeholder="예: 16억 원"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            미처분이익잉여금
          </label>
          <input
            id="input-retained-earnings"
            type="text"
            value={report.retainedEarnings}
            onChange={(e) => handleFieldChange('retainedEarnings', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
            placeholder="예: 42억 원"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            가지급금 현황
          </label>
          <input
            id="input-provisional-payment"
            type="text"
            value={report.provisionalPayment}
            onChange={(e) => handleFieldChange('provisionalPayment', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
            placeholder="예: 3억 2,000만 원"
          />
        </div>
      </div>

      {/* Toggle Advanced Fields */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
        >
          <span>세부 지표 (주주구조, 정관현황, 임직원수 등) {showAdvanced ? '접기' : '더보기'}</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                주주 및 지분 구조
              </label>
              <input
                type="text"
                value={report.shareholders}
                onChange={(e) => handleFieldChange('shareholders', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
                placeholder="예: 대표이사 80%, 배우자 20%"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                설립연도
              </label>
              <input
                type="number"
                value={report.establishedYear}
                onChange={(e) => handleFieldChange('establishedYear', parseInt(e.target.value, 10) || 2010)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
                placeholder="2008"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                임직원 수 (명)
              </label>
              <input
                type="number"
                value={report.employeeCount}
                onChange={(e) => handleFieldChange('employeeCount', parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
                placeholder="42"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                정관 및 규정 현황
              </label>
              <input
                type="text"
                value={report.articlesStatus}
                onChange={(e) => handleFieldChange('articlesStatus', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
                placeholder="예: 설립 당시 표준정관 그대로 사용 중. 임원퇴직금 규정 부재."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                부채비율
              </label>
              <input
                type="text"
                value={report.debtRatio}
                onChange={(e) => handleFieldChange('debtRatio', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
                placeholder="예: 115%"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                추가 컨설턴트 메모 / 특이사항
              </label>
              <textarea
                value={report.customNote || ''}
                onChange={(e) => handleFieldChange('customNote', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
                placeholder="대표와의 사전 관계, 세무대리인 성향, 최근 현안 등 특별히 스크립트에 반영할 점"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
