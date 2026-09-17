import { Terminal, Database, Code2 } from "lucide-react";

export default function DatasetPreview() {
  const sampleData = [
    { text: "This is a fantastic analysis!", type: "TOP_LEVEL", likes: 142, date: "2023-10-12T14:22:11Z" },
    { text: "I totally agree with this point.", type: "REPLY", likes: 15, date: "2023-10-12T15:01:44Z" },
    { text: "Can you make a part 2?", type: "TOP_LEVEL", likes: 89, date: "2023-10-13T09:12:00Z" },
    { text: "Yes please, the depth here is incredible.", type: "REPLY", likes: 4, date: "2023-10-13T10:05:12Z" },
  ];

  return (
    <section className="w-full max-w-6xl lg:max-w-7xl mx-auto px-4 py-20 lg:py-32 relative z-20 select-none">
      <div className="text-center mb-16 lg:mb-20">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 lg:mb-6 tracking-tight">Machine Learning Ready</h2>
        <p className="text-lg lg:text-xl text-gray-800 max-w-2xl lg:max-w-3xl mx-auto font-medium">
          Say goodbye to nested JSON loops and broken CSV rows. CommentLens delivers a perfectly flat, escaped, and typed dataset structure immediately ready for NLP.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        
        {/* Terminal/JSON Preview */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(255,255,255,0.1)] h-full flex flex-col will-change-transform">
            <div className="px-6 lg:px-8 py-4 lg:py-5 border-b border-gray-700/50 flex items-center gap-3 bg-gray-800/40">
              <div className="flex gap-2">
                <div className="w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-gray-400 text-sm lg:text-base font-mono ml-2 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> schema.json
              </span>
            </div>
            <div className="p-6 lg:p-8 overflow-x-auto flex-grow relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/40 pointer-events-none"></div>
              <pre className="text-sm lg:text-base font-mono text-gray-300 leading-relaxed">
                <code>{`{
  "dataset": {
    "id": "youtube_comments",
    "format": "CSV",
    "encoding": "UTF-8",
    "features": [
      "video_id",
      "comment_id",
      "text_clean",
      "author",
      "likes",
      "published_at",
      "is_reply",
      "parent_id"
    ]
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Visual Data Grid Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white/30 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.05),inset_0_0_30px_rgba(255,255,255,0.6)] h-full flex flex-col will-change-transform">
            <div className="bg-white/40 px-6 lg:px-8 py-4 lg:py-5 border-b border-white/50 flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-gray-900 lg:text-lg">
                <Database className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" /> DataFrame Preview
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 lg:px-4 lg:py-1.5 bg-white/60 rounded-full text-xs lg:text-sm font-bold text-gray-800 border border-white/80 shadow-[inset_0_0_10px_rgba(255,255,255,1)]">
                <Code2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> import pandas as pd
              </div>
            </div>
            <div className="overflow-x-auto p-4 lg:p-6 flex-1">
            <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-300 text-xs lg:text-sm uppercase tracking-wider text-gray-600 font-extrabold">
                  <th className="px-4 lg:px-6 py-3 lg:py-4">cleaned_comment</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4">type</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-right">likes</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4">published_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {sampleData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/60 transition-colors text-sm lg:text-base text-gray-900 font-medium group/row">
                    <td className="px-4 lg:px-6 py-4 lg:py-5 max-w-[200px] lg:max-w-[250px] truncate text-gray-900 group-hover/row:text-blue-900 transition-colors">{row.text}</td>
                    <td className="px-4 lg:px-6 py-4 lg:py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-md text-xs lg:text-sm font-bold tracking-wide shadow-sm border ${
                        row.type === 'TOP_LEVEL' ? 'bg-blue-100 text-blue-900 border-blue-200' : 'bg-purple-100 text-purple-900 border-purple-200'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-5 text-right font-mono text-gray-700 font-bold">{row.likes}</td>
                    <td className="px-4 lg:px-6 py-4 lg:py-5 font-mono text-gray-600 text-xs lg:text-sm font-semibold">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>

      </div>
    </section>
  );
}
