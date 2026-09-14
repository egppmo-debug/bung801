import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Gauge, 
  User, 
  Briefcase,
  Headphones,
  Download
} from 'lucide-react';
import { DialogueTurn } from '../types';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentTurnIndex: number;
  totalTurns: number;
  currentTurn?: DialogueTurn;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onPlayAll: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onPrevTurn: () => void;
  onNextTurn: () => void;
  onOpenMp3Modal?: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  isPaused,
  currentTurnIndex,
  totalTurns,
  currentTurn,
  playbackSpeed,
  onChangeSpeed,
  onPlayAll,
  onPause,
  onResume,
  onStop,
  onPrevTurn,
  onNextTurn,
  onOpenMp3Modal,
}) => {
  const isConsultant = currentTurn?.speaker === 'consultant';

  return (
    <div className="bg-slate-900/95 border border-slate-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-md mb-6 transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Current speaker & stage info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
              isPlaying && !isPaused
                ? isConsultant
                  ? 'bg-orange-600/30 border-orange-500 text-orange-300 ring-2 ring-orange-500/20'
                  : 'bg-blue-600/30 border-blue-500 text-blue-300 ring-2 ring-blue-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isConsultant ? (
              <Briefcase className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">
                {currentTurn
                  ? `턴 ${currentTurn.turnNumber} / ${totalTurns}`
                  : `전체 ${totalTurns}턴 대화`}
              </span>
              {currentTurn && (
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 truncate">
                  {currentTurn.stageName}
                </span>
              )}
            </div>
            <div className="text-xs font-medium text-slate-200 truncate flex items-center gap-1.5 mt-0.5">
              {isPlaying && !isPaused ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  음성 재생 중:
                </span>
              ) : isPaused ? (
                <span className="text-amber-400 font-semibold">일시 정지됨:</span>
              ) : (
                <span className="text-slate-400">음성 청취 대기:</span>
              )}
              <span className="font-bold text-slate-100">
                {currentTurn ? currentTurn.speakerTitle : '15턴 전체 순차 청취 지원'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center">
          <button
            id="btn-prev-turn"
            onClick={onPrevTurn}
            disabled={currentTurnIndex <= 0}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            title="이전 턴"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {!isPlaying ? (
            <button
              id="btn-play-all"
              onClick={onPlayAll}
              className="px-3 sm:px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-black text-xs flex items-center gap-1.5 sm:gap-2 shadow-lg transition cursor-pointer"
              title="전체 15턴 자동 음성 청취"
            >
              <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-black shrink-0" />
              <span>재생</span>
            </button>
          ) : isPaused ? (
            <button
              id="btn-resume-audio"
              onClick={onResume}
              className="px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
            >
              <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-black shrink-0" />
              <span>재생</span>
            </button>
          ) : (
            <button
              id="btn-pause-audio"
              onClick={onPause}
              className="px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
            >
              <Pause className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
              <span>일시정지</span>
            </button>
          )}

          <button
            id="btn-stop-audio"
            onClick={onStop}
            disabled={!isPlaying && !isPaused}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            title="정지"
          >
            <Square className="w-4 h-4" />
          </button>

          <button
            id="btn-next-turn"
            onClick={onNextTurn}
            disabled={currentTurnIndex >= totalTurns - 1}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            title="다음 턴"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: MP3 Download & Speed Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {onOpenMp3Modal && (
            <button
              id="btn-player-mp3-download"
              onClick={onOpenMp3Modal}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-500/40 text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition shadow-sm shrink-0 cursor-pointer"
              title="전체 대본 MP3 파일 다운로드"
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>MP3</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-0.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
            </span>
            {[0.8, 1.0, 1.2, 1.5].map((speed) => (
              <button
                key={speed}
                id={`btn-speed-${speed}`}
                onClick={() => onChangeSpeed(speed)}
                className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-orange-500 text-black font-black shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:text-white border border-slate-300 dark:border-slate-700'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Turn Progress Bar */}
      <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-amber-400 h-1.5 rounded-full transition-all duration-300"
          style={{
            width: `${((currentTurnIndex + 1) / totalTurns) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
