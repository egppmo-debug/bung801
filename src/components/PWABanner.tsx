import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWABannerProps {
  onOpenModal: () => void;
}

export const PWABanner: React.FC<PWABannerProps> = ({ onOpenModal }) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Only show if not installed and not dismissed in this session
    const isDismissed = sessionStorage.getItem('pwa_install_banner_dismissed') === 'true';
    if (!isInstalled && !isDismissed) {
      setDismissed(false);
    }
  }, [isInstalled]);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_install_banner_dismissed', 'true');
  };

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setDismissed(true);
        return;
      }
    }
    // Fallback or iOS guide
    onOpenModal();
  };

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-4 sm:max-w-md z-40 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 border border-orange-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-slate-100 ring-1 ring-orange-500/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-orange-400 truncate">
              홈화면에 추가 & 앱 설치
            </p>
            <p className="text-[11px] text-slate-300 truncate">
              브라우저 없이 스마트폰 앱처럼 실행
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="btn-pwa-banner-install"
            onClick={handleAction}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>앱 설치</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            aria-label="배너 닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
