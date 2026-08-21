import React from 'react';

interface ToolCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton loader representing an individual Tool Card with matching dimensions,
 * borders, padding, and subtle shimmer animations.
 */
export const ToolCardSkeleton: React.FC<ToolCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      role="status"
      aria-label="Loading tool details..."
      className={`p-5 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col justify-between h-[180px] select-none animate-pulse ${className}`}
    >
      <div className="space-y-3">
        {/* Top Row: Icon Badge & Badge Pill Skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#F1F5F9]" />
          <div className="flex items-center gap-1.5">
            <div className="w-14 h-4 rounded-full bg-[#F1F5F9]" />
            <div className="w-4 h-4 rounded-md bg-[#F1F5F9]" />
          </div>
        </div>

        {/* Title & Description Skeletons */}
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-[#E2E8F0] rounded-md" />
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full bg-[#F1F5F9] rounded-md" />
            <div className="h-3 w-4/5 bg-[#F1F5F9] rounded-md" />
          </div>
        </div>
      </div>

      {/* Footer: Category & Open Link Skeleton */}
      <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]" />
          <div className="h-3 w-16 bg-[#F1F5F9] rounded-md" />
        </div>
        <div className="h-3 w-10 bg-[#F1F5F9] rounded-md" />
      </div>
    </div>
  );
};

interface ToolGridSkeletonProps {
  count?: number;
  columns?: string;
  className?: string;
}

/**
 * Grid of ToolCardSkeleton items for tool directories and lists.
 */
export const ToolGridSkeleton: React.FC<ToolGridSkeletonProps> = ({
  count = 8,
  columns = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-label="Loading tools grid..."
      className={`grid ${columns} gap-4 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ToolCardSkeleton key={idx} />
      ))}
      <span className="sr-only">Loading tools...</span>
    </div>
  );
};

interface ToolDetailSkeletonProps {
  className?: string;
}

/**
 * Skeleton loader matching the individual ToolView page layout (breadcrumb, header card, file dropzone).
 */
export const ToolDetailSkeleton: React.FC<ToolDetailSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      role="status"
      aria-label="Loading tool workspace..."
      className={`min-h-[calc(100vh-4rem)] bg-[#FAFBFC] py-8 px-4 sm:px-6 lg:px-10 animate-pulse ${className}`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 bg-[#E2E8F0] rounded-md" />
          <div className="h-3 w-3 bg-[#E2E8F0] rounded-md" />
          <div className="h-3 w-16 bg-[#E2E8F0] rounded-md" />
          <div className="h-3 w-3 bg-[#E2E8F0] rounded-md" />
          <div className="h-3 w-24 bg-[#E2E8F0] rounded-md" />
        </div>

        {/* Tool Header Card Skeleton */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 md:p-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1F5F9]" />
              <div className="h-6 w-48 bg-[#E2E8F0] rounded-md" />
            </div>
            <div className="w-20 h-5 rounded-full bg-[#F1F5F9]" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full max-w-xl bg-[#F1F5F9] rounded-md" />
            <div className="h-3.5 w-4/5 max-w-lg bg-[#F1F5F9] rounded-md" />
          </div>
        </div>

        {/* File Dropzone Area Skeleton */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-[#CBD5E1] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] mx-auto" />
          <div className="space-y-2 max-w-sm mx-auto">
            <div className="h-4 w-48 bg-[#E2E8F0] rounded-md mx-auto" />
            <div className="h-3 w-64 bg-[#F1F5F9] rounded-md mx-auto" />
          </div>
          <div className="h-10 w-36 bg-[#F1F5F9] rounded-xl mx-auto" />
        </div>
      </div>
      <span className="sr-only">Initializing tool engine...</span>
    </div>
  );
};
