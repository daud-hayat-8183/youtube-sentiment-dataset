

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/40 bg-white/20 backdrop-blur-2xl py-16 lg:py-20 relative z-30 select-none">
      <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 flex flex-col items-center">
        <div className="mb-8 lg:mb-10 text-center">
          <p className="text-gray-900 font-black text-2xl lg:text-3xl tracking-tighter">CommentLens</p>
          <p className="text-gray-600 text-sm lg:text-base mt-3 lg:mt-4 max-w-lg lg:max-w-xl leading-relaxed font-medium">
            A premium data utility designed to seamlessly convert public YouTube conversations into highly structured, NLP-ready datasets.
          </p>
        </div>
        
        <p className="text-sm lg:text-base font-bold text-indigo-900 bg-indigo-100/70 px-6 py-2 lg:px-8 lg:py-3 rounded-full border border-indigo-200/60 shadow-sm uppercase tracking-widest animate-[hover-float_4s_ease-in-out_infinite] will-change-transform">
          Crafted by Dawood Hayat
        </p>
      </div>
    </footer>
  );
}
