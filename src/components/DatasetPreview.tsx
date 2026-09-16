import { Terminal, Database, Code2 } from "lucide-react";

export default function DatasetPreview() {
  const sampleData = [
    { text: "This is a fantastic analysis!", type: "TOP_LEVEL", likes: 142, date: "2023-10-12T14:22:11Z" },
    { text: "I totally agree with this point.", type: "REPLY", likes: 15, date: "2023-10-12T15:01:44Z" },
    { text: "Can you make a part 2?", type: "TOP_LEVEL", likes: 89, date: "2023-10-13T09:12:00Z" },
    { text: "Yes please, the depth here is incredible.", type: "REPLY", likes: 4, date: "2023-10-13T10:05:12Z" },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-20 relative z-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Machine Learning Ready</h2>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          Say goodbye to nested JSON loops and broken CSV rows. CommentLens delivers a perfectly flat, escaped, and typed dataset structure immediately ready for NLP.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Terminal/JSON Preview */}
        <div className="flex-1 rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-white/40 backdrop-blur-2xl flex flex-col group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-blue-50/10 pointer-events-none"></div>
          <div className="bg-white/50 px-4 py-3 border-b border-white/60 flex items-center gap-2 relative z-10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="ml-4 flex items-center text-xs font-mono font-bold text-gray-700 gap-2">
              <Terminal className="w-3.5 h-3.5" /> schema.json
            </div>
          </div>
          <div className="p-6 font-mono text-sm overflow-x-auto text-blue-900 flex-1 flex flex-col justify-center relative z-10 font-medium">
            <pre className="leading-relaxed">
{`{
  "features": {
    "video_id": "string",
    "comment_id": "string (unique)",
    "parent_comment_id": "string | null",
    "comment_type": "enum[TOP_LEVEL, REPLY]",
    "cleaned_comment": "string (escaped)",
    "like_count": "integer",
    "published_at": "datetime (ISO 8601)"
  },
  "target": "sentiment_analysis"
}`}
            </pre>
          </div>
        </div>

        {/* Visual Data Grid Preview */}
        <div className="flex-[2] rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-white/40 backdrop-blur-2xl flex flex-col">
          <div className="bg-white/50 px-6 py-4 border-b border-white/60 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Database className="w-5 h-5 text-blue-600" /> DataFrame Preview
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-gray-700 border border-white shadow-sm">
              <Code2 className="w-3.5 h-3.5" /> import pandas as pd
            </div>
          </div>
          <div className="overflow-x-auto p-4 flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-300 text-xs uppercase tracking-wider text-gray-600 font-extrabold">
                  <th className="px-4 py-3">cleaned_comment</th>
                  <th className="px-4 py-3">type</th>
                  <th className="px-4 py-3 text-right">likes</th>
                  <th className="px-4 py-3">published_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {sampleData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/60 transition-colors text-sm text-gray-900 font-medium group/row">
                    <td className="px-4 py-4 max-w-[200px] truncate text-gray-900 group-hover/row:text-blue-900 transition-colors">{row.text}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide shadow-sm border ${
                        row.type === 'TOP_LEVEL' ? 'bg-blue-100 text-blue-900 border-blue-200' : 'bg-purple-100 text-purple-900 border-purple-200'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-gray-700 font-bold">{row.likes}</td>
                    <td className="px-4 py-4 font-mono text-gray-600 text-xs font-semibold">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
