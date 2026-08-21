import React from 'react';
import { Sliders, Monitor, Zap, Image as ImageIcon } from 'lucide-react';

interface ConversionOptionsProps {
  dpi: 72 | 150 | 300;
  onDpiChange: (dpi: 72 | 150 | 300) => void;
  quality: number; // 0.75, 0.9, 1.0
  onQualityChange: (quality: number) => void;
  format: 'jpg' | 'png';
  onFormatChange: (format: 'jpg' | 'png') => void;
}

export const ConversionOptions: React.FC<ConversionOptionsProps> = ({
  dpi,
  onDpiChange,
  quality,
  onQualityChange,
  format,
  onFormatChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
        <Sliders className="w-4 h-4 text-[#2563EB]" />
        <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
          PDF to Image Conversion Options
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Format Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#2563EB]" />
            Output Image Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'jpg', label: 'JPG (Compressed)', desc: 'Smaller file size' },
              { id: 'png', label: 'PNG (Lossless)', desc: 'Sharp text & transparency' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onFormatChange(item.id as 'jpg' | 'png')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  format === item.id
                    ? 'border-[#2563EB] bg-blue-50/60 shadow-xs ring-1 ring-[#2563EB]/30'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="text-xs font-bold text-[#0F172A] uppercase">{item.id}</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* DPI Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-[#2563EB]" />
            Resolution (DPI)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 72, label: '72 DPI', desc: 'Web / Fast' },
              { val: 150, label: '150 DPI', desc: 'Standard' },
              { val: 300, label: '300 DPI', desc: 'High Print' },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => onDpiChange(item.val as any)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  dpi === item.val
                    ? 'border-[#2563EB] bg-blue-50/60 shadow-xs ring-1 ring-[#2563EB]/30 font-bold text-[#2563EB]'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A]'
                }`}
              >
                <div className="text-xs font-bold">{item.label}</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
            Image Quality
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { q: 0.75, label: '75%' },
              { q: 0.90, label: '90%' },
              { q: 1.00, label: '100%' },
            ].map((item) => (
              <button
                key={item.q}
                type="button"
                onClick={() => onQualityChange(item.q)}
                disabled={format === 'png' && item.q < 1.0}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  format === 'png' && item.q < 1.0
                    ? 'opacity-40 cursor-not-allowed border-[#E2E8F0] bg-gray-50 text-gray-400'
                    : quality === item.q
                      ? 'border-[#2563EB] bg-blue-50/60 shadow-xs ring-1 ring-[#2563EB]/30 font-bold text-[#2563EB]'
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A]'
                }`}
              >
                <div className="text-xs font-bold">{item.label}</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">
                  {format === 'png' ? 'Lossless' : item.q === 1.0 ? 'Maximum' : 'Balanced'}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="text-[11px] text-[#64748B] bg-[#F8FAFC] p-3 rounded-xl border border-[#F1F5F9] flex items-center justify-between">
        <span>Selected profile: <strong>{dpi} DPI</strong> at <strong>{format.toUpperCase()}</strong> ({Math.round(quality * 100)}% quality)</span>
        <span className="text-[#2563EB] font-semibold">Client WASM Accelerated</span>
      </div>
    </div>
  );
};
