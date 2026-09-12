// Web Speech API Voice synthesis helper for Korean dialogue

export interface TTSOptions {
  rate?: number; // 0.8 ~ 1.5
  pitch?: number; // 0.8 ~ 1.2
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private koreanVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const all = this.synth.getVoices();
    this.koreanVoices = all.filter((v) => v.lang.startsWith('ko') || v.lang.includes('KR'));
  }

  public getKoreanVoices(): SpeechSynthesisVoice[] {
    if (this.koreanVoices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.koreanVoices;
  }

  public speak(
    text: string,
    speaker: 'consultant' | 'ceo',
    options?: TTSOptions
  ) {
    if (!this.synth) {
      if (options?.onError) options.onError('이 브라우저는 음성 합성을 지원하지 않습니다.');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';

    const voices = this.getKoreanVoices();
    if (voices.length > 0) {
      // Pick voice or adjust pitch/rate by speaker
      if (speaker === 'consultant') {
        // Clear, professional, confident tone
        utterance.voice = voices[0];
        utterance.pitch = options?.pitch ?? 1.05;
        utterance.rate = options?.rate ?? 1.05;
      } else {
        // Deep, deliberate executive tone
        utterance.voice = voices.length > 1 ? voices[1] : voices[0];
        utterance.pitch = options?.pitch ?? 0.9;
        utterance.rate = options?.rate ?? 0.95;
      }
    } else {
      utterance.pitch = speaker === 'consultant' ? 1.05 : 0.9;
      utterance.rate = speaker === 'consultant' ? 1.0 : 0.95;
    }

    if (options?.rate) {
      utterance.rate = options.rate;
    }

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      options?.onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechService = new SpeechService();
