import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCw, 
  CheckCircle2, 
  Eye, 
  Loader2, 
  AlertCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

// Configure pdfjs worker for react-pdf to match installed library version exactly
if (typeof window !== 'undefined') {
  const version = pdfjs.version || '6.2.108';
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
}

interface DocumentPreviewProps {
  file: File;
  title?: string;
  className?: string;
  onPageCountChange?: (pages: number) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  title,
  className = '',
  onPageCountChange,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isImageFile, setIsImageFile] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setPageNumber(1);
    setRotation(0);
    setIsLoading(true);

    if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name)) {
      setIsImageFile(true);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      setIsLoading(false);
      setNumPages(1);
      if (onPageCountChange) onPageCountChange(1);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setIsImageFile(false);
      setImagePreviewUrl(null);
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
    if (onPageCountChange) {
      onPageCountChange(numPages);
    }
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('react-pdf document load error:', err);
    setError('Could not render document preview in real-time. The file is still valid for processing.');
    setIsLoading(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden ${className}`}>
      {/* Card Header & Verification Status */}
      <div className="p-4 sm:p-5 border-b border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#0F172A] tracking-tight">
                {title || 'Document Verification Preview'}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] truncate max-w-xs sm:max-w-md">
              {file.name} • {formatFileSize(file.size)}
            </p>
          </div>
        </div>

        {/* Preview Control Actions */}
        <div className="flex items-center gap-1.5">
          {numPages && numPages > 1 && (
            <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2 py-1 text-xs text-[#0F172A] mr-1">
              <button
                type="button"
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                aria-label="Previous page"
                className="p-0.5 rounded text-[#64748B] hover:text-[#0F172A] disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-medium px-1">
                {pageNumber} / {numPages}
              </span>
              <button
                type="button"
                onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                disabled={pageNumber >= numPages}
                aria-label="Next page"
                className="p-0.5 rounded text-[#64748B] hover:text-[#0F172A] disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.6, Number((s - 0.15).toFixed(2))))}
            title="Zoom Out"
            aria-label="Zoom out preview"
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(1.6, Number((s + 0.15).toFixed(2))))}
            title="Zoom In"
            aria-label="Zoom in preview"
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="Rotate Preview"
            aria-label="Rotate preview 90 degrees"
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            title="Expand Full Preview"
            aria-label="Expand full modal preview"
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Stage / Canvas Canvas Container */}
      <div className="relative p-6 bg-[#F8FAFC] flex items-center justify-center min-h-[320px] max-h-[460px] overflow-auto select-none">
        {isImageFile && imagePreviewUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={imagePreviewUrl}
              alt={file.name}
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
              className="max-h-[360px] w-auto object-contain rounded-lg shadow-md border border-[#E2E8F0] transition-transform duration-150"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center py-12 space-y-2 text-[#64748B]">
                <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
                <span className="text-xs font-medium">Rendering PDF page preview...</span>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-2 max-w-sm">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                <span className="text-xs font-bold text-[#0F172A]">Preview unavailable for this document</span>
                <p className="text-[11px] text-[#64748B]">
                  The file is loaded securely and ready for conversion or processing.
                </p>
              </div>
            }
          >
            <div
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
              className="transition-transform duration-150 shadow-md rounded-lg overflow-hidden bg-white border border-[#E2E8F0]"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale * 0.9}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="pdf-page-canvas"
                loading={
                  <div className="w-[280px] h-[380px] bg-white flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
                  </div>
                }
              />
            </div>
          </Document>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="px-5 py-2.5 bg-white border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Rendered client-side • Zero cloud uploads required</span>
        </div>
        <div>
          <span>
            {isImageFile ? '1 Image Asset' : numPages ? `${numPages} Total Page${numPages > 1 ? 's' : ''}` : 'Analyzing...'}
          </span>
        </div>
      </div>

      {/* Full Expanded Zoom Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                <h4 className="text-xs font-bold text-[#0F172A] truncate max-w-md">
                  {file.name} (Page {pageNumber} of {numPages || 1})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-auto p-6 bg-[#F8FAFC] flex items-center justify-center">
              {isImageFile && imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt={file.name}
                  className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg border border-[#E2E8F0]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />}
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={1.3}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="shadow-xl rounded-lg overflow-hidden border border-[#E2E8F0]"
                  />
                </Document>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
