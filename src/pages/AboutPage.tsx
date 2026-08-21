import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Layers, 
  FileCheck, 
  Terminal, 
  Database, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12">
      <Helmet>
        <title>About & Security Standards — DocuCraft PDF Studio</title>
        <meta name="description" content="Learn about DocuCraft's client-side privacy architecture, zero-storage policy, and browser-native PDF processing engine." />
      </Helmet>
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
          <span>Architecture & Security Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          DocuCraft PDF Studio
        </h1>
        <p className="text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed">
          Engineered as a modern, production-grade PDF utility platform with complete fidelity, real binary manipulations, and uncompromising privacy.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">Zero Permanent Storage</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            All document streams are processed directly in your transient execution session. Files are never persisted on disk longer than necessary to complete your download.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">100% Genuine File Operations</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Every operation computes real binary transformations, actual page counts, accurate size reduction percentages, and downloadable standard compliant PDF/Image files.
          </p>
        </div>
      </div>

      {/* Technical Architecture Stack */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 md:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F1F5F9]">
          <Cpu className="w-5 h-5 text-[#2563EB]" />
          <h2 className="text-base font-bold text-[#0F172A]">Technical Architecture Overview</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-[#0F172A] uppercase tracking-wider">PDF Processing Pipeline</h4>
            <ul className="space-y-1.5 text-[#64748B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span><strong>pdf-lib</strong>: Vector streams, page extraction, merging, numbering</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span><strong>pdfjs-dist</strong>: High-fidelity rasterization & visual thumbnails</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span><strong>tesseract.js</strong>: OCR engine for text recognition & indexing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span><strong>JSZip</strong>: Batch packaging for multi-page image exports</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#0F172A] uppercase tracking-wider">Dual-Engine REST API</h4>
            <ul className="space-y-1.5 text-[#64748B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span><strong>Express / FastAPI Spec</strong>: REST endpoints with multer & stream validation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span><strong>Zero-latency client fallback</strong>: Instant in-browser execution</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span><strong>MIME & Header validation</strong>: Rejection of malformed file headers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Statement */}
      <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2 text-[#0F172A]">
          <Lock className="w-4 h-4 text-[#10B981]" />
          <span>Security & Authorization Policy</span>
        </h3>
        <p className="text-xs text-[#64748B] leading-relaxed">
          DocuCraft enforces strict security controls. Password unlocking only processes documents when the correct authorization key is provided by the legitimate document owner. We do not support brute force cracking or circumvention of authorized cryptographic safeguards.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/tools')}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3 rounded-full text-sm font-semibold shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>Get Started With PDF Tools</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
