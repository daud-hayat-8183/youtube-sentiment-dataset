"use client";

import { useState } from "react";
import Hero from "./Hero";
import UrlGenerator from "./UrlGenerator";
import ProgressPanel, { ProgressState } from "./ProgressPanel";
import ResultPanel from "./ResultPanel";

export default function MainContent() {
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [progress, setProgress] = useState<ProgressState>({ stage: "", isComplete: false });
  const [resultData, setResultData] = useState<any>(null);

  const handleGenerate = async (url: string) => {
    setStatus("generating");
    setProgress({ stage: "Connecting to server...", isComplete: false, error: undefined });
    setResultData(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // keep the last incomplete chunk

        for (const block of lines) {
          const linesInBlock = block.split("\n");
          let eventType = "message";
          let eventData = "";

          for (const line of linesInBlock) {
            if (line.startsWith("event:")) {
              eventType = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              eventData = line.slice(5).trim();
            }
          }

          if (eventData) {
            try {
              const data = JSON.parse(eventData);
              if (eventType === "progress") {
                setProgress({
                  stage: data.stage,
                  count: data.count,
                  subStage: data.subStage,
                  isComplete: false
                });
              } else if (eventType === "done") {
                setProgress(prev => ({ ...prev, stage: "Ready", isComplete: true }));
                setResultData(data);
                setStatus("done");
              } else if (eventType === "error") {
                throw new Error(data.message);
              }
            } catch (e: any) {
              // ignore parse errors for partial chunks if any
            }
          }
        }
      }
    } catch (error: any) {
      setProgress({ stage: "Error", isComplete: false, error: error.message || "Failed to connect" });
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setProgress({ stage: "", isComplete: false });
    setResultData(null);
  };

  return (
    <main className="w-full relative z-10 flex flex-col items-center min-h-[70vh]">
      {(status === "idle" || status === "generating") && (
        <div className={`w-full transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 ${status === "generating" ? "blur-md opacity-40 pointer-events-none scale-95" : ""}`}>
          <Hero />
          <UrlGenerator onGenerate={handleGenerate} disabled={status === "generating"} />
        </div>
      )}

      {status === "generating" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/20 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="w-full max-w-xl animate-in zoom-in-95 duration-500">
            <ProgressPanel progress={progress} />
            {progress.error && (
              <div className="mt-8 text-center">
                <button 
                  onClick={handleReset}
                  className="px-8 py-3 bg-white/90 hover:bg-white text-gray-900 font-bold rounded-full shadow-xl transition-all border border-gray-200 hover:-translate-y-1"
                >
                  Dismiss Error & Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {status === "done" && resultData && (
        <div className="w-full px-4 pt-12 pb-24">
          <ResultPanel 
            videoInfo={resultData.videoInfo}
            totalRecords={resultData.totalRecords}
            topLevelCount={resultData.topLevelCount}
            repliesCount={resultData.repliesCount}
            csvData={resultData.csvData}
            onReset={handleReset}
          />
        </div>
      )}
    </main>
  );
}
