import React, { useEffect, useState } from 'react';
import { RotateCw, Trash2, CheckCircle2, Circle, Eye, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { renderThumbnails } from '../services/pdfEngine';

export interface PageCardData {
  pageNumber: number; // original 1-based page number
  rotation: number;   // 0, 90, 180, 270
  deleted: boolean;
  selected: boolean;
  thumbnailUrl?: string;
}

interface PageGridProps {
  file: File;
  mode?: 'organize' | 'select' | 'delete' | 'rotate';
  onPagesChange?: (pages: PageCardData[]) => void;
  selectedPages?: number[];
  onSelectToggle?: (pageNum: number) => void;
}

export const PageGrid: React.FC<PageGridProps> = ({
  file,
  mode = 'organize',
  onPagesChange,
  selectedPages = [],
  onSelectToggle,
}) => {
  const [pages, setPages] = useState<PageCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPage, setPreviewPage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    renderThumbnails(file)
      .then(({ totalPages, thumbnails }) => {
        if (isCancelled) return;
        const initialPages: PageCardData[] = Array.from({ length: totalPages }, (_, i) => ({
          pageNumber: i + 1,
          rotation: 0,
          deleted: false,
          selected: selectedPages.includes(i + 1),
          thumbnailUrl: thumbnails[i],
        }));
        setPages(initialPages);
        setLoading(false);
        if (onPagesChange) onPagesChange(initialPages);
      })
      .catch((err) => {
        console.error('Failed to generate thumbnails', err);
        setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [file]);

  const handleRotatePage = (index: number) => {
    const updated = [...pages];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    setPages(updated);
    if (onPagesChange) onPagesChange(updated);
  };

  const handleToggleDelete = (index: number) => {
    const updated = [...pages];
    updated[index].deleted = !updated[index].deleted;
    setPages(updated);
    if (onPagesChange) onPagesChange(updated);
  };

  const handleMovePage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === pages.length - 1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const updated = [...pages];
    const item = updated.splice(index, 1)[0];
    updated.splice(targetIndex, 0, item);
    setPages(updated);
    if (onPagesChange) onPagesChange(updated);
  };

  const handleSelectPage = (pageNum: number) => {
    if (onSelectToggle) {
      onSelectToggle(pageNum);
    } else {
      const updated = pages.map((p) =>
        p.pageNumber === pageNum ? { ...p, selected: !p.selected } : p
      );
      setPages(updated);
      if (onPagesChange) onPagesChange(updated);
    }
  };

  const handleRotateAll = (deg: number) => {
    const updated = pages.map((p) => ({
      ...p,
      rotation: (p.rotation + deg) % 360,
    }));
    setPages(updated);
    if (onPagesChange) onPagesChange(updated);
  };

  const handleSelectAll = (select: boolean) => {
    const updated = pages.map((p) => ({
      ...p,
      selected: select,
      deleted: false,
    }));
    setPages(updated);
    if (onPagesChange) onPagesChange(updated);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center space-y-3 shadow-2xs">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto" />
        <p className="text-sm font-bold text-[#0F172A]">Generating page previews...</p>
        <p className="text-xs text-[#64748B]">Reading vector canvas streams and geometries</p>
      </div>
    );
  }

  const activePages = pages.filter((p) => !p.deleted);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-4 shadow-2xs">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Page Layout ({activePages.length} active of {pages.length})
          </span>
          <p className="text-xs text-[#64748B] mt-0.5">
            Click cards to {mode === 'select' || mode === 'delete' ? 'toggle selection' : 'inspect, reorder or rotate'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'organize' && (
            <button
              type="button"
              onClick={() => handleRotateAll(90)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#2563EB]" />
              Rotate All +90°
            </button>
          )}

          {(mode === 'select' || mode === 'delete') && (
            <>
              <button
                type="button"
                onClick={() => handleSelectAll(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs font-bold transition-colors cursor-pointer"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => handleSelectAll(false)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-xs font-bold transition-colors cursor-pointer"
              >
                Deselect All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid of Pages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[520px] overflow-y-auto p-1">
        {pages.map((p, index) => {
          const isSelected = mode === 'select' ? selectedPages.includes(p.pageNumber) || p.selected : !p.deleted;
          return (
            <div
              key={`${p.pageNumber}-${index}`}
              className={`group relative flex flex-col rounded-xl border transition-all duration-150 p-2 ${
                p.deleted
                  ? 'border-[#E2E8F0] bg-[#F8FAFC] opacity-40 grayscale'
                  : isSelected
                  ? 'border-[#2563EB] bg-blue-50/20 shadow-xs ring-2 ring-[#2563EB]/20'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
              }`}
            >
              {/* Page Number Badge & Select Indicator */}
              <div className="flex items-center justify-between pb-1.5 px-1 text-xs">
                <span className="font-bold text-[#0F172A] text-[11px]">
                  Page {p.pageNumber}
                </span>

                {mode === 'select' || mode === 'delete' ? (
                  <button
                    type="button"
                    onClick={() => handleSelectPage(p.pageNumber)}
                    className="text-[#2563EB] focus:outline-hidden cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB] fill-blue-50" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#CBD5E1]" />
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleRotatePage(index)}
                      title="Rotate 90°"
                      className="p-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#0F172A] shadow-2xs border border-[#E2E8F0] cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDelete(index)}
                      title={p.deleted ? 'Restore Page' : 'Delete Page'}
                      className={`p-1 rounded-lg shadow-2xs border cursor-pointer ${
                        p.deleted
                          ? 'bg-emerald-50 text-[#10B981] border-emerald-200'
                          : 'bg-white hover:bg-red-50 text-[#64748B] hover:text-[#EF4444] border-[#E2E8F0]'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Page Preview Thumbnail Container */}
              <div
                onClick={() => {
                  if (mode === 'select' || mode === 'delete') {
                    handleSelectPage(p.pageNumber);
                  } else if (p.thumbnailUrl) {
                    setPreviewPage(p.thumbnailUrl);
                  }
                }}
                className="relative aspect-[1/1.414] bg-[#F8FAFC] rounded-lg overflow-hidden border border-[#E2E8F0] flex items-center justify-center cursor-pointer select-none"
              >
                {p.thumbnailUrl ? (
                  <img
                    src={p.thumbnailUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="w-full h-full object-contain transition-transform duration-200"
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs text-[#94A3B8]">Loading...</span>
                )}

                {/* Hover overlay with zoom */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="p-1.5 rounded-full bg-white text-[#0F172A] shadow-xs">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Reorder Buttons (Bottom of card) */}
              {mode === 'organize' && !p.deleted && (
                <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-[#64748B]">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMovePage(index, 'left')}
                    className="p-1 rounded hover:bg-[#F1F5F9] disabled:opacity-20 text-[#64748B] cursor-pointer"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] text-[#94A3B8] font-medium">Pos #{index + 1}</span>
                  <button
                    type="button"
                    disabled={index === pages.length - 1}
                    onClick={() => handleMovePage(index, 'right')}
                    className="p-1 rounded hover:bg-[#F1F5F9] disabled:opacity-20 text-[#64748B] cursor-pointer"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Page Zoom Modal */}
      {previewPage && (
        <div
          onClick={() => setPreviewPage(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl p-4 shadow-2xl border border-[#E2E8F0]">
            <img
              src={previewPage}
              alt="Page Preview"
              className="max-h-[75vh] w-auto object-contain mx-auto rounded-lg"
              referrerPolicy="no-referrer"
            />
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setPreviewPage(null)}
                className="px-5 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold hover:bg-black cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
