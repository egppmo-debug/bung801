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
  Sun,
  Moon
} from 'lucide-react';
import { SecurityConfig } from '../lib/firebase';

interface SecurityLockScreenProps {
  securityConfig: SecurityConfig;
  onUnlock: () => void;
  onOpenAdminAuth: () => void;
  onOpenInstallModal?: () => void;
  isFirebaseLoading?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const SecurityLockScreen: React.FC<SecurityLockScreenProps> = ({
  securityConfig,
  onUnlock,
  onOpenAdminAuth,
  onOpenInstallModal: _onOpenInstallModal,
  isFirebaseLoading = false,
  isDarkMode = false,
  onToggleTheme,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isDark = Boolean(isDarkMode);

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
    const trimmed = (pinInput || '').trim();
    if (!trimmed) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    // Check against userPin or adminPin
    if (trimmed === securityConfig?.userPin || trimmed === securityConfig?.adminPin) {
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
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 select-none relative overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Background subtle atmospheric gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar with Security Eyebrow & Theme Toggle (모바일 잘림 방지) */}
      <div className="w-full max-w-md flex items-center justify-between gap-3 mb-4 px-1 z-20">
        <div className={`flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase truncate ${
          isDark ? 'text-orange-400' : 'text-orange-700'
        }`}>
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="truncate">한화피플라이프 보안 솔루션</span>
        </div>

        {onToggleTheme && (
          <button
            id="btn-lockscreen-theme-toggle"
            onClick={onToggleTheme}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm backdrop-blur-sm active:scale-95 border shrink-0 ${
              isDark
                ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'
            }`}
            title={isDark ? "라이트 모드로 전환 (현재: 다크모드)" : "다크 모드로 전환 (현재: 라이트모드)"}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 font-medium">라이트</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-slate-900 font-medium">다크</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Lock Card */}
      <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 transition-colors border ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 text-slate-100'
          : 'bg-white border-slate-300 text-slate-900'
      }`}>
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-950/40 ring-1 ring-orange-400/40 mb-3.5">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-none stroke-current stroke-2">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className={`text-base font-semibold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              한화피플라이프
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
              isDark
                ? 'text-orange-300 bg-orange-950/80 border-orange-500/40'
                : 'text-orange-900 bg-orange-100 border-orange-300'
            }`}>
              대전글로리사업단
            </span>
          </div>

          <h1 className={`text-sm font-semibold mb-2 ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            법인컨설팅 가상시나리오 AI
          </h1>

          <p className={`text-xs leading-relaxed max-w-xs font-normal ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            본 시스템은 사업단 내부 전용 솔루션입니다.
            <br />
            접근을 위해 보안 비밀번호(PIN)를 입력해 주세요.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <label className={`text-xs font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                보안 비밀번호
              </label>
              <span className={`text-[11px] font-normal ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                숫자 또는 문자 입력 가능
              </span>
            </div>

            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                isDark ? 'text-orange-400' : 'text-orange-600'
              }`}>
                <KeyRound className="w-4 h-4" />
              </div>

              <input
                id="input-lockscreen-pin"
                type={showPassword ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="비밀번호 입력"
                className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm tracking-widest font-mono outline-none transition font-medium border-2 ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-slate-950 placeholder-slate-400'
                }`}
                autoFocus
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer transition ${
                  isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                }`}
                title={showPassword ? '비밀번호 가리기' : '비밀번호 표시'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMessage && (
              <div className="mt-2 text-xs text-rose-500 flex items-center gap-1.5 px-1 font-medium animate-shake">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isSuccess && (
              <div className="mt-2 text-xs text-emerald-500 flex items-center gap-1.5 px-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>인증 성공! 솔루션을 불러오는 중...</span>
              </div>
            )}
          </div>

          {/* Touch Keypad (스마트폰용) */}
          <div className="pt-1">
            <div className={`text-[11px] font-medium mb-2 px-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              간편 터치 키패드 (스마트폰용)
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  id={`btn-keypad-${digit}`}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className={`lock-keypad-btn h-11 sm:h-12 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 shadow-sm border-2 ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border-slate-600 shadow-black/30'
                      : 'bg-slate-100 hover:bg-slate-200 active:bg-orange-100 border-slate-300'
                  }`}
                >
                  <span
                    className="font-semibold text-lg tracking-normal leading-none select-none"
                    style={{ color: isDark ? '#ffffff' : '#090d16' }}
                  >
                    {digit}
                  </span>
                </button>
              ))}

              <button
                id="btn-keypad-clear"
                type="button"
                onClick={handleClear}
                className={`lock-keypad-action-btn h-11 sm:h-12 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 border-2 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-600'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300'
                }`}
                title="입력 내용 전체 취소"
              >
                <span
                  className="font-medium text-xs sm:text-sm select-none"
                  style={{ color: isDark ? '#f8fafc' : '#090d16' }}
                >
                  취소(C)
                </span>
              </button>

              <button
                id="btn-keypad-0"
                type="button"
                onClick={() => handleKeypadPress('0')}
                className={`lock-keypad-btn h-11 sm:h-12 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 shadow-sm border-2 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border-slate-600 shadow-black/30'
                    : 'bg-slate-100 hover:bg-slate-200 active:bg-orange-100 border-slate-300'
                }`}
              >
                <span
                  className="font-semibold text-lg tracking-normal leading-none select-none"
                  style={{ color: isDark ? '#ffffff' : '#090d16' }}
                >
                  0
                </span>
              </button>

              <button
                id="btn-keypad-backspace"
                type="button"
                onClick={handleBackspace}
                className={`lock-keypad-action-btn h-11 sm:h-12 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 border-2 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-600'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300'
                }`}
                title="한 글자 지우기"
              >
                <Delete
                  className="w-5 h-5 stroke-[1.8]"
                  style={{ color: isDark ? '#f8fafc' : '#090d16' }}
                />
              </button>
            </div>
          </div>

          {/* Unlock Submit Button */}
          <button
            id="btn-lockscreen-submit"
            type="submit"
            disabled={isSuccess}
            className="lock-submit-btn w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 border border-orange-400 cursor-pointer active:scale-[0.99]"
          >
            <Lock className="w-4 h-4 text-black stroke-[2]" />
            <span className="text-black font-semibold text-base">솔루션 잠금 해제</span>
          </button>
        </form>

        {/* Admin Link */}
        <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          <span className="text-[11px] font-normal">
            {isFirebaseLoading ? 'Firebase 클라우드 연동 중...' : '클라우드 보안 실시간 동기화'}
          </span>
          <button
            type="button"
            onClick={onOpenAdminAuth}
            className={`text-[11px] font-medium flex items-center gap-1 cursor-pointer transition ${
              isDark ? 'text-slate-400 hover:text-orange-400' : 'text-slate-600 hover:text-orange-600'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
            <span>관리자 보안 통제 센터</span>
          </button>
        </div>
      </div>

      {/* Security Copyright Footer */}
      <div className={`mt-6 text-center text-xs font-medium ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}>
        © Hanwha PeopleLife Daejeon Glory. Authorized Personnel Only.
      </div>
    </div>
  );
};
