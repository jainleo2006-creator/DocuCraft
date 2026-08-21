import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, 
  Layers, 
  Zap, 
  RefreshCw, 
  Edit3, 
  ShieldCheck, 
  Combine, 
  Split, 
  Minimize2, 
  Image, 
  FilePlus2, 
  ScanText, 
  Lock, 
  RotateCw,
  Sparkles,
  CheckCircle2,
  Cpu,
  Shield,
  UploadCloud,
  ChevronRight,
  FileText,
  KeyRound
} from 'lucide-react';
import { ALL_TOOLS, CATEGORIES } from '../data/tools';
import { PDFTool } from '../types';
import { ToolGridSkeleton } from '../components/SkeletonLoaders';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 240);
    return () => clearTimeout(timer);
  }, []);

  const getToolIconBadge = (toolId: string, name: string) => {
    switch (toolId) {
      case 'merge':
        return (
          <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-lg flex items-center justify-center mb-4">
            <Combine className="w-5 h-5" />
          </div>
        );
      case 'split':
        return (
          <div className="w-10 h-10 bg-orange-50 text-[#F59E0B] rounded-lg flex items-center justify-center mb-4">
            <Split className="w-5 h-5" />
          </div>
        );
      case 'compress':
        return (
          <div className="w-10 h-10 bg-green-50 text-[#10B981] rounded-lg flex items-center justify-center mb-4">
            <Minimize2 className="w-5 h-5" />
          </div>
        );
      case 'pdf-to-jpg':
        return (
          <div className="w-10 h-10 bg-purple-50 text-[#8B5CF6] rounded-lg flex items-center justify-center mb-4">
            <Image className="w-5 h-5" />
          </div>
        );
      case 'protect':
        return (
          <div className="w-10 h-10 bg-red-50 text-[#EF4444] rounded-lg flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
        );
      case 'ocr':
        return (
          <div className="w-10 h-10 bg-indigo-50 text-[#6366F1] rounded-lg flex items-center justify-center mb-4">
            <ScanText className="w-5 h-5" />
          </div>
        );
      case 'unlock':
        return (
          <div className="w-10 h-10 bg-pink-50 text-[#EC4899] rounded-lg flex items-center justify-center mb-4">
            <KeyRound className="w-5 h-5" />
          </div>
        );
      case 'watermark':
        return (
          <div className="w-10 h-10 bg-yellow-50 text-[#D97706] rounded-lg flex items-center justify-center mb-4">
            <Edit3 className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-5 h-5" />
          </div>
        );
    }
  };

  const popularTools = ALL_TOOLS.filter((t) => {
    if (selectedFilter === 'all') return t.popular;
    return t.category === selectedFilter;
  }).slice(0, 8);

  const handleHeroDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    onNavigate('/merge-pdf');
  };

  return (
    <div className="space-y-12 py-8 md:py-12">
      <Helmet>
        <title>DocuCraft PDF Studio — Free Online PDF Tools & Editors</title>
        <meta name="description" content="Merge, split, compress, sign, convert, and edit PDFs instantly in your browser with 100% security and zero server uploads." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-3 tracking-tight max-w-3xl mx-auto">
          Everything You Need to Work With PDFs
        </h1>

        <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto mb-8 leading-relaxed">
          Merge, split, compress, convert, and secure your documents in one professional workspace.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-select-cta"
            onClick={() => onNavigate('/merge-pdf')}
            className="w-full sm:w-auto bg-[#0F172A] hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-black/5 transition-all cursor-pointer"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Select a PDF</span>
          </button>

          <button
            id="hero-explore-cta"
            onClick={() => onNavigate('/tools')}
            className="w-full sm:w-auto bg-white border border-[#E2E8F0] text-[#0F172A] px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all cursor-pointer"
          >
            <span>Explore PDF Tools</span>
          </button>
        </div>

        {/* Hero Quick Dropzone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleHeroDrop}
          onClick={() => onNavigate('/organize-pdf')}
          className={`max-w-2xl mx-auto mt-8 border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 ${
            dragActive 
              ? 'border-[#2563EB] bg-blue-50/50 scale-[1.01]' 
              : 'border-[#E2E8F0] hover:border-[#94A3B8] bg-white hover:bg-[#F8FAFC]'
          }`}
        >
          <div className="flex items-center justify-center gap-3 text-[#64748B]">
            <UploadCloud className="w-5 h-5 text-[#2563EB]" />
            <span className="text-xs sm:text-sm font-medium">
              Drop any PDF file here to start organizing & editing instantly
            </span>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
            Popular Tools
          </h2>
          
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#F1F5F9] text-[#475569]'
                  : 'text-[#94A3B8] hover:text-[#0F172A]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('organize')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                selectedFilter === 'organize'
                  ? 'bg-[#F1F5F9] text-[#475569]'
                  : 'text-[#94A3B8] hover:text-[#0F172A]'
              }`}
            >
              Organize
            </button>
            <button
              onClick={() => setSelectedFilter('convert')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                selectedFilter === 'convert'
                  ? 'bg-[#F1F5F9] text-[#475569]'
                  : 'text-[#94A3B8] hover:text-[#0F172A]'
              }`}
            >
              Convert
            </button>
            <button
              onClick={() => setSelectedFilter('security')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                selectedFilter === 'security'
                  ? 'bg-[#F1F5F9] text-[#475569]'
                  : 'text-[#94A3B8] hover:text-[#0F172A]'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Tools 4-Column Clean Grid or Skeleton */}
        {isInitializing ? (
          <ToolGridSkeleton count={8} columns="grid-cols-1 sm:grid-cols-2 md:grid-cols-4" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <div
                key={tool.id}
                id={`popular-tool-card-${tool.slug}`}
                onClick={() => onNavigate(`/${tool.slug}`)}
                className="group p-5 bg-white border border-[#E2E8F0] rounded-2xl hover:border-[#2563EB] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {getToolIconBadge(tool.id, tool.name)}

                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {tool.name}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-transform group-hover:translate-x-0.5" />
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {tool.shortDesc}
                  </p>
                </div>

                {tool.badge && (
                  <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB]">
                      {tool.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                      Open &rarr;
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Structured Document Suites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Structured Document Suites</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Every utility engineered with exact binary precision</p>
          </div>
          <button
            onClick={() => onNavigate('/tools')}
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
          >
            <span>View all 18 tools</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const catTools = ALL_TOOLS.filter((t) => t.category === cat.id);
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4 shadow-2xs hover:border-[#CBD5E1] transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{cat.name}</h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{cat.desc}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {catTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => onNavigate(`/${tool.slug}`)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8FAFC] flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-[#0F172A] group-hover:text-[#2563EB] truncate">
                          {tool.name}
                        </p>
                        <p className="text-[11px] text-[#64748B] truncate">
                          {tool.shortDesc}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        {tool.badge && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">
                            {tool.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Architecture Principles */}
      <section className="bg-white border border-[#E2E8F0] rounded-3xl max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-6 shadow-2xs">
        <div className="max-w-2xl space-y-1.5">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Engineered For Reliability</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            Zero File Storage, High-Speed Document Processing
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            DocuCraft operates with a dual engine architecture. All document streams are executed in-memory or securely streamed to our verified API layer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#F1F5F9] text-xs">
          <div className="space-y-1.5">
            <div className="font-bold text-[#0F172A] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Real Verified Operations</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              No simulated progress bars or fake metric counters. All compression ratios and file sizes are mathematically computed.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-[#0F172A] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2563EB]" />
              <span>Sanitized Output</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Metadata wiping clears hidden author credentials and creation history before distribution.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-[#0F172A] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#8B5CF6]" />
              <span>Tesseract Neural OCR</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              State-of-the-art optical recognition extracts raw text and transforms flat scans into searchable layers.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
