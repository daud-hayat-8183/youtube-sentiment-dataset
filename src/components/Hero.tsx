"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = ["conversations", "comments", "insights", "metrics"];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-center pt-24 lg:pt-32 pb-12 lg:pb-16 px-4 relative z-10 select-none">
      
      {/* Title with flex wrapping so it doesn't break awkwardly on desktop */}
      <h1 className="text-4xl md:text-6xl lg:text-[5rem] lg:leading-[1.15] font-extrabold tracking-tight text-gray-900 leading-[1.1] max-w-5xl lg:max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
        <span>Turn your YouTube</span>
        <span className="relative inline-flex h-[1.1em] overflow-hidden items-center justify-center min-w-[240px] md:min-w-[320px] lg:min-w-[380px] pb-1">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={WORDS[index]}
              initial={{ y: 30, opacity: 0, filter: "blur(12px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -30, opacity: 0, filter: "blur(12px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute text-blue-600 bg-clip-text whitespace-nowrap will-change-transform"
            >
              {WORDS[index]}
            </motion.span>
          </AnimatePresence>
          {/* invisible spacer based on the longest word to prevent layout shifting */}
          <span className="invisible pointer-events-none">conversations</span>
        </span>
        <span>into data.</span>
      </h1>
      
      <p className="mt-8 lg:mt-12 text-lg md:text-xl lg:text-[1.35rem] text-gray-600 max-w-3xl lg:max-w-4xl font-medium leading-relaxed">
        Transform raw YouTube interactions into structured datasets optimized for advanced machine learning and sentiment analysis.
      </p>
    </div>
  );
}
