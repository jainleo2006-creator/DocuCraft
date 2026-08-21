import React, { useState } from 'react';
import { FileText, Shield, Lock, Cpu, MessageSquarePlus } from 'lucide-react';
import { CATEGORIES, ALL_TOOLS } from '../data/tools';
import { FeedbackForm } from './FeedbackForm';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <footer className="bg-[#F8FAFC] text-[#64748B] border-t border-[#E2E8F0]">
      {/* Trust & Privacy Banner */}
      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A]">Client-Safe Processing</h4>
                <p className="text-[#64748B] text-xs mt-1 leading-relaxed">
                  Your files are processed directly in your memory session and never stored permanently.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-[#10B981] border border-emerald-100">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A]">End-to-End Privacy</h4>
                <p className="text-[#64748B] text-xs mt-1 leading-relaxed">
                  Zero telemetry on document contents. Metadata wiping and cryptographic password protection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-[#8B5CF6] border border-purple-100">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A]">High-Speed Engine</h4>
                <p className="text-[#64748B] text-xs mt-1 leading-relaxed">
                  Multi-threaded WebAssembly and PDF stream compression for instant document generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 select-none">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white">
                <div className="w-4 h-5 border-2 border-white rounded-xs relative">
                  <div className="absolute top-1 left-0 w-full h-[1px] bg-white"></div>
                </div>
              </div>
              <span className="font-bold text-lg text-[#0F172A] tracking-tight">Docu<span className="text-[#2563EB]">Craft</span></span>
            </div>
            <p className="text-[#64748B] text-xs leading-relaxed max-w-sm">
              The professional all-in-one PDF workspace. Merge, split, compress, convert, organize, watermark, and protect documents with zero setup.
            </p>
            <div className="text-[11px] text-[#94A3B8]">
              Built for speed, privacy, and precision document engineering.
            </div>
          </div>

          {/* Categories Columns */}
          {CATEGORIES.slice(0, 3).map((cat) => {
            const catTools = ALL_TOOLS.filter((t) => t.category === cat.id && t.ready);
            return (
              <div key={cat.id} className="space-y-3">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{cat.name}</h4>
                <ul className="space-y-2 text-xs">
                  {catTools.map((tool) => (
                    <li key={tool.id}>
                      <button
                        onClick={() => onNavigate(`/${tool.slug}`)}
                        className="text-[#64748B] hover:text-[#2563EB] transition-colors text-left"
                      >
                        {tool.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-[11px] text-[#94A3B8] font-medium">
              &copy; {new Date().getFullYear()} DocuCraft Platform. Secure, Fast, Reliable.
            </p>
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-blue-50 text-[#2563EB] border border-[#E2E8F0] hover:border-blue-200 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Provide Feedback</span>
            </button>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>API Status: Healthy</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
              <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </div>
      </div>
      <FeedbackForm isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </footer>
  );
};
