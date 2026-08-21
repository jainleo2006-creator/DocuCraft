export type ToolCategory = 'organize' | 'optimize' | 'convert' | 'edit' | 'security' | 'intelligence';

export interface PDFTool {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  category: ToolCategory;
  iconName: string;
  popular?: boolean;
  accepts: 'pdf' | 'image' | 'multiple-pdf' | 'multiple-image';
  badge?: string;
  ready: boolean;
  howItWorks?: string;
  steps?: string[];
  highlight?: string;
}

export type ProcessingState = 'IDLE' | 'UPLOADING' | 'VALIDATING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

export interface PageInfo {
  pageNumber: number;
  rotation: number;
  selected: boolean;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export interface ProcessingResult {
  fileBlob: Blob;
  downloadName: string;
  originalSize: number;
  resultSize: number;
  pageCount?: number;
  originalFileCount?: number;
  reductionPercentage?: number;
  extractedText?: string;
  metadata?: Record<string, string>;
  multiFiles?: { name: string; blob: Blob; url: string }[];
}

export interface CompressOptions {
  quality: 'high' | 'balanced' | 'max';
}

export interface WatermarkOptions {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  color: string;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface PageNumberOptions {
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center';
  startNum: number;
  format: string; // e.g. "Page {n} of {total}" or "{n}"
  fontSize: number;
}

export interface ImageToPdfOptions {
  pageSize: 'a4' | 'letter' | 'fit';
  orientation: 'portrait' | 'landscape' | 'auto';
  margin: 'none' | 'small' | 'large';
}
