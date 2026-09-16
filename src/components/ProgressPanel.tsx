"use client";

import { Loader2, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface ProgressState {
  stage: string;
  count?: number;
  subStage?: string;
  isComplete: boolean;
  error?: string;
}

interface ProgressPanelProps {
  progress: ProgressState;
}

export default function ProgressPanel({ progress }: ProgressPanelProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  useEffect(() => {
    // Play a subtle click sound when count increases significantly if enabled
    if (soundEnabled && progress.count && progress.count - lastCount > 50) {
      setLastCount(progress.count);
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."); // dummy or no-op if real sound not present, let's use web audio API instead
        
        // A simple web audio beep to avoid needing a file
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {
        // ignore audio errors
      }
    }
  }, [progress.count, soundEnabled, lastCount]);

  if (progress.error) {
    return (
      <div className="w-full max-w-2xl mx-auto glass-panel rounded-2xl p-6 border-red-200/50 bg-red-50/40">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">Collection Failed</h3>
            <p className="text-red-700 mt-1">{progress.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-live="polite" className="w-full max-w-xl mx-auto rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-white/60 backdrop-blur-3xl border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col items-center text-center">
      {/* Background ambient glow inside the glass modal */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 pointer-events-none" />

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2.5 text-gray-500 hover:text-indigo-600 transition-all duration-300 bg-white/60 border border-white/60 rounded-full hover:bg-white shadow-sm hover:shadow-md"
          title={soundEnabled ? "Disable sound" : "Enable sound"}
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-6 relative z-10 w-full">
        <div className="relative">
          {progress.isComplete ? (
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 border border-green-300/50 text-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/50 text-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse relative">
              <Loader2 className="w-10 h-10 animate-spin relative z-10" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-400/20 animate-ping"></div>
            </div>
          )}
        </div>

        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {progress.stage}
          </h2>
          {progress.count !== undefined && progress.count > 0 && (
            <div className="mt-2">
              <span className="text-lg text-indigo-800 font-bold font-mono bg-white/70 border border-white shadow-sm inline-block px-5 py-1.5 rounded-full">
                {progress.count.toLocaleString()} records processed
              </span>
            </div>
          )}
          {progress.subStage && (
            <p className="text-gray-600 font-semibold mt-3 text-sm">
              {progress.subStage}
            </p>
          )}
        </div>

        {/* Indeterminate liquid progress bar */}
        {!progress.isComplete && (
          <div className="w-full h-3 bg-gray-200/50 rounded-full overflow-hidden relative shadow-inner mt-4">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
}
