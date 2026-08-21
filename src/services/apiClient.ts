import * as pdfEngine from './pdfEngine';
import { CompressOptions, WatermarkOptions, PageNumberOptions, ImageToPdfOptions } from '../types';
import { loadingManager } from './loadingManager';

export class ApiClient {
  private static async withLoading<T>(fn: () => Promise<T>): Promise<T> {
    loadingManager.startLoading();
    try {
      return await fn();
    } finally {
      loadingManager.stopLoading();
    }
  }

  static async checkHealth(): Promise<{ status: string; service: string }> {
    return await ApiClient.withLoading(async () => {
      try {
        const res = await fetch('/api/v1/health');
        if (res.ok) {
          return await res.json();
        }
        return { status: 'ok-fallback', service: 'Client Engine Active' };
      } catch {
        return { status: 'client-mode', service: 'Local Engine Active' };
      }
    });
  }

  // Merge
  static async merge(files: File[]): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      try {
        const formData = new FormData();
        files.forEach((f) => formData.append('files', f));
        const res = await fetch('/api/v1/pdf/merge', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          return await res.blob();
        }
      } catch (e) {
        console.warn('Backend API unavailable, executing via client engine', e);
      }
      return await pdfEngine.mergePDFs(files);
    });
  }

  // Split
  static async split(file: File, ranges: string): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('ranges', ranges);
        const res = await fetch('/api/v1/pdf/split', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          return await res.blob();
        }
      } catch (e) {
        console.warn('Backend API unavailable, using client engine', e);
      }
      return await pdfEngine.splitPDF(file, ranges);
    });
  }

  // Compress
  static async compress(
    file: File,
    options: CompressOptions
  ): Promise<{ blob: Blob; originalSize: number; newSize: number; reductionPct: number }> {
    return await ApiClient.withLoading(async () => {
      return await pdfEngine.compressPDF(file, options);
    });
  }

  // Rotate
  static async rotate(file: File, angle: number, pages?: number[]): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('angle', angle.toString());
        if (pages) formData.append('pages', pages.join(','));
        const res = await fetch('/api/v1/pdf/rotate', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          return await res.blob();
        }
      } catch (e) {
        console.warn('Falling back to local engine', e);
      }
      return await pdfEngine.rotatePDF(file, angle, pages);
    });
  }

  // Extract
  static async extract(file: File, pages: number[]): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pages', pages.join(','));
        const res = await fetch('/api/v1/pdf/extract', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          return await res.blob();
        }
      } catch (e) {
        console.warn('Falling back to local engine', e);
      }
      return await pdfEngine.extractPages(file, pages);
    });
  }

  // Delete Pages
  static async deletePages(file: File, pages: number[]): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pages', pages.join(','));
        const res = await fetch('/api/v1/pdf/delete-pages', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          return await res.blob();
        }
      } catch (e) {
        console.warn('Falling back to local engine', e);
      }
      return await pdfEngine.deletePages(file, pages);
    });
  }

  // Organize
  static async organize(
    file: File,
    config: { pageNumber: number; rotation: number; deleted?: boolean }[]
  ): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      return await pdfEngine.organizePDF(file, config);
    });
  }

  // Watermark
  static async watermark(file: File, options: WatermarkOptions): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', options.text);
        formData.append('fontSize', options.fontSize.toString());
        formData.append('opacity', options.opacity.toString());
        formData.append('rotation', options.rotation.toString());
        formData.append('color', options.color);
        const res = await fetch('/api/v1/pdf/watermark', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          return await res.blob();
        }
      } catch (e) {
        console.warn('Falling back to local engine', e);
      }
      return await pdfEngine.watermarkPDF(file, options);
    });
  }

  // Page Numbers
  static async pageNumbers(file: File, options: PageNumberOptions): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('position', options.position);
        formData.append('startNum', options.startNum.toString());
        formData.append('format', options.format);
        formData.append('fontSize', options.fontSize.toString());
        const res = await fetch('/api/v1/pdf/page-numbers', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          return await res.blob();
        }
      } catch (e) {
        console.warn('Falling back to local engine', e);
      }
      return await pdfEngine.addPageNumbers(file, options);
    });
  }

  // Images to PDF
  static async imagesToPDF(files: File[], options: ImageToPdfOptions): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      return await pdfEngine.imagesToPDF(files, options);
    });
  }

  // PDF to Images
  static async pdfToImages(
    file: File,
    format: 'jpg' | 'png',
    dpi: number = 150,
    quality: number = 0.92,
    onProgress?: (p: number) => void
  ): Promise<{ zipBlob: Blob; images: { name: string; blob: Blob; dataUrl: string }[] }> {
    return await ApiClient.withLoading(async () => {
      return await pdfEngine.convertPdfToImages(file, format, dpi, quality, onProgress);
    });
  }

  // OCR
  static async ocr(
    file: File,
    onProgress?: (step: string, progress: number) => void
  ): Promise<{ text: string; pageCount: number; txtBlob: Blob }> {
    return await ApiClient.withLoading(async () => {
      return await pdfEngine.ocrPDF(file, onProgress);
    });
  }

  // Protect
  static async protect(file: File, pass: string): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      return await pdfEngine.protectPDF(file, pass);
    });
  }

  // Unlock
  static async unlock(file: File, pass?: string): Promise<Blob> {
    return await ApiClient.withLoading(async () => {
      return await pdfEngine.unlockPDF(file, pass);
    });
  }

  // Metadata
  static async removeMetadata(file: File): Promise<{ blob: Blob; metadata: Record<string, string> }> {
    return await ApiClient.withLoading(async () => {
      return await pdfEngine.removeMetadata(file);
    });
  }

  // Get PDF Metadata Inspection
  static async getMetadata(file: File): Promise<any> {
    return await ApiClient.withLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/v1/pdf/metadata', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          return data.metadata || data;
        }
      } catch (e) {
        console.warn('Backend API unavailable, using client engine', e);
      }
      return await pdfEngine.getPdfMetadata(file);
    });
  }
}

