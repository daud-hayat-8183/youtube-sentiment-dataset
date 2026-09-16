"use client";

import { Download, FileSpreadsheet, RotateCcw, Check } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface ResultPanelProps {
  videoInfo: any;
  totalRecords: number;
  topLevelCount: number;
  repliesCount: number;
  csvData: string;
  onReset: () => void;
}

export default function ResultPanel({
  videoInfo,
  totalRecords,
  topLevelCount,
  repliesCount,
  csvData,
  onReset
}: ResultPanelProps) {
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const handleDownloadCsv = () => {
    setDownloadingCsv(true);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `YouTube_Sentiment_Dataset_${videoInfo.videoId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingCsv(false), 1000);
  };

  const handleDownloadExcel = () => {
    setDownloadingExcel(true);
    // Parse CSV to array of objects, then create sheet
    const parsed = Papa.parse(csvData.replace(/^\uFEFF/, ''), { header: true });
    const ws = XLSX.utils.json_to_sheet(parsed.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dataset");
    XLSX.writeFile(wb, `YouTube_Sentiment_Dataset_${videoInfo.videoId}.xlsx`);
    setTimeout(() => setDownloadingExcel(false), 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel-strong rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
          <Check className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Dataset Ready</h2>
      </div>

      <div className="bg-white/50 rounded-2xl p-6 mb-8 border border-white/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Source Video</h3>
            <p className="text-lg font-medium text-gray-900 line-clamp-2">{videoInfo.title}</p>
            <p className="text-gray-600">{videoInfo.channelName}</p>
            
            <div className="flex gap-4 mt-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">{Number(videoInfo.viewCount).toLocaleString()}</span> views
              </div>
              <div>
                <span className="font-semibold">{Number(videoInfo.likeCount).toLocaleString()}</span> likes
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100/50">
              <p className="text-sm text-blue-600 font-semibold mb-1">Top-level</p>
              <p className="text-2xl font-bold text-gray-900">{topLevelCount.toLocaleString()}</p>
            </div>
            <div className="bg-violet-50/60 p-4 rounded-xl border border-violet-100/50">
              <p className="text-sm text-violet-600 font-semibold mb-1">Replies</p>
              <p className="text-2xl font-bold text-gray-900">{repliesCount.toLocaleString()}</p>
            </div>
            <div className="col-span-2 bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-xl border border-blue-200 shadow-inner">
              <p className="text-sm text-indigo-800 font-semibold mb-1">Total ML-Ready Records</p>
              <p className="text-4xl font-extrabold text-indigo-950">{totalRecords.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleDownloadCsv}
          disabled={downloadingCsv}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {downloadingCsv ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
          {downloadingCsv ? "Downloaded" : "Download CSV"}
        </button>
        
        <button
          onClick={handleDownloadExcel}
          disabled={downloadingExcel}
          className="w-full sm:w-auto bg-white/70 hover:bg-white/90 text-gray-800 border border-gray-200 font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-70"
        >
          {downloadingExcel ? <Check className="w-5 h-5 text-green-600" /> : <FileSpreadsheet className="w-5 h-5 text-green-700" />}
          {downloadingExcel ? "Downloaded" : "Download Excel"}
        </button>
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={onReset}
          className="text-gray-500 hover:text-gray-800 font-medium inline-flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Generate another dataset
        </button>
      </div>
    </div>
  );
}
