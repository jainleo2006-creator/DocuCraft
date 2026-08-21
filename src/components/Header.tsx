import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Zap, 
  RefreshCw, 
  Edit3, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles,
  Menu,
  X,
  Info,
  Activity
} from 'lucide-react';
import { ALL_TOOLS, CATEGORIES } from '../data/tools';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'organize': return <Layers className="w-4 h-4 text-blue-600" />;
      case 'optimize': return <Zap className="w-4 h-4 text-emerald-600" />;
      case 'convert': return <RefreshCw className="w-4 h-4 text-amber-600" />;
      case 'edit': return <Edit3 className="w-4 h-4 text-purple-600" />;
      case 'security': return <ShieldCheck className="w-4 h-4 text-rose-600" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => onNavigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white shadow-2xs group-hover:bg-[#1D4ED8] transition-colors">
              <div className="w-4 h-5 border-2 border-white rounded-xs relative">
                <div className="absolute top-1 left-0 w-full h-[1px] bg-white"></div>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                Docu<span className="text-[#2563EB]">Craft</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#64748B]">
            <button
              id="nav-home"
              onClick={() => onNavigate('/')}
              className={`transition-colors ${
                currentPath === '/' 
                  ? 'text-[#2563EB] font-semibold' 
                  : 'hover:text-[#0F172A]'
              }`}
            >
              Home
            </button>

            {/* Tools Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button
                id="nav-tools-dropdown-btn"
                onClick={() => onNavigate('/tools')}
                className={`flex items-center gap-1 transition-colors ${
                  currentPath.startsWith('/tools') || (currentPath !== '/' && currentPath !== '/about')
                    ? 'text-[#2563EB] font-semibold' 
                    : 'hover:text-[#0F172A]'
                }`}
              >
                <span>PDF Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {toolsDropdownOpen && (
                <div 
                  id="header-tools-mega-menu"
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-5 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                >
                  {CATEGORIES.slice(0, 4).map((cat) => {
                    const catTools = ALL_TOOLS.filter((t) => t.category === cat.id && t.ready).slice(0, 3);
                    return (
                      <div key={cat.id} className="space-y-1.5">
                        <div className="flex items-center gap-2 pb-1 border-b border-[#F1F5F9]">
                          {getCategoryIcon(cat.id)}
                          <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{cat.name}</span>
                        </div>
                        <div className="space-y-1">
                          {catTools.map((tool) => (
                            <button
                              key={tool.id}
                              id={`dropdown-tool-${tool.slug}`}
                              onClick={() => {
                                setToolsDropdownOpen(false);
                                onNavigate(`/${tool.slug}`);
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#2563EB] flex items-center justify-between transition-colors"
                            >
                              <span>{tool.name}</span>
                              {tool.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB] font-semibold">
                                  {tool.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <div className="col-span-2 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs text-[#94A3B8]">18+ verified PDF utility tools</span>
                    <button
                      id="view-all-tools-link"
                      onClick={() => {
                        setToolsDropdownOpen(false);
                        onNavigate('/tools');
                      }}
                      className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
                    >
                      View All Tools &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-all-tools"
              onClick={() => onNavigate('/tools')}
              className={`transition-colors ${
                currentPath === '/tools' 
                  ? 'text-[#2563EB] font-semibold' 
                  : 'hover:text-[#0F172A]'
              }`}
            >
              All Tools
            </button>

            <button
              id="nav-dashboard"
              onClick={() => onNavigate('/dashboard')}
              className={`transition-colors flex items-center gap-1.5 ${
                currentPath === '/dashboard' 
                  ? 'text-[#2563EB] font-semibold' 
                  : 'hover:text-[#0F172A]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Dashboard</span>
            </button>

            <button
              id="nav-about"
              onClick={() => onNavigate('/about')}
              className={`transition-colors ${
                currentPath === '/about' 
                  ? 'text-[#2563EB] font-semibold' 
                  : 'hover:text-[#0F172A]'
              }`}
            >
              About & Privacy
            </button>
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Encrypted & Client-Safe</span>
            </div>

            <button
              id="quick-explore-cta"
              onClick={() => onNavigate('/tools')}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            Home
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/tools'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            All PDF Tools
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/dashboard'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#2563EB] hover:bg-[#F8FAFC] flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-[#2563EB]" />
            <span>Processing Dashboard</span>
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/merge-pdf'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFC] flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-[#2563EB]" />
            <span>Merge PDF</span>
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/split-pdf'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFC] flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-[#F59E0B]" />
            <span>Split PDF</span>
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/compress-pdf'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFC] flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-[#10B981]" />
            <span>Compress PDF</span>
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/about'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            About & Security
          </button>
        </div>
      )}
    </header>
  );
};
