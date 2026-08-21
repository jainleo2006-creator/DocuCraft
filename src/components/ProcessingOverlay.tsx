import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { ProcessingState } from '../types';

interface ProcessingOverlayProps {
  state: ProcessingState;
  customMessage?: string;
  errorMessage?: string;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  state,
  customMessage,
  errorMessage,
}) => {
  if (state === 'IDLE') return null;

  const getStatusContent = () => {
    switch (state) {
      case 'UPLOADING':
        return {
          title: 'Reading Document Stream',
          desc: customMessage || 'Parsing binary headers and allocating memory buffer...',
          icon: <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />,
        };
      case 'VALIDATING':
        return {
          title: 'Validating PDF Integrity',
          desc: customMessage || 'Checking cross-reference tables and vector fonts...',
          icon: <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />,
        };
      case 'PROCESSING':
        return {
          title: 'Processing Document',
          desc: customMessage || 'Applying transformations and rebuilding object streams...',
          icon: <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />,
        };
      case 'SUCCESS':
        return {
          title: 'Task Completed Successfully',
          desc: 'Your output file is ready for download.',
          icon: <CheckCircle2 className="w-8 h-8 text-[#10B981]" />,
        };
      case 'ERROR':
        return {
          title: 'Processing Encountered an Issue',
          desc: errorMessage || 'We could not process this document. The PDF may be corrupted or encrypted.',
          icon: <AlertCircle className="w-8 h-8 text-[#EF4444]" />,
        };
      default:
        return {
          title: 'Working...',
          desc: 'Please wait a moment...',
          icon: <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />,
        };
    }
  };

  const info = getStatusContent();

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center space-y-4 shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto shadow-xs">
        {info.icon}
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-[#0F172A]">{info.title}</h3>
        <p className="text-xs text-[#64748B] max-w-md mx-auto">{info.desc}</p>
      </div>

      {state !== 'SUCCESS' && state !== 'ERROR' && (
        <div className="w-48 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden mx-auto mt-4">
          <div className="h-full bg-[#2563EB] rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};
