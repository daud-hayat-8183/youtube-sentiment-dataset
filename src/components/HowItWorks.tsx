export default function HowItWorks() {
  const steps = [
    {
      title: "Extraction",
      desc: "Connects securely to YouTube Data API to stream comments, replies, and deep engagement metrics without timeouts."
    },
    {
      title: "Normalization",
      desc: "Cleanses raw text strings, preserves emojis/Unicode, and flattens hierarchical comment threads into flat structures."
    },
    {
      title: "Export",
      desc: "Generates strict, UTF-8 BOM compliant CSV datasets guaranteed to load seamlessly into Pandas or ML environments."
    }
  ];

  return (
    <section className="w-full max-w-6xl lg:max-w-7xl mx-auto px-4 py-32 lg:py-40 relative z-20 select-none">
      <div className="text-center mb-20 lg:mb-24">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 lg:mb-6 tracking-tight">The Data Pipeline</h2>
        <p className="text-lg lg:text-xl text-gray-800 max-w-2xl lg:max-w-3xl mx-auto font-medium">
          A seamless, server-side extraction process built to handle thousands of records effortlessly.
        </p>
      </div>

      <div className="relative">
        {/* Continuous Pipeline Line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-300 -translate-y-1/2 rounded-full opacity-70"></div>
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400 -translate-y-1/2 rounded-full blur-[4px] opacity-60 animate-pulse"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 relative z-10">
          {steps.map((step, idx) => (
            <div key={step.title} className="group relative animate-[hover-float_4s_ease-in-out_infinite] will-change-transform" style={{ animationDelay: `${idx * 0.4}s` }}>
              {/* Glowing Node */}
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.6)] z-0 group-hover:scale-125 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-indigo-500 animate-ping opacity-30"></div>
              </div>
              
              <div className="relative h-full pt-12 lg:pt-16 pb-8 lg:pb-12 px-6 sm:px-8 lg:px-10 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.05),inset_0_0_30px_rgba(255,255,255,0.6)] flex flex-col items-center text-center group-hover:-translate-y-2 group-hover:shadow-[0_30px_60px_rgba(99,102,241,0.15),inset_0_0_40px_rgba(255,255,255,0.8)] transition-all duration-500 z-10 will-change-transform">
                <div className="text-indigo-800 font-mono text-sm lg:text-base font-extrabold mb-4 lg:mb-6 tracking-widest uppercase bg-indigo-100/50 inline-block px-3 py-1 lg:px-4 lg:py-1.5 rounded-full w-max border border-indigo-200">Stage 0{idx + 1}</div>
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3 lg:mb-4">{step.title}</h3>
                <p className="text-gray-800 lg:text-lg font-semibold leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
