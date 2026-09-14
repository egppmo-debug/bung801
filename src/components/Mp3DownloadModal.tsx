import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Headphones, 
  Volume2, 
  Check, 
  AlertCircle, 
  Play, 
  Pause, 
  Sparkles, 
  FileAudio,
  Layers,
  Clock,
  UserCheck
} from 'lucide-react';
import { GeneratedScenario, DialogueTurn, DEFAULT_CONSULTANT_NAME } from '../types';

interface Mp3DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: GeneratedScenario;
  selectedTurnIndex?: number;
}

export const Mp3DownloadModal: React.FC<Mp3DownloadModalProps> = ({
  isOpen,
  onClose,
  scenario,
  selectedTurnIndex,
}) => {
  const [downloadType, setDownloadType] = useState<'full' | 'summary' | 'single'>(
    typeof selectedTurnIndex === 'number' ? 'single' : 'full'
  );
  const [turnNumber, setTurnNumber] = useState<number>(
    typeof selectedTurnIndex === 'number' ? scenario.dialogueTurns[selectedTurnIndex]?.turnNumber || 1 : 1
  );

  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadedAudioUrl, setDownloadedAudioUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');

  const consultantName = scenario.report.consultantName || DEFAULT_CONSULTANT_NAME;

  const handleStartDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setProgressStep('AI 신경망 음성 합성 준비 중...');

    try {
      setProgressStep('Gemini 3.1 Flash 음성 생성 및 MP3 인코딩 중...');

      const payload = {
        dialogueTurns: scenario.dialogueTurns,
        companyName: scenario.report.companyName,
        consultantName: consultantName,
        type: downloadType,
        turnNumber: downloadType === 'single' ? turnNumber : undefined,
      };

      const res = await fetch('/api/scenario/export-mp3?format=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'MP3 생성에 실패했습니다.');
      }

      const data = await res.json();
      if (!data.audioBase64) {
        throw new Error('오디오 데이터를 수신하지 못했습니다.');
      }

      setProgressStep('MP3 파일 생성 완료! 다운로드를 시작합니다...');

      // Convert base64 to Blob
      const binaryString = window.atob(data.audioBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);
      const filename = data.filename || `[한화피플라이프]_${scenario.report.companyName}_상담대본.mp3`;

      setDownloadedAudioUrl(blobUrl);
      setDownloadFilename(filename);

      // Trigger automatic browser download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || '오디오 생성 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setProgressStep('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>실전 상담 대본 MP3 다운로드</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {scenario.report.companyName} | 담당: {consultantName}
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

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs">
          {/* Audio Spec Card */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <FileAudio className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">고품질 MP3 오디오 (128kbps, 24kHz)</div>
                <div className="text-[11px] text-slate-400">
                  화자 분리: 컨설턴트({consultantName}) & 대표이사 2인 입체 음성
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-medium">
              신경망 TTS
            </span>
          </div>

          {/* Download Type Selection */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-200 block">
              다운로드 옵션 선택
            </label>

            <div className="grid grid-cols-1 gap-2">
              {/* Option 1: Full 15-turn Session */}
              <div
                onClick={() => setDownloadType('full')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  downloadType === 'full'
                    ? 'bg-orange-500/10 border-orange-500 text-orange-200 ring-1 ring-orange-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      downloadType === 'full'
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-slate-600'
                    }`}
                  >
                    {downloadType === 'full' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>전체 15턴 풀 세션 상담 MP3</span>
                    <span className="text-[10px] text-slate-400">약 5~8분 분량</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    1단계 라포 및 브리핑부터 4단계 차기 미팅 확정까지 전 턴의 상담 대화를 하나로 엮은 완본 음원 파일입니다.
                  </p>
                </div>
              </div>

              {/* Option 2: Executive Summary */}
              <div
                onClick={() => setDownloadType('summary')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  downloadType === 'summary'
                    ? 'bg-orange-500/10 border-orange-500 text-orange-200 ring-1 ring-orange-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      downloadType === 'summary'
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-slate-600'
                    }`}
                  >
                    {downloadType === 'summary' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>핵심 4단계 요약 브리핑 MP3</span>
                    <span className="text-[10px] text-slate-400">약 2분 분량</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    주요 재무 리스크 진단, 핵심 솔루션 및 2차 미팅 확정 핵심 턴만 선별하여 빠르게 청취할 수 있는 요약본입니다.
                  </p>
                </div>
              </div>

              {/* Option 3: Single Turn */}
              <div
                onClick={() => setDownloadType('single')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  downloadType === 'single'
                    ? 'bg-orange-500/10 border-orange-500 text-orange-200 ring-1 ring-orange-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      downloadType === 'single'
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-slate-600'
                    }`}
                  >
                    {downloadType === 'single' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>개별 특정 턴(Turn) MP3</span>
                    <span className="text-[10px] text-slate-400">개별 발화</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    복습하고 싶은 특정 턴의 발화 대사만 단독 음원으로 추출합니다.
                  </p>

                  {downloadType === 'single' && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <label className="text-[11px] text-slate-300">턴 선택:</label>
                      <select
                        value={turnNumber}
                        onChange={(e) => setTurnNumber(parseInt(e.target.value, 10))}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                      >
                        {scenario.dialogueTurns.map((t) => (
                          <option key={t.turnNumber} value={t.turnNumber}>
                            [턴 {t.turnNumber}] {t.speakerTitle} ({t.stageName})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Downloaded Preview Player */}
          {downloadedAudioUrl && (
            <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-semibold text-xs">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  다운로드 준비 완료 ({downloadFilename})
                </span>
              </div>
              <audio controls src={downloadedAudioUrl} className="w-full h-9 rounded-lg" autoPlay />
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleStartDownload}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{progressStep || 'MP3 생성 중...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>MP3 다운로드</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
