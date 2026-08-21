import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  X,
  Layers, 
  Zap, 
  RefreshCw, 
  Edit3, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  FileText,
  Combine,
  Split,
  Minimize2,
  Image,
  Lock,
  ScanText,
  KeyRound,
  Info,
  HelpCircle,
  CheckCircle2,
  Cpu,
  Shield,
  Sliders,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ALL_TOOLS, CATEGORIES } from '../data/tools';
import { PDFTool, ToolCategory } from '../types';
import { ToolGridSkeleton } from '../components/SkeletonLoaders';

interface AllToolsPageProps {
  onNavigate: (path: string) => void;
}

interface ToolCardProps {
  tool: PDFTool;
  onNavigate: (path: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onNavigate }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getToolIconBadge = (toolId: string) => {
    switch (toolId) {
      case 'merge':
        return (
          <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-lg flex items-center justify-center">
            <Combine className="w-5 h-5" />
          </div>
        );
      case 'split':
        return (
          <div className="w-10 h-10 bg-orange-50 text-[#F59E0B] rounded-lg flex items-center justify-center">
            <Split className="w-5 h-5" />
          </div>
        );
      case 'compress':
        return (
          <div className="w-10 h-10 bg-green-50 text-[#10B981] rounded-lg flex items-center justify-center">
            <Minimize2 className="w-5 h-5" />
          </div>
        );
      case 'pdf-to-jpg':
        return (
          <div className="w-10 h-10 bg-purple-50 text-[#8B5CF6] rounded-lg flex items-center justify-center">
            <Image className="w-5 h-5" />
          </div>
        );
      case 'protect':
        return (
          <div className="w-10 h-10 bg-red-50 text-[#EF4444] rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
        );
      case 'ocr':
        return (
          <div className="w-10 h-10 bg-indigo-50 text-[#6366F1] rounded-lg flex items-center justify-center">
            <ScanText className="w-5 h-5" />
          </div>
        );
      case 'unlock':
        return (
          <div className="w-10 h-10 bg-pink-50 text-[#EC4899] rounded-lg flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
        );
      case 'watermark':
        return (
          <div className="w-10 h-10 bg-yellow-50 text-[#D97706] rounded-lg flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div
      className="relative group flex flex-col"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main Interactive Tool Card */}
      <div
        onClick={() => onNavigate(`/${tool.slug}`)}
        className="h-full p-5 bg-white border border-[#E2E8F0] rounded-2xl hover:border-[#2563EB] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div className="space-y-3">
          {/* Top Row: Icon + Badges */}
          <div className="flex items-center justify-between">
            {getToolIconBadge(tool.id)}
            <div className="flex items-center gap-1.5">
              {tool.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB]">
                  {tool.badge}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip((prev) => !prev);
                }}
                title="How it works"
                aria-label={`How ${tool.name} works`}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#2563EB] hover:bg-blue-50/60 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Short Description */}
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
              {tool.name}
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed line-clamp-2">
              {tool.shortDesc}
            </p>
          </div>
        </div>

        {/* Card Footer: Category & Open Link */}
        <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#94A3B8] group-hover:text-[#2563EB] font-medium">
          <span className="capitalize text-[11px] text-[#94A3B8] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1] group-hover:bg-[#2563EB] transition-colors" />
            {tool.category}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            Open
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {/* Interactive Tooltip: How It Works Summary */}
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute left-0 right-0 top-0 z-30 p-4 bg-white border border-[#2563EB]/40 rounded-2xl shadow-xl space-y-3 transition-all duration-150 animate-in fade-in zoom-in-95 pointer-events-auto"
          style={{ minHeight: '100%' }}
        >
          {/* Tooltip Header */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-blue-50 text-[#2563EB]">
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">
                  How It Works
                </span>
                <h4 className="text-xs font-bold text-[#0F172A] leading-tight">
                  {tool.name}
                </h4>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] capitalize">
              {tool.category}
            </span>
          </div>

          {/* How It Works Summary Text */}
          <p className="text-[11px] text-[#475569] leading-relaxed">
            {tool.howItWorks || tool.fullDesc}
          </p>

          {/* Quick Steps Workflow */}
          {tool.steps && tool.steps.length > 0 && (
            <div className="space-y-1.5 bg-[#F8FAFC] rounded-xl p-2.5 border border-[#E2E8F0]/70">
              <span className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider block">
                Workflow Sequence
              </span>
              <ul className="space-y-1">
                {tool.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[10px] text-[#475569]">
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-[#CBD5E1] text-[#2563EB] font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical / Privacy Highlight */}
          {tool.highlight && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#2563EB] font-medium pt-0.5">
              <Sparkles className="w-3 h-3 text-[#2563EB] shrink-0" />
              <span className="line-clamp-1">{tool.highlight}</span>
            </div>
          )}

          {/* Quick Action Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onNavigate(`/${tool.slug}`)}
              className="w-full py-1.5 px-3 bg-[#0F172A] hover:bg-black text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <span>Launch {tool.name}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AllToolsPage: React.FC<AllToolsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isInitializing, setIsInitializing] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initializing state simulation on page mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut listener: Press "/" to focus search, "Escape" to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is already typing in an input/textarea
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTools = ALL_TOOLS.filter((tool) => {
    const matchesSearch = 
      !normalizedQuery ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.shortDesc.toLowerCase().includes(normalizedQuery) ||
      tool.fullDesc.toLowerCase().includes(normalizedQuery) ||
      tool.slug.toLowerCase().includes(normalizedQuery) ||
      (tool.badge && tool.badge.toLowerCase().includes(normalizedQuery)) ||
      (tool.highlight && tool.highlight.toLowerCase().includes(normalizedQuery)) ||
      (tool.howItWorks && tool.howItWorks.toLowerCase().includes(normalizedQuery)) ||
      (tool.steps && tool.steps.some(s => s.toLowerCase().includes(normalizedQuery)));

    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularKeywords = ['Merge', 'Compress', 'OCR', 'Protect', 'JPG to PDF', 'Rotate', 'Watermark', 'Unlock'];

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    searchInputRef.current?.focus();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      <Helmet>
        <title>All PDF Tools Directory — DocuCraft PDF Studio</title>
        <meta name="description" content="Explore our complete collection of professional PDF tools including merge, split, compression, OCR, conversion, and digital signature tools." />
      </Helmet>
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          All PDF Tools Directory
        </h1>
        <p className="text-sm text-[#64748B] leading-relaxed">
          Explore our complete collection of 18+ high-performance PDF manipulation, conversion, optimization, and security tools. Hover over any tool to view how it works.
        </p>

        {/* Real-time Search Bar */}
        <div className="relative max-w-lg mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              id="tools-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools in real-time (e.g. merge, compress, ocr, password)..."
              className="w-full pl-10 pr-20 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 shadow-2xs transition-all"
            />
            
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search input"
                  className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                  /
                </span>
              )}
            </div>
          </div>

          {/* Quick-Search Keyword Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2.5">
            <span className="text-[11px] text-[#94A3B8] mr-1">Popular:</span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setSearchQuery(kw)}
                className={`px-2 py-0.5 text-[11px] rounded-lg border transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === kw.toLowerCase()
                    ? 'bg-blue-50 text-[#2563EB] border-[#2563EB]/40 font-bold'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs & Real-Time Match Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0F172A] text-white'
                : 'text-[#64748B] bg-white border border-[#E2E8F0] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            All ({ALL_TOOLS.length})
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0F172A] text-white'
                  : 'text-[#64748B] bg-white border border-[#E2E8F0] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Match Count Badge */}
        <div className="text-xs text-[#64748B] shrink-0 font-medium self-end sm:self-auto flex items-center gap-1.5">
          <span>
            Showing <strong className="text-[#0F172A]">{filteredTools.length}</strong> of {ALL_TOOLS.length} tools
          </span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-bold">
              for "{searchQuery}"
            </span>
          )}
        </div>
      </div>

      {/* Tools Grid or Initializing Skeleton */}
      {isInitializing ? (
        <ToolGridSkeleton count={8} />
      ) : filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0] p-8 space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#0F172A]">No matching PDF tools found</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              We couldn't find any tools matching <span className="font-semibold text-[#0F172A]">"{searchQuery}"</span> in the selected category.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

    </div>
  );
};

