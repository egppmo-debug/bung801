import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  Check, 
  X, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const result = await install();
      if (result) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-950/60 ring-2 ring-orange-400/40 shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-950/70 border border-orange-500/40 text-[11px] font-bold text-orange-300 mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>홈화면에 추가 & 앱 설치</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              글로리AI 모바일 앱 설치
            </h3>
          </div>
        </div>

        {/* Body Content depending on state */}
        {isInstalled ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 text-center my-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto mb-2">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-emerald-300">이미 앱으로 설치되어 실행 중입니다!</p>
            <p className="text-xs text-slate-400 mt-1">스마트폰 홈화면의 앱 아이콘을 통해 전체화면으로 빠르게 접속하실 수 있습니다.</p>
          </div>
        ) : installSuccess ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 text-center my-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto mb-2">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-emerald-300">앱 설치가 완료되었습니다!</p>
            <p className="text-xs text-slate-400 mt-1">스마트폰 홈화면에 생성된 아이콘을 확인해 보세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* App Benefits Pill Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300">주소창 없이 전체화면</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">홈화면 원터치 실행</span>
              </div>
            </div>

            {/* Platform Specific Instructions */}
            {isInstallable ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  아래 <strong>[지금 앱으로 설치하기]</strong> 버튼을 터치하시면, 브라우저 주소창 없이 네이티브 앱처럼 스마트폰 홈화면에 즉시 설치됩니다.
                </p>
                <button
                  id="btn-pwa-install-confirm"
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 active:scale-98 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>지금 앱으로 설치하기 (홈화면에 추가)</span>
                </button>
              </div>
            ) : isIOS ? (
              /* iOS Safari Guided Steps */
              <div className="space-y-3 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>iPhone / iPad (Safari) 설치 방법</span>
                </p>
                <ol className="space-y-2.5 text-xs text-slate-300 leading-normal">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">1</span>
                    <span>사파리(Safari) 하단 툴바의 <strong>[공유] (<Share2 className="w-3.5 h-3.5 inline text-sky-400" /> 네모 위 화살표)</strong> 아이콘을 누릅니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">2</span>
                    <span>메뉴를 아래로 스크롤하여 <strong>[홈 화면에 추가] (<PlusSquare className="w-3.5 h-3.5 inline text-emerald-400" />)</strong> 항목을 선택합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">3</span>
                    <span>우측 상단의 <strong>[추가]</strong>를 누르면 스마트폰 홈화면에 앱 아이콘이 생성됩니다.</span>
                  </li>
                </ol>
              </div>
            ) : (
              /* Android Chrome or In-App Browser Guide */
              <div className="space-y-3 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-orange-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>스마트폰 브라우저 메뉴에서 추가하는 방법</span>
                </p>
                <ol className="space-y-2 text-xs text-slate-300 leading-normal">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">1</span>
                    <span>브라우저 우측 상단 <strong>더보기 (⋮) 메뉴</strong>를 누릅니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">2</span>
                    <span><strong>[앱 설치]</strong> 또는 <strong>[현재 페이지 추가 &gt; 홈 화면]</strong>을 터치합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">3</span>
                    <span><strong>[설치]</strong>를 누르면 스마트폰 바탕화면에 즉시 설치됩니다.</span>
                  </li>
                </ol>
                <p className="text-[11px] text-slate-400 pt-1">
                  * 카카오톡이나 인앱 브라우저에서 보시는 경우 우측 상단 점 3개 메뉴를 눌러 <strong>[다른 브라우저로 열기(Chrome/Safari)]</strong> 후 설치하시면 더욱 안정적입니다.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
