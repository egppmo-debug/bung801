import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  FileText, 
  Share2, 
  Building2,
  FileDown
} from 'lucide-react';
import { GeneratedScenario } from '../types';
import { openScenarioPdfPrintWindow } from '../utils/pdfExport';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: GeneratedScenario;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  scenario,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);

  const getFullText = () => {
    let out = `===========================================================\n`;
    out += `[한화피플라이프 대전글로리사업단] 법인 컨설팅 4단계 실전 상담 대본\n`;
    out += `기업명: ${scenario.report.companyName} | 대표자: ${scenario.report.ceoName} 대표\n`;
    out += `담당 컨설턴트: ${scenario.report.consultantName || '담소영 단장'}\n`;
    out += `카테고리: ${scenario.categoryTitle}\n`;
    out += `생성일자: ${scenario.createdAt}\n`;
    out += `===========================================================\n\n`;

    out += `[기업 핵심 재무 지표]\n`;
    out += `- 매출액: ${scenario.report.annualRevenue} | 영업이익: ${scenario.report.operatingProfit}\n`;
    out += `- 미처분이익잉여금: ${scenario.report.retainedEarnings} | 가지급금: ${scenario.report.provisionalPayment}\n`;
    out += `- 주주구조: ${scenario.report.shareholders} | 임직원: ${scenario.report.employeeCount}명\n\n`;

    out += `-----------------------------------------------------------\n`;
    out += `[실전 상담 15턴 대화 스크립트]\n`;
    out += `-----------------------------------------------------------\n\n`;

    scenario.dialogueTurns.forEach((turn) => {
      out += `[턴 ${turn.turnNumber}] ${turn.stageName}\n`;
      out += `▶ ${turn.speakerTitle} ${turn.emotion ? `(${turn.emotion})` : ''}\n`;
      out += `"${turn.content}"\n`;
      if (turn.legalKeywords && turn.legalKeywords.length > 0) {
        out += `  * 관련 법적 근거: ${turn.legalKeywords.join(', ')}\n`;
      }
      if (turn.keyPointSummary) {
        out += `  * 상담 포인트: ${turn.keyPointSummary}\n`;
      }
      out += `\n`;
    });

    out += `===========================================================\n`;
    out += `[차기 미팅 확정 사항 & 자문단 체크리스트]\n`;
    scenario.analysis.nextMeetingChecklist.forEach((chk, i) => {
      out += `${i + 1}. ${chk}\n`;
    });
    out += `===========================================================\n\n`;

    if (scenario?.consultantLiveNotes?.trim()) {
      out += `===========================================================\n`;
      out += `[컨설턴트 실전 시뮬레이션 라이브 메모 & 고객 반론(Objection) 기록]\n`;
      out += `${scenario.consultantLiveNotes.trim()}\n`;
      out += `===========================================================\n`;
    }

    return out;
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(getFullText());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([getFullText()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `[한화피플라이프]_${scenario.report.companyName}_실전상담대본.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>실전 상담 대본 전체 내보내기 & 인쇄</span>
                <span className="text-xs bg-orange-950/80 text-orange-300 px-2 py-0.5 rounded border border-orange-800">
                  한화피플라이프 대전글로리사업단
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                15턴 전체 대화와 법적 근거 및 차기 미팅 확정안을 텍스트로 보관하거나 인쇄하세요.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-3 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            총 <strong className="text-orange-400 font-bold">{scenario.dialogueTurns.length}턴</strong> 대본 (약 {scenario.dialogueTurns.reduce((acc, t) => acc + t.content.length, 0).toLocaleString()}자)
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-modal-copy-all"
              onClick={handleCopyAll}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                copiedAll
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 ring-2 ring-emerald-400/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
              }`}
              title="대본 전체 텍스트 클립보드 복사"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  <span className="text-white font-black">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-200" />
                  <span className="text-white font-bold">복사</span>
                </>
              )}
            </button>

            <button
              id="btn-modal-download-txt"
              onClick={handleDownloadTxt}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm border border-sky-500 cursor-pointer"
              title="텍스트(.txt) 파일로 다운로드"
            >
              <Download className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              <span className="text-white font-bold">다운</span>
            </button>

            <button
              id="btn-modal-download-pdf"
              onClick={() => openScenarioPdfPrintWindow(scenario)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm border border-rose-500 cursor-pointer"
              title="리포트 서식 깔끔한 PDF로 저장 / 인쇄"
            >
              <FileDown className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-bold">PDF</span>
            </button>

            <button
              id="btn-modal-print"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm border border-orange-400 cursor-pointer"
              title="대본 인쇄하기"
            >
              <Printer className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="text-black font-black">인쇄</span>
            </button>
          </div>
        </div>

        {/* Text Preview Body */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed whitespace-pre-wrap select-all">
          {getFullText()}
        </div>
      </div>
    </div>
  );
};
