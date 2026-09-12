import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  Delete, 
  ShieldCheck, 
  AlertCircle, 
  ShieldAlert,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { SecurityConfig } from '../lib/firebase';

interface SecurityLockScreenProps {
  securityConfig: SecurityConfig;
  onUnlock: () => void;
  onOpenAdminAuth: () => void;
  isFirebaseLoading?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const SecurityLockScreen: React.FC<SecurityLockScreenProps> = ({
  securityConfig,
  onUnlock,
  onOpenAdminAuth,
  isFirebaseLoading = false,
  isDarkMode = false,
  onToggleTheme,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleKeypadPress = (val: string) => {
    setErrorMessage('');
    if (pinInput.length < 20) {
      setPinInput(prev => prev + val);
    }
  };

  const handleClear = () => {
    setPinInput('');
    setErrorMessage('');
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    // Check against userPin or adminPin
    const trimmed = pinInput.trim();
    if (trimmed === securityConfig.userPin || trimmed === securityConfig.adminPin) {
      setIsSuccess(true);
      setErrorMessage('');
      setTimeout(() => {
        onUnlock();
      }, 400);
    } else {
      setErrorMessage('비밀번호가 일치하지 않습니다. 대전글로리사업단 지정 PIN을 확인해 주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Background subtle atmospheric gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Right Controls: Theme Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">

        {onToggleTheme && (
          <button
            id="btn-lockscreen-theme-toggle"
            onClick={onToggleTheme}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-md backdrop-blur-sm active:scale-95"
            title={isDarkMode ? "라이트 모드로 전환 (현재: 다크모드)" : "다크 모드로 전환 (현재: 라이트모드)"}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">라이트</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-slate-600">다크</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Top Security Eyebrow */}
      <div className="flex items-center gap-2 mb-6 text-orange-400/90 text-xs font-bold tracking-wider uppercase">
        <ShieldCheck className="w-4 h-4 text-orange-400" />
        <span>HANWHA PEOPLELIFE CORPORATE CONSULTING SECURITY</span>
      </div>

      {/* Main Lock Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-950/60 ring-1 ring-orange-400/40 mb-3.5">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-none stroke-current stroke-2">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-slate-100 tracking-tight">
              한화피플라이프
            </span>
            <span className="text-[11px] font-bold text-orange-300 bg-orange-950/80 border border-orange-500/40 px-2 py-0.5 rounded-md">
              대전글로리사업단
            </span>
          </div>

          <h1 className="text-sm font-semibold text-slate-300 mb-2">
            법인컨설팅 가상시나리오 AI
          </h1>

          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            본 시스템은 사업단 내부 전용 솔루션입니다.
            <br />
            접근을 위해 보안 비밀번호(PIN)를 입력해 주세요.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <label className="text-xs font-semibold text-slate-300">
                보안 비밀번호
              </label>
              <span className="text-[11px] text-slate-400">
                숫자 또는 문자 입력 가능
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-400">
                <KeyRound className="w-4 h-4" />
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="비밀번호 입력"
                className="w-full pl-10 pr-11 py-3 bg-slate-950 border border-orange-500/60 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30 rounded-xl text-slate-100 placeholder-slate-500 text-sm tracking-widest font-mono outline-none transition"
                autoFocus
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                title={showPassword ? '비밀번호 가리기' : '비밀번호 표시'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMessage && (
              <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5 px-1 animate-shake">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isSuccess && (
              <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5 px-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>인증 성공! 솔루션을 불러오는 중...</span>
              </div>
            )}
          </div>

          {/* Touch Keypad (스마트폰용) */}
          <div className="pt-1">
            <div className="text-[11px] font-medium text-slate-400 mb-2 px-0.5">
              간편 터치 키패드 (스마트폰용)
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-11 sm:h-12 bg-slate-800/80 hover:bg-slate-700/90 active:bg-orange-600/30 border border-slate-700/80 active:border-orange-500/50 rounded-xl text-slate-100 font-bold text-base transition flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                >
                  {digit}
                </button>
              ))}

              <button
                type="button"
                onClick={handleClear}
                className="h-11 sm:h-12 bg-slate-800/60 hover:bg-slate-700/80 active:bg-slate-700 border border-slate-700/80 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-xs sm:text-sm transition flex items-center justify-center cursor-pointer active:scale-95"
              >
                취소(C)
              </button>

              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-11 sm:h-12 bg-slate-800/80 hover:bg-slate-700/90 active:bg-orange-600/30 border border-slate-700/80 active:border-orange-500/50 rounded-xl text-slate-100 font-bold text-base transition flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleBackspace}
                className="h-11 sm:h-12 bg-slate-800/60 hover:bg-slate-700/80 active:bg-slate-700 border border-slate-700/80 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-sm transition flex items-center justify-center cursor-pointer active:scale-95"
                title="지우기"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Unlock Submit Button */}
          <button
            type="submit"
            disabled={isSuccess}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-orange-950/60 cursor-pointer active:scale-[0.99]"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>솔루션 잠금 해제</span>
          </button>
        </form>

        {/* Admin Link */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] text-slate-400">
            {isFirebaseLoading ? 'Firebase 클라우드 연동 중...' : '클라우드 보안 실시간 동기화'}
          </span>
          <button
            type="button"
            onClick={onOpenAdminAuth}
            className="text-[11px] text-slate-400 hover:text-orange-400 font-medium flex items-center gap-1 cursor-pointer transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-orange-400/80" />
            <span>관리자 보안 통제 센터</span>
          </button>
        </div>
      </div>

      {/* Security Copyright Footer */}
      <div className="mt-6 text-center text-xs text-slate-400">
        © Hanwha PeopleLife Daejeon Glory. Authorized Personnel Only.
      </div>
    </div>
  );
};
