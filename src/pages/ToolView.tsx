import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Settings, 
  Sparkles, 
  Lock, 
  Unlock, 
  Stamp, 
  Hash, 
  ShieldAlert, 
  RotateCw, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { PDFTool, ProcessingState, ProcessingResult, CompressOptions, WatermarkOptions, PageNumberOptions, ImageToPdfOptions } from '../types';
import { FileUploader } from '../components/FileUploader';
import { PageGrid, PageCardData } from '../components/PageGrid';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { ResultCard } from '../components/ResultCard';
import { ConversionOptions } from '../components/ConversionOptions';
import { ApiClient } from '../services/apiClient';
import { ToolDetailSkeleton } from '../components/SkeletonLoaders';
import { DocumentPreview } from '../components/DocumentPreview';

interface ToolViewProps {
  tool: PDFTool;
  onNavigate: (path: string) => void;
}

export const ToolView: React.FC<ToolViewProps> = ({ tool, onNavigate }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<ProcessingState>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize tool view gracefully
  useEffect(() => {
    setIsInitializing(true);
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [tool.id]);

  // Tool-specific configuration states
  const [splitRange, setSplitRange] = useState('1-3');
  const [compressLevel, setCompressLevel] = useState<'high' | 'balanced' | 'max'>('balanced');
  const [rotateAngle, setRotateAngle] = useState(90);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [organizePages, setOrganizePages] = useState<PageCardData[]>([]);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number>(0);

  // PDF to Image conversion options
  const [convDpi, setConvDpi] = useState<72 | 150 | 300>(150);
  const [convQuality, setConvQuality] = useState<number>(0.92);
  const [convFormat, setConvFormat] = useState<'jpg' | 'png'>(tool.id === 'pdf-to-png' ? 'png' : 'jpg');
  
  // Image to PDF options
  const [imgOptions, setImgOptions] = useState<ImageToPdfOptions>({
    pageSize: 'a4',
    orientation: 'auto',
    margin: 'small',
  });

  // Watermark options
  const [watermarkOpts, setWatermarkOpts] = useState<WatermarkOptions>({
    text: 'CONFIDENTIAL',
    fontSize: 48,
    opacity: 0.3,
    rotation: 45,
    color: '#dc2626',
    position: 'center',
  });

  // Page Numbers options
  const [pageNumOpts, setPageNumOpts] = useState<PageNumberOptions>({
    position: 'bottom-center',
    startNum: 1,
    format: 'Page {n} of {total}',
    fontSize: 10,
  });

  // Protect / Unlock options
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = () => {
    setFiles([]);
    setState('IDLE');
    setResult(null);
    setStatusMessage('');
    setErrorMessage('');
    setSelectedPages([]);
    setOrganizePages([]);
    setPassword('');
    setConfirmPassword('');
  };

  // Global listener for Esc clear event
  useEffect(() => {
    const handleGlobalClear = () => {
      handleReset();
    };
    window.addEventListener('docucraft:clear-files', handleGlobalClear);
    return () => window.removeEventListener('docucraft:clear-files', handleGlobalClear);
  }, []);

  const executeProcess = async () => {
    if (files.length === 0) return;
    
    // Validation rules
    if (tool.id === 'merge' && files.length < 2) {
      setErrorMessage('Please upload at least 2 PDF files to merge.');
      setState('ERROR');
      return;
    }
    if (tool.id === 'protect' && (!password || password !== confirmPassword)) {
      setErrorMessage('Please ensure passwords match and are not empty.');
      setState('ERROR');
      return;
    }

    try {
      setState('UPLOADING');
      setStatusMessage('Reading document byte stream...');
      await new Promise((r) => setTimeout(r, 200));

      setState('VALIDATING');
      setStatusMessage('Validating PDF integrity...');
      await new Promise((r) => setTimeout(r, 200));

      setState('PROCESSING');
      const baseName = files[0].name.replace(/\.[^/.]+$/, '');

      if (tool.id === 'merge') {
        setStatusMessage('Combining document streams...');
        const mergedBlob = await ApiClient.merge(files);
        const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);

        setResult({
          fileBlob: mergedBlob,
          downloadName: 'merged_document.pdf',
          originalSize: totalOriginalSize,
          resultSize: mergedBlob.size,
          originalFileCount: files.length,
        });
      } else if (tool.id === 'split') {
        setStatusMessage(`Extracting page ranges (${splitRange})...`);
        const splitBlob = await ApiClient.split(files[0], splitRange);
        setResult({
          fileBlob: splitBlob,
          downloadName: `${baseName}_split.pdf`,
          originalSize: files[0].size,
          resultSize: splitBlob.size,
        });
      } else if (tool.id === 'compress') {
        setStatusMessage('Optimizing streams and stripping redundant tables...');
        const compRes = await ApiClient.compress(files[0], { quality: compressLevel });
        setResult({
          fileBlob: compRes.blob,
          downloadName: `${baseName}_compressed.pdf`,
          originalSize: compRes.originalSize,
          resultSize: compRes.newSize,
          reductionPercentage: compRes.reductionPct,
        });
      } else if (tool.id === 'rotate') {
        setStatusMessage(`Rotating pages by ${rotateAngle}°...`);
        const rotBlob = await ApiClient.rotate(files[0], rotateAngle, selectedPages.length > 0 ? selectedPages : undefined);
        setResult({
          fileBlob: rotBlob,
          downloadName: `${baseName}_rotated.pdf`,
          originalSize: files[0].size,
          resultSize: rotBlob.size,
        });
      } else if (tool.id === 'organize' || tool.id === 'reorder-pages') {
        setStatusMessage('Applying page layout and reordering...');
        const config = organizePages.map((p) => ({
          pageNumber: p.pageNumber,
          rotation: p.rotation,
          deleted: p.deleted,
        }));
        const orgBlob = await ApiClient.organize(files[0], config);
        setResult({
          fileBlob: orgBlob,
          downloadName: `${baseName}_organized.pdf`,
          originalSize: files[0].size,
          resultSize: orgBlob.size,
        });
      } else if (tool.id === 'extract-pages') {
        setStatusMessage('Extracting selected pages...');
        const pagesToExtract = selectedPages.length > 0 ? selectedPages : [1];
        const extBlob = await ApiClient.extract(files[0], pagesToExtract);
        setResult({
          fileBlob: extBlob,
          downloadName: `${baseName}_extracted.pdf`,
          originalSize: files[0].size,
          resultSize: extBlob.size,
        });
      } else if (tool.id === 'delete-pages') {
        setStatusMessage('Removing specified pages from document...');
        const delBlob = await ApiClient.deletePages(files[0], selectedPages);
        setResult({
          fileBlob: delBlob,
          downloadName: `${baseName}_trimmed.pdf`,
          originalSize: files[0].size,
          resultSize: delBlob.size,
        });
      } else if (tool.id === 'pdf-to-jpg' || tool.id === 'pdf-to-png') {
        const fmt = convFormat;
        setStatusMessage(`Rendering high-resolution ${fmt.toUpperCase()} pages at ${convDpi} DPI...`);
        const { zipBlob, images } = await ApiClient.pdfToImages(files[0], fmt, convDpi, convQuality, (pct) => {
          setStatusMessage(`Rendering page ${pct}%...`);
        });
        setResult({
          fileBlob: zipBlob,
          downloadName: `${baseName}_${fmt}_images.zip`,
          originalSize: files[0].size,
          resultSize: zipBlob.size,
          multiFiles: images.map((i) => ({ name: i.name, blob: i.blob, url: i.dataUrl })),
        });
      } else if (tool.id === 'jpg-to-pdf' || tool.id === 'png-to-pdf') {
        setStatusMessage('Formatting and compiling images into PDF document...');
        const imgPdfBlob = await ApiClient.imagesToPDF(files, imgOptions);
        const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);
        setResult({
          fileBlob: imgPdfBlob,
          downloadName: 'images_document.pdf',
          originalSize: totalOriginalSize,
          resultSize: imgPdfBlob.size,
          originalFileCount: files.length,
        });
      } else if (tool.id === 'ocr') {
        setStatusMessage('Initializing Tesseract OCR neural model...');
        const ocrRes = await ApiClient.ocr(files[0], (step, pct) => {
          setStatusMessage(`${step} (${pct}%)`);
        });
        setResult({
          fileBlob: ocrRes.txtBlob,
          downloadName: `${baseName}_ocr_text.txt`,
          originalSize: files[0].size,
          resultSize: ocrRes.txtBlob.size,
          pageCount: ocrRes.pageCount,
          extractedText: ocrRes.text,
        });
      } else if (tool.id === 'watermark') {
        setStatusMessage('Stamping vector watermark overlay...');
        const wmBlob = await ApiClient.watermark(files[0], watermarkOpts);
        setResult({
          fileBlob: wmBlob,
          downloadName: `${baseName}_watermarked.pdf`,
          originalSize: files[0].size,
          resultSize: wmBlob.size,
        });
      } else if (tool.id === 'page-numbers') {
        setStatusMessage('Injecting formatted page numbers...');
        const pnBlob = await ApiClient.pageNumbers(files[0], pageNumOpts);
        setResult({
          fileBlob: pnBlob,
          downloadName: `${baseName}_numbered.pdf`,
          originalSize: files[0].size,
          resultSize: pnBlob.size,
        });
      } else if (tool.id === 'protect') {
        setStatusMessage('Encrypting document streams with password...');
        const protBlob = await ApiClient.protect(files[0], password);
        setResult({
          fileBlob: protBlob,
          downloadName: `${baseName}_protected.pdf`,
          originalSize: files[0].size,
          resultSize: protBlob.size,
        });
      } else if (tool.id === 'unlock') {
        setStatusMessage('Decrypting authorized PDF restrictions...');
        const unBlob = await ApiClient.unlock(files[0], password);
        setResult({
          fileBlob: unBlob,
          downloadName: `${baseName}_unlocked.pdf`,
          originalSize: files[0].size,
          resultSize: unBlob.size,
        });
      } else if (tool.id === 'metadata') {
        setStatusMessage('Sanitizing author traces and creation timestamps...');
        const metaRes = await ApiClient.removeMetadata(files[0]);
        setResult({
          fileBlob: metaRes.blob,
          downloadName: `${baseName}_clean.pdf`,
          originalSize: files[0].size,
          resultSize: metaRes.blob.size,
          metadata: metaRes.metadata,
        });
      } else if (tool.id === 'pdf-metadata') {
        setStatusMessage('Extracting document metadata and properties...');
        const metaObj = await ApiClient.getMetadata(files[0]);
        const jsonStr = JSON.stringify(metaObj, null, 2);
        const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
        setResult({
          fileBlob: jsonBlob,
          downloadName: `${baseName}_metadata.json`,
          originalSize: files[0].size,
          resultSize: jsonBlob.size,
          metadata: {
            Title: metaObj.title || 'None',
            Author: metaObj.author || 'None',
            Subject: metaObj.subject || 'None',
            Creator: metaObj.creator || 'None',
            Producer: metaObj.producer || 'None',
            'Creation Date': metaObj.creationDate || 'None',
            'Modification Date': metaObj.modificationDate || 'None',
            'Page Count': String(metaObj.pageCount || 1),
          },
        });
      }

      setState('SUCCESS');
    } catch (err: any) {
      console.error('Processing error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during PDF processing.');
      setState('ERROR');
    }
  };

  const handleSelectToggle = (pageNum: number) => {
    if (selectedPages.includes(pageNum)) {
      setSelectedPages(selectedPages.filter((p) => p !== pageNum));
    } else {
      setSelectedPages([...selectedPages, pageNum].sort((a, b) => a - b));
    }
  };

  const showVisualGrid = files.length === 1 && !tool.accepts.includes('image') && [
    'organize', 'split', 'rotate', 'extract-pages', 'delete-pages', 'reorder-pages'
  ].includes(tool.id);

  if (isInitializing) {
    return <ToolDetailSkeleton />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFBFC] py-8 px-4 sm:px-6 lg:px-10">
      <Helmet>
        <title>{`${tool.name} — DocuCraft PDF Studio`}</title>
        <meta name="description" content={tool.description || tool.shortDesc} />
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('/tools')}
            className="hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            All Tools
          </button>
          <span>/</span>
          <span className="font-bold text-[#0F172A]">{tool.name}</span>
        </div>

        {/* Tool Header */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 md:p-8 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight">
                {tool.name}
              </h1>
            </div>
            {tool.badge && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-[#2563EB]">
                {tool.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed max-w-2xl">
            {tool.fullDesc}
          </p>
        </div>

        {/* Dynamic State Workflow */}
        {state === 'SUCCESS' && result ? (
          <ResultCard
            result={result}
            onReset={handleReset}
            onNavigate={onNavigate}
            currentToolId={tool.id}
          />
        ) : state === 'ERROR' ? (
          <div className="space-y-4">
            <ProcessingOverlay
              state={state}
              errorMessage={errorMessage}
            />
            <div className="text-center">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : state !== 'IDLE' ? (
          <ProcessingOverlay state={state} customMessage={statusMessage} />
        ) : (
          <div className="space-y-6">
            
            {/* File Uploader */}
            <FileUploader
              files={files}
              onFilesChange={setFiles}
              acceptMode={tool.accepts}
            />

            {/* Interactive Visual Grid for Page Manipulation */}
            {showVisualGrid && (
              <PageGrid
                file={files[0]}
                mode={
                  tool.id === 'delete-pages'
                    ? 'delete'
                    : tool.id === 'extract-pages' || tool.id === 'split'
                    ? 'select'
                    : 'organize'
                }
                selectedPages={selectedPages}
                onSelectToggle={handleSelectToggle}
                onPagesChange={setOrganizePages}
              />
            )}

            {/* Document Verification Preview (react-pdf) */}
            {files.length > 0 && !showVisualGrid && (
              <div className="space-y-3">
                {files.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs font-bold text-[#64748B] shrink-0">
                      Preview Document:
                    </span>
                    {files.map((f, idx) => (
                      <button
                        key={`${f.name}-${idx}`}
                        type="button"
                        onClick={() => setSelectedPreviewIndex(idx)}
                        className={`px-3 py-1 text-xs rounded-xl border transition-all cursor-pointer truncate max-w-[200px] ${
                          (selectedPreviewIndex || 0) === idx
                            ? 'bg-blue-50 text-[#2563EB] border-[#2563EB]/40 font-bold shadow-2xs'
                            : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                        }`}
                      >
                        {idx + 1}. {f.name}
                      </button>
                    ))}
                  </div>
                )}

                <DocumentPreview
                  file={files[selectedPreviewIndex] || files[0]}
                  title={`${tool.name} • Document Verification`}
                />
              </div>
            )}

            {/* Tool Specific Configuration Panels */}
            {files.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                  <Sliders className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    {tool.name} Settings
                  </span>
                </div>

                {/* Compress Tool Settings */}
                {tool.id === 'compress' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'high', label: 'High Quality', desc: 'Light compression, maximum clarity' },
                      { id: 'balanced', label: 'Balanced', desc: 'Recommended ratio & crisp fonts' },
                      { id: 'max', label: 'Max Compression', desc: 'Smallest file size for email' },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        onClick={() => setCompressLevel(opt.id as any)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          compressLevel === opt.id
                            ? 'border-[#2563EB] bg-blue-50/40 shadow-xs ring-2 ring-[#2563EB]/20'
                            : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0F172A]">{opt.label}</span>
                          <input
                            type="radio"
                            name="compressLevel"
                            checked={compressLevel === opt.id}
                            onChange={() => {}}
                            className="text-[#2563EB]"
                          />
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-1">{opt.desc}</p>
                      </label>
                    ))}
                  </div>
                )}

                {/* Split Tool Settings */}
                {tool.id === 'split' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#0F172A]">
                      Page Range to Extract (e.g. 1-3, 5, 8-10)
                    </label>
                    <input
                      type="text"
                      value={splitRange}
                      onChange={(e) => setSplitRange(e.target.value)}
                      placeholder="e.g. 1-5, 8"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E2E8F0] text-[#0F172A] focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                    />
                    <p className="text-[11px] text-[#94A3B8]">
                      You can also click on individual page cards above to specify ranges.
                    </p>
                  </div>
                )}

                {/* Rotate Settings */}
                {tool.id === 'rotate' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#0F172A]">
                      Rotation Degree
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { deg: 90, label: '90° Clockwise' },
                        { deg: 180, label: '180° Flip' },
                        { deg: 270, label: '270° Counter-Clockwise' },
                      ].map((item) => (
                        <button
                          key={item.deg}
                          type="button"
                          onClick={() => setRotateAngle(item.deg)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            rotateAngle === item.deg
                              ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                              : 'border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDF to Image Conversion Options */}
                {(tool.id === 'pdf-to-jpg' || tool.id === 'pdf-to-png') && (
                  <ConversionOptions
                    dpi={convDpi}
                    onDpiChange={setConvDpi}
                    quality={convQuality}
                    onQualityChange={setConvQuality}
                    format={convFormat}
                    onFormatChange={setConvFormat}
                  />
                )}

                {/* Images to PDF Settings */}
                {(tool.id === 'jpg-to-pdf' || tool.id === 'png-to-pdf') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#0F172A] mb-1.5">Page Size</label>
                      <select
                        value={imgOptions.pageSize}
                        onChange={(e) => setImgOptions({ ...imgOptions, pageSize: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A]"
                      >
                        <option value="a4">Standard A4</option>
                        <option value="letter">US Letter</option>
                        <option value="fit">Fit to Image Size</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0F172A] mb-1.5">Orientation</label>
                      <select
                        value={imgOptions.orientation}
                        onChange={(e) => setImgOptions({ ...imgOptions, orientation: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A]"
                      >
                        <option value="auto">Auto Detect</option>
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0F172A] mb-1.5">Page Margins</label>
                      <select
                        value={imgOptions.margin}
                        onChange={(e) => setImgOptions({ ...imgOptions, margin: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A]"
                      >
                        <option value="none">No Margin (Full Bleed)</option>
                        <option value="small">Small Margin (20pt)</option>
                        <option value="large">Large Margin (40pt)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Watermark Settings */}
                {tool.id === 'watermark' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-[#0F172A] mb-1">Watermark Text</label>
                        <input
                          type="text"
                          value={watermarkOpts.text}
                          onChange={(e) => setWatermarkOpts({ ...watermarkOpts, text: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#E2E8F0] text-[#0F172A]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0F172A] mb-1">Stamp Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={watermarkOpts.color}
                            onChange={(e) => setWatermarkOpts({ ...watermarkOpts, color: e.target.value })}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-[#E2E8F0]"
                          />
                          <span className="font-mono text-[#64748B]">{watermarkOpts.color}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-[#0F172A] mb-1">
                          Font Size ({watermarkOpts.fontSize}px)
                        </label>
                        <input
                          type="range"
                          min="16"
                          max="96"
                          value={watermarkOpts.fontSize}
                          onChange={(e) => setWatermarkOpts({ ...watermarkOpts, fontSize: parseInt(e.target.value) })}
                          className="w-full accent-[#2563EB]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0F172A] mb-1">
                          Opacity ({Math.round(watermarkOpts.opacity * 100)}%)
                        </label>
                        <input
                          type="range"
                          min="0.05"
                          max="1.0"
                          step="0.05"
                          value={watermarkOpts.opacity}
                          onChange={(e) => setWatermarkOpts({ ...watermarkOpts, opacity: parseFloat(e.target.value) })}
                          className="w-full accent-[#2563EB]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0F172A] mb-1">
                          Angle ({watermarkOpts.rotation}°)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={watermarkOpts.rotation}
                          onChange={(e) => setWatermarkOpts({ ...watermarkOpts, rotation: parseInt(e.target.value) })}
                          className="w-full accent-[#2563EB]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Page Numbers Settings */}
                {tool.id === 'page-numbers' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#0F172A] mb-1">Number Format</label>
                      <select
                        value={pageNumOpts.format}
                        onChange={(e) => setPageNumOpts({ ...pageNumOpts, format: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A]"
                      >
                        <option value="Page {n} of {total}">Page 1 of N</option>
                        <option value="Page {n}">Page 1</option>
                        <option value="{n}">1 (Number only)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0F172A] mb-1">Position</label>
                      <select
                        value={pageNumOpts.position}
                        onChange={(e) => setPageNumOpts({ ...pageNumOpts, position: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A]"
                      >
                        <option value="bottom-center">Bottom Center</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-center">Top Center</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0F172A] mb-1">Start From Page</label>
                      <input
                        type="number"
                        min="1"
                        value={pageNumOpts.startNum}
                        onChange={(e) => setPageNumOpts({ ...pageNumOpts, startNum: parseInt(e.target.value) || 1 })}
                        className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A]"
                      />
                    </div>
                  </div>
                )}

                {/* Protect Settings */}
                {tool.id === 'protect' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#0F172A] mb-1">Set Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter secure password"
                        className="w-full p-2.5 rounded-xl border border-[#E2E8F0] text-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0F172A] mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full p-2.5 rounded-xl border border-[#E2E8F0] text-[#0F172A]"
                      />
                    </div>
                  </div>
                )}

                {/* Unlock Settings */}
                {tool.id === 'unlock' && (
                  <div className="text-xs space-y-2">
                    <label className="block font-bold text-[#0F172A]">
                      Document Password (If encrypted)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter authorized document password"
                      className="w-full p-2.5 rounded-xl border border-[#E2E8F0] text-[#0F172A] max-w-md"
                    />
                    <p className="text-[11px] text-[#64748B]">
                      DocuCraft only processes authorized files with user consent.
                    </p>
                  </div>
                )}

                {/* Metadata Settings */}
                {tool.id === 'metadata' && (
                  <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-xl text-xs text-blue-900 space-y-1">
                    <p className="font-bold text-[#0F172A]">Privacy Sanitization Active</p>
                    <p className="text-[11px] text-[#2563EB]">
                      This will strip author names, software producers, modification timestamps, and document keywords permanently.
                    </p>
                  </div>
                )}

                {/* Main Process Trigger Button */}
                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">
                    {files.length} {files.length === 1 ? 'file' : 'files'} ready for processing
                  </span>

                  <button
                    type="button"
                    id="execute-pdf-process-btn"
                    onClick={executeProcess}
                    className="px-6 py-3 bg-[#0F172A] hover:bg-black active:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Process {tool.name}</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
