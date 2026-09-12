import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  Cloud, 
  UserCheck, 
  LogOut,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { SecurityConfig, updateSecurityConfig } from '../lib/firebase';

interface AdminSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  securityConfig: SecurityConfig;
  onLockScreen: () => void;
  onConfigUpdated: (newConfig: SecurityConfig) => void;
}

export const AdminSecurityModal: React.FC<AdminSecurityModalProps> = ({
  isOpen,
  onClose,
  securityConfig,
  onLockScreen,
  onConfigUpdated,
}) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthInput, setAdminAuthInput] = useState('');
  const [showAdminAuthPw, setShowAdminAuthPw] = useState(false);
  const [authError, setAuthError] = useState('');

  // Tabs: 'user' | 'admin'
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

  // User PIN change states
  const [newUserPin, setNewUserPin] = useState('');
  const [confirmUserPin, setConfirmUserPin] = useState('');
  const [showNewUserPin, setShowNewUserPin] = useState(false);
  const [userPinStatus, setUserPinStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Admin PIN change states
  const [newAdminPin, setNewAdminPin] = useState('');
  const [confirmAdminPin, setConfirmAdminPin] = useState('');
  const [showNewAdminPin, setShowNewAdminPin] = useState(false);
  const [adminPinStatus, setAdminPinStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  // Handle Admin Passcode verification
  const handleVerifyAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAuthInput.trim()) {
      setAuthError('관리자 비밀번호를 입력하세요.');
      return;
    }

    if (adminAuthInput.trim() === securityConfig.adminPin) {
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('관리자 비밀번호가 일치하지 않습니다.');
    }
  };

  // Handle User PIN update to Firebase Firestore
  const handleSaveUserPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserPinStatus({ type: 'idle', message: '' });

    if (!newUserPin || newUserPin.length < 4) {
      setUserPinStatus({
        type: 'error',
        message: '새 비밀번호는 4자리 이상으로 설정해 주세요.'
      });
      return;
    }

    if (newUserPin !== confirmUserPin) {
      setUserPinStatus({
        type: 'error',
        message: '비밀번호와 재입력 확인 값이 일치하지 않습니다.'
      });
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateSecurityConfig(
        { userPin: newUserPin.trim() },
        '대전글로리사업단 관리자'
      );
      onConfigUpdated(updated);
      setUserPinStatus({
        type: 'success',
        message: '클라우드에 저장되었습니다! 전체 단말기에 즉시 실시간 일괄 반영됩니다.'
      });
      setNewUserPin('');
      setConfirmUserPin('');
    } catch (err: any) {
      console.error('Failed to update user PIN in Firebase:', err);
      setUserPinStatus({
        type: 'error',
        message: '클라우드 저장 중 오류가 발생했습니다. 네트워크 상태를 확인하세요.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Admin PIN update to Firebase Firestore
  const handleSaveAdminPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPinStatus({ type: 'idle', message: '' });

    if (!newAdminPin || newAdminPin.length < 4) {
      setAdminPinStatus({
        type: 'error',
        message: '새 관리자 비밀번호는 4자리 이상으로 설정해 주세요.'
      });
      return;
    }

    if (newAdminPin !== confirmAdminPin) {
      setAdminPinStatus({
        type: 'error',
        message: '관리자 비밀번호와 재입력 확인 값이 일치하지 않습니다.'
      });
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateSecurityConfig(
        { adminPin: newAdminPin.trim() },
        '대전글로리사업단 마스터 관리자'
      );
      onConfigUpdated(updated);
      setAdminPinStatus({
        type: 'success',
        message: '새로운 관리자 비밀번호가 클라우드에 안전하게 저장되었습니다.'
      });
      setNewAdminPin('');
      setConfirmAdminPin('');
    } catch (err: any) {
      console.error('Failed to update admin PIN in Firebase:', err);
      setAdminPinStatus({
        type: 'error',
        message: '클라우드 저장 중 오류가 발생했습니다.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsAdminAuthenticated(false);
    setAdminAuthInput('');
    setAuthError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Red Shield Icon Badge */}
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-950/50 ring-1 ring-red-400/40 shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  관리자 보안 통제 센터
                </h2>
                <span className="text-[10px] font-extrabold text-red-300 bg-red-950/90 border border-red-500/50 px-2 py-0.5 rounded tracking-wider">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>한화피플라이프 대전글로리사업단</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <Cloud className="w-3 h-3" />
                  <span>클라우드 실시간 동기화</span>
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center cursor-pointer"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {!isAdminAuthenticated ? (
            /* STEP 1: Admin Authentication Required */
            <div className="space-y-5">
              {/* Yellow Alert Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-300 mb-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>관리자 인증 필요</span>
                </div>
                <p className="text-xs text-amber-300/90 leading-relaxed">
                  접속 비밀번호 설정 및 솔루션 보안 관리는 사업단 관리자만 수행할 수 있습니다.
                  계속하려면 관리자 비밀번호를 입력하세요.
                </p>
              </div>

              {/* Admin PIN Input Form */}
              <form onSubmit={handleVerifyAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    관리자 비밀번호
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminAuthPw ? 'text' : 'password'}
                      value={adminAuthInput}
                      onChange={(e) => {
                        setAdminAuthInput(e.target.value);
                        setAuthError('');
                      }}
                      placeholder="관리자 비밀번호 입력"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/30 rounded-xl text-slate-100 placeholder-slate-500 text-sm tracking-widest font-mono outline-none transition"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminAuthPw(!showAdminAuthPw)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showAdminAuthPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {authError && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{authError}</span>
                      </p>
                      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
                        <p className="font-semibold text-orange-400">💡 관리자 비밀번호를 분실하셨나요?</p>
                        <p>
                          Firebase 콘솔(<strong className="text-slate-200">Firestore Database</strong>)의{' '}
                          <code className="px-1 py-0.5 bg-slate-900 text-orange-300 rounded font-mono">system/security</code> 문서에서{' '}
                          <code className="text-emerald-300">adminPin</code> 또는 <code className="text-emerald-300">userPin</code> 값을 직접 수정하시면 즉시 실시간으로 동기화됩니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-100 hover:text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                >
                  <Lock className="w-4 h-4 text-orange-400" />
                  <span>관리자 승인 및 설정 열기</span>
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: Authenticated Admin Security Center */
            <div className="space-y-5">
              {/* Two Navigation Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('user')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'user'
                      ? 'bg-slate-800 text-orange-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>사용자(FA) 비밀번호</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-slate-800 text-red-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>관리자 비밀번호</span>
                </button>
              </div>

              {activeTab === 'user' ? (
                /* TAB 1: User (FA) PIN Configuration */
                <div className="space-y-4">
                  {/* Current Password Info Card */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-xs text-amber-300">
                        현재 클라우드 적용 비밀번호
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-950/90 border border-amber-500/50 text-amber-300 font-mono font-extrabold text-sm tracking-widest shadow-inner">
                        {securityConfig.userPin}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-300/90 leading-relaxed">
                      여기서 비밀번호를 변경하면 모든 소속 FA 스마트폰/PC에 실시간으로 즉시 일괄 반영됩니다.
                    </p>
                    <div className="mt-1.5 text-[10px] text-amber-400/80 font-mono">
                      최근 클라우드 동기화: {securityConfig.lastSynced || '정상 연동'}
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSaveUserPin} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        새 사용자 비밀번호 (4자리 이상 숫자/영문)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewUserPin ? 'text' : 'password'}
                          value={newUserPin}
                          onChange={(e) => setNewUserPin(e.target.value)}
                          placeholder="예: 1234 또는 사업단 지정번호"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 rounded-xl text-slate-100 placeholder-slate-500 text-sm font-mono tracking-wider outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewUserPin(!showNewUserPin)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showNewUserPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        새 비밀번호 재입력 확인
                      </label>
                      <input
                        type="password"
                        value={confirmUserPin}
                        onChange={(e) => setConfirmUserPin(e.target.value)}
                        placeholder="새 비밀번호 다시 입력"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 rounded-xl text-slate-100 placeholder-slate-500 text-sm font-mono tracking-wider outline-none transition"
                      />
                    </div>

                    {userPinStatus.message && (
                      <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        userPinStatus.type === 'success' 
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                      }`}>
                        {userPinStatus.type === 'success' ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span>{userPinStatus.message}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>{isSaving ? '클라우드 저장 중...' : '전체 단말기 일괄 적용 및 클라우드 저장'}</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* TAB 2: Admin PIN Configuration */
                <div className="space-y-4">
                  {/* Current Admin Password Info Card */}
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-xs text-red-300">
                        현재 관리자 비밀번호
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-red-950/90 border border-red-500/50 text-red-300 font-mono font-extrabold text-sm tracking-widest shadow-inner">
                        {securityConfig.adminPin}
                      </span>
                    </div>
                    <p className="text-[11px] text-red-300/90 leading-relaxed">
                      관리자 보안 통제 센터에 접근할 수 있는 마스터 관리자 비밀번호입니다. 
                      사업단장 및 전담 관리자에게만 공유하세요.
                    </p>
                    <div className="mt-1.5 text-[10px] text-red-400/80 font-mono">
                      최근 클라우드 동기화: {securityConfig.lastSynced || '정상 연동'}
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSaveAdminPin} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        새 관리자 비밀번호 (4자리 이상)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewAdminPin ? 'text' : 'password'}
                          value={newAdminPin}
                          onChange={(e) => setNewAdminPin(e.target.value)}
                          placeholder="새 관리자 비밀번호 입력"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 rounded-xl text-slate-100 placeholder-slate-500 text-sm font-mono tracking-wider outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewAdminPin(!showNewAdminPin)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showNewAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        새 관리자 비밀번호 재입력 확인
                      </label>
                      <input
                        type="password"
                        value={confirmAdminPin}
                        onChange={(e) => setConfirmAdminPin(e.target.value)}
                        placeholder="새 관리자 비밀번호 다시 입력"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 rounded-xl text-slate-100 placeholder-slate-500 text-sm font-mono tracking-wider outline-none transition"
                      />
                    </div>

                    {adminPinStatus.message && (
                      <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        adminPinStatus.type === 'success' 
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                      }`}>
                        {adminPinStatus.type === 'success' ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span>{adminPinStatus.message}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSaving ? '클라우드 저장 중...' : '관리자 비밀번호 변경 및 클라우드 저장'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            {isAdminAuthenticated ? '작업 완료 후 화면 즉시 잠금' : '화면 즉시 잠금만 필요하신가요?'}
          </span>
          <button
            type="button"
            onClick={() => {
              handleCloseModal();
              onLockScreen();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5 text-orange-400" />
            <span>{isAdminAuthenticated ? '지금 잠그기 (로그아웃)' : '지금 잠그기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
