import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface SecurityConfig {
  userPin: string;
  adminPin: string;
  updatedAt: string;
  updatedBy: string;
  lastSynced?: string;
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  userPin: '3211',
  adminPin: '7788',
  updatedAt: new Date().toISOString(),
  updatedBy: '한화피플라이프 대전글로리사업단 관리자',
  lastSynced: '기본 설정'
};

const SECURITY_DOC_PATH = 'system/security';

/**
 * Fetch security credentials from Firestore with graceful fallback to local storage
 */
export async function fetchSecurityConfig(): Promise<SecurityConfig> {
  try {
    const docRef = doc(db, 'system', 'security');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Partial<SecurityConfig>;
      const config: SecurityConfig = {
        userPin: data.userPin || DEFAULT_SECURITY_CONFIG.userPin,
        adminPin: data.adminPin || DEFAULT_SECURITY_CONFIG.adminPin,
        updatedAt: data.updatedAt || new Date().toISOString(),
        updatedBy: data.updatedBy || DEFAULT_SECURITY_CONFIG.updatedBy,
        lastSynced: new Date().toLocaleTimeString('ko-KR')
      };
      // Cache in localStorage
      localStorage.setItem('daejeon_glory_security_config', JSON.stringify(config));
      return config;
    } else {
      // Document doesn't exist yet, seed initial security document
      await setDoc(docRef, DEFAULT_SECURITY_CONFIG);
      return DEFAULT_SECURITY_CONFIG;
    }
  } catch (err) {
    console.warn('[Firebase] Failed to fetch security config from Firestore, attempting server fallback:', err);
    try {
      const res = await fetch('/api/security/pins');
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && serverData.userPin) {
          localStorage.setItem('daejeon_glory_security_config', JSON.stringify(serverData));
          return serverData;
        }
      }
    } catch {
      // ignore
    }
    const cached = localStorage.getItem('daejeon_glory_security_config');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return DEFAULT_SECURITY_CONFIG;
  }
}

/**
 * Real-time listener for security credential changes across all connected devices
 */
export function subscribeSecurityConfig(
  onUpdate: (config: SecurityConfig) => void,
  onError?: (err: any) => void
) {
  try {
    const docRef = doc(db, 'system', 'security');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<SecurityConfig>;
          const config: SecurityConfig = {
            userPin: data.userPin || DEFAULT_SECURITY_CONFIG.userPin,
            adminPin: data.adminPin || DEFAULT_SECURITY_CONFIG.adminPin,
            updatedAt: data.updatedAt || new Date().toISOString(),
            updatedBy: data.updatedBy || DEFAULT_SECURITY_CONFIG.updatedBy,
            lastSynced: new Date().toLocaleTimeString('ko-KR')
          };
          localStorage.setItem('daejeon_glory_security_config', JSON.stringify(config));
          onUpdate(config);
        } else {
          // Attempt seeding
          setDoc(docRef, DEFAULT_SECURITY_CONFIG).catch(() => {});
          onUpdate(DEFAULT_SECURITY_CONFIG);
        }
      },
      (err) => {
        console.warn('[Firebase] onSnapshot error for security config:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('[Firebase] Failed to subscribe to security config:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Update user PIN or admin PIN in Firestore
 */
export async function updateSecurityConfig(
  partial: Partial<Pick<SecurityConfig, 'userPin' | 'adminPin'>>,
  updatedBy: string = '대전글로리사업단 관리자'
): Promise<SecurityConfig> {
  const current = await fetchSecurityConfig();
  const updated: SecurityConfig = {
    ...current,
    ...partial,
    updatedAt: new Date().toISOString(),
    updatedBy,
    lastSynced: new Date().toLocaleTimeString('ko-KR')
  };

  const docRef = doc(db, 'system', 'security');
  try {
    await setDoc(docRef, updated);
  } catch (firestoreErr) {
    console.warn('[Firebase] setDoc failed, proceeding with server and local sync:', firestoreErr);
  }

  // Backup sync to server endpoint
  try {
    await fetch('/api/security/pins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  } catch (serverErr) {
    console.warn('[Firebase] Server endpoint backup sync failed:', serverErr);
  }

  localStorage.setItem('daejeon_glory_security_config', JSON.stringify(updated));
  return updated;
}
