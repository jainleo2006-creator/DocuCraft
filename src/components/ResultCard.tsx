import React, { useState } from 'react';
import { 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  FileText, 
  Copy, 
  Check, 
  ArrowRight,
  HardDrive,
  FileSpreadsheet,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProcessingResult, PDFTool } from '../types';
import { ALL_TOOLS } from '../data/tools';

interface ResultCardProps {
  result: ProcessingResult;
  onReset: () => void;
  onNavigate: (path: string) => void;
  currentToolId: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onReset,
  onNavigate,
  currentToolId,
}) => {
  const [copied, setCopied] = useState(false);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(result.fileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    if (result.extractedText) {
      navigator.clipboard.writeText(result.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Find 3 recommended related tools
  const relatedTools = ALL_TOOLS.filter(
    (t) => t.id !== currentToolId && t.ready && t.category !== 'intelligence'
  ).slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 md:p-8 space-y-6 shadow-2xs">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10B981] border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Your Document is Ready</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Processed accurately with verified binary headers
            </p>
          </div>
        </div>

        {/* Primary Download Button */}
        <button
          type="button"
          id="download-result-btn"
          onClick={handleDownload}
          className="w-full sm:w-auto px-6 py-3 bg-[#0F172A] hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download {result.downloadName.endsWith('.zip') ? 'ZIP Archive' : 'File'}</span>
        </button>
      </div>

      {/* Real Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
        <div>
          <span className="text-[#94A3B8] block text-[11px]">Output File</span>
          <span className="font-semibold text-[#0F172A] truncate block mt-0.5" title={result.downloadName}>
            {result.downloadName}
          </span>
        </div>

        <div>
          <span className="text-[#94A3B8] block text-[11px]">Result Size</span>
          <span className="font-semibold text-[#0F172A] block mt-0.5">
            {formatBytes(result.resultSize)}
          </span>
        </div>

        {result.originalSize > 0 && (
          <div>
            <span className="text-[#94A3B8] block text-[11px]">Original Size</span>
            <span className="font-medium text-[#64748B] block mt-0.5">
              {formatBytes(result.originalSize)}
            </span>
          </div>
        )}

        {typeof result.reductionPercentage === 'number' && (
          <div>
            <span className="text-[#94A3B8] block text-[11px]">Space Saved</span>
            <span className="font-bold text-[#10B981] block mt-0.5">
              {result.reductionPercentage}% smaller
            </span>
          </div>
        )}

        {result.originalFileCount && (
          <div>
            <span className="text-[#94A3B8] block text-[11px]">Input Files</span>
            <span className="font-semibold text-[#0F172A] block mt-0.5">
              {result.originalFileCount} files combined
            </span>
          </div>
        )}
      </div>

      {/* OCR Extracted Text Preview Box (If OCR Tool) */}
      {result.extractedText && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Extracted OCR Text Content
            </span>
            <button
              type="button"
              onClick={handleCopyText}
              className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>
          </div>
          <div className="p-4 bg-[#0F172A] text-slate-100 rounded-xl text-xs font-mono max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
            {result.extractedText}
          </div>
        </div>
      )}

      {/* Metadata Inspection Table */}
      {result.metadata && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Document Metadata & Properties
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
            {Object.entries(result.metadata).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-[#94A3B8] text-[11px] font-medium">{key}</span>
                <span className="font-semibold text-[#0F172A] mt-0.5 truncate" title={value}>
                  {value || 'None'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Controls & Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          id="start-again-btn"
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Process Another File</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/tools')}
          className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
        >
          <span>Explore More PDF Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Related Tools Section */}
      <div className="pt-6 border-t border-[#F1F5F9] space-y-3">
        <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
          Suggested Next Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {relatedTools.map((t) => (
            <div
              key={t.id}
              onClick={() => onNavigate(`/${t.slug}`)}
              className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F172A] group-hover:text-[#2563EB]">
                  {t.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">
                {t.shortDesc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
