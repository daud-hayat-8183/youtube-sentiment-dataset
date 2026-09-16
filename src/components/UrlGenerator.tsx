"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UrlGeneratorProps {
  onGenerate: (url: string) => void;
  disabled?: boolean;
}

export default function UrlGenerator({ onGenerate, disabled }: UrlGeneratorProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateAndGenerate = () => {
    if (!url.trim()) return;
    
    const isValid = /youtube\.com\/|youtu\.be\//.test(url);
    if (!isValid) {
      setError("Please enter a valid YouTube URL.");
      return;
    }
    
    setError("");
    onGenerate(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateAndGenerate();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-16 flex flex-col items-center relative z-20">
      <div 
        className={cn(
          "relative flex items-center w-full max-w-2xl p-2 rounded-full glass-panel-strong transition-all duration-500 overflow-hidden group",
          error ? "border-red-400 ring-2 ring-red-100/50" : "focus-within:ring-4 focus-within:ring-blue-200/50 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] focus-within:shadow-[0_8px_32px_rgba(59,130,246,0.2)]"
        )}
      >
        {/* Animated background glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/20 to-purple-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="pl-5 pr-3 text-blue-500 relative z-10">
          <Sparkles className="w-5 h-5 opacity-70" />
        </div>
        
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Paste YouTube video, short, or stream link..."
          className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-lg py-3 min-w-0 relative z-10 selection:bg-blue-100"
        />
        
        <button
          onClick={validateAndGenerate}
          disabled={disabled || !url.trim()}
          className="ml-2 bg-gray-900 hover:bg-black text-white font-semibold py-3.5 px-8 rounded-full flex items-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap relative z-10"
        >
          Generate <ArrowRight className="w-4 h-4 hidden sm:block transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 mt-4 font-medium text-sm animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
      
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <span className="px-3 py-1 rounded-full bg-white/40 border border-white/60 text-xs font-semibold text-gray-600 backdrop-blur-sm shadow-sm">
          NLP-Ready Output
        </span>
        <span className="px-3 py-1 rounded-full bg-white/40 border border-white/60 text-xs font-semibold text-gray-600 backdrop-blur-sm shadow-sm">
          Sentiment Analysis
        </span>
        <span className="px-3 py-1 rounded-full bg-white/40 border border-white/60 text-xs font-semibold text-gray-600 backdrop-blur-sm shadow-sm">
          Engagement Metrics
        </span>
      </div>
    </div>
  );
}
