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
    <div aria-live="polite" className="w-full max-w-2xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 text-gray-500 hover:text-gray-800 transition-colors bg-white/50 rounded-full hover:bg-white/80"
          title={soundEnabled ? "Disable sound" : "Enable sound"}
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative">
          {progress.isComplete ? (
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {progress.stage}
          </h2>
          {progress.count !== undefined && progress.count > 0 && (
            <p className="text-lg text-blue-700 font-medium font-mono bg-blue-50/50 inline-block px-4 py-1 rounded-full">
              {progress.count.toLocaleString()} records processed
            </p>
          )}
          {progress.subStage && (
            <p className="text-gray-500 mt-2 text-sm">
              {progress.subStage}
            </p>
          )}
        </div>

        {/* Indeterminate progress bar */}
        {!progress.isComplete && (
          <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-blue-500 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
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
