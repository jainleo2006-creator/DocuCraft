import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, ArrowUp, ArrowDown, Plus, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  acceptMode: 'pdf' | 'multiple-pdf' | 'image' | 'multiple-image';
  maxSizeMB?: number;
  label?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  onFilesChange,
  acceptMode,
  maxSizeMB = 50,
  label,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMultiple = acceptMode.startsWith('multiple');
  const isImageMode = acceptMode.includes('image');

  const acceptedMimeTypes = isImageMode 
    ? ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    : ['application/pdf'];

  const acceptString = isImageMode ? '.jpg,.jpeg,.png,.webp' : '.pdf';

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const validateAndAddFiles = (incomingFiles: FileList | File[]) => {
    setErrorMessage(null);
    const newValidFiles: File[] = [];

    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];

      // Size check
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage(`File Size Error: "${file.name}" exceeds the maximum limit of ${maxSizeMB}MB.`);
        triggerShake();
        continue;
      }

      // Type check
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isPdf = file.type === 'application/pdf' || ext === 'pdf';
      const isImg = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

      if (isImageMode && !isImg) {
        setErrorMessage(`Invalid File Type: "${file.name}" (.${ext || 'unknown'}) is not a supported image file. Please upload a JPG, PNG, or WEBP image.`);
        triggerShake();
        continue;
      }

      if (!isImageMode && !isPdf) {
        setErrorMessage(`Invalid File Type: "${file.name}" (.${ext || 'unknown'}) is not a valid PDF document. Please upload a .pdf file.`);
        triggerShake();
        continue;
      }

      newValidFiles.push(file);
    }

    if (newValidFiles.length > 0) {
      if (isMultiple) {
        onFilesChange([...files, ...newValidFiles]);
      } else {
        onFilesChange([newValidFiles[0]]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const handleRemoveFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    onFilesChange(updated);
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...files];
    const item = updated.splice(index, 1)[0];
    updated.splice(targetIndex, 0, item);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Area */}
      <div
        id="file-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-150 ${
          isShaking 
            ? 'animate-shake border-red-500 bg-red-50/70 shadow-lg shadow-red-100' 
            : isDragging
              ? 'border-[#2563EB] bg-blue-50/60 scale-[1.005]'
              : 'border-[#E2E8F0] hover:border-[#94A3B8] bg-white hover:bg-[#F8FAFC]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          multiple={isMultiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? 'bg-[#2563EB] text-white' : 'bg-blue-50 text-[#2563EB]'
          }`}>
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <p className="text-base font-bold text-[#0F172A]">
              {label || (isMultiple ? 'Choose or drop multiple files here' : 'Choose or drop your file here')}
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Supports {isImageMode ? 'JPG, PNG, WEBP' : 'PDF'} documents up to {maxSizeMB}MB
            </p>
          </div>

          <button
            type="button"
            id="browse-files-btn"
            className="px-5 py-2.5 text-xs font-bold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            Select {isMultiple ? 'Files' : 'File'}
          </button>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Selected ({files.length} {files.length === 1 ? 'file' : 'files'})
            </span>
            <div className="flex items-center gap-3">
              {isMultiple && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add More
                </button>
              )}
              <button
                type="button"
                onClick={() => onFilesChange([])}
                title="Press Esc to clear"
                className="text-xs text-[#94A3B8] hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Clear All</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono font-medium text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                  Esc
                </kbd>
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs hover:border-[#CBD5E1] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#0F172A] truncate">{file.name}</p>
                    <p className="text-[11px] text-[#64748B]">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isMultiple && (
                    <>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveFile(idx, 'up')}
                        title="Move Up"
                        className="p-1 rounded text-[#64748B] hover:text-[#0F172A] disabled:opacity-30 hover:bg-[#E2E8F0] cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === files.length - 1}
                        onClick={() => handleMoveFile(idx, 'down')}
                        title="Move Down"
                        className="p-1 rounded text-[#64748B] hover:text-[#0F172A] disabled:opacity-30 hover:bg-[#E2E8F0] cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    title="Remove File"
                    className="p-1 rounded text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-colors ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
