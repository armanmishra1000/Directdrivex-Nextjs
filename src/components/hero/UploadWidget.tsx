"use client";

import { BatchUploadState, FileState, UploadState } from '@/types/upload';
import { Check, CheckCircle2, Clipboard, CloudUpload, File as FileIconLucide, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from "sonner";
import { getFileTypeInfo } from '../ui/FileIcon';
import { cn } from '@/lib/utils';

const MAX_FILES = 5;

export function UploadWidget() {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single file state
  const [currentState, setCurrentState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);

  // Batch file state
  const [batchState, setBatchState] = useState<BatchUploadState>('idle');
  const [batchFiles, setBatchFiles] = useState<FileState[]>([]);

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    if (files.length === 1) {
      setSelectedFile(files[0]);
      setCurrentState('selected');
      setBatchState('idle');
      setBatchFiles([]);
    } else {
      if (files.length > MAX_FILES) {
        toast.error(`You can upload a maximum of ${MAX_FILES} files at a time.`);
        return;
      }
      setBatchFiles(Array.from(files).map(file => ({
        id: crypto.randomUUID(),
        file,
        state: 'pending',
        progress: 0,
      })));
      setBatchState('selected');
      setCurrentState('idle');
      setSelectedFile(null);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeSelectedFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setCurrentState('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeBatchFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = batchFiles.filter(f => f.id !== id);
    if (newFiles.length === 0) {
      setBatchState('idle');
    } else if (newFiles.length === 1) {
      setSelectedFile(newFiles[0].file);
      setCurrentState('selected');
      setBatchState('idle');
      setBatchFiles([]);
      return;
    }
    setBatchFiles(newFiles);
  };

  const resetAll = () => {
    setCurrentState('idle');
    setSelectedFile(null);
    setUploadProgress(0);
    setIsCancelling(false);
    setBatchState('idle');
    setBatchFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = () => {
    setCurrentState('uploading');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Randomly decide if upload succeeds or fails for demonstration
          if (Math.random() > 0.2) {
            setCurrentState('success');
          } else {
            setCurrentState('error');
            toast.error("Upload failed. Please try again.");
          }
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const handleBatchUpload = () => {
    setBatchState('processing');
    setBatchFiles(files => files.map(f => ({ ...f, state: 'uploading', progress: 0 })));

    const interval = setInterval(() => {
      let allDone = true;
      setBatchFiles(files => files.map(f => {
        if (f.state !== 'uploading') return f;
        
        let newProgress = f.progress + Math.random() * 20;
        if (newProgress >= 100) {
          newProgress = 100;
          return { ...f, progress: 100, state: 'success' };
        }
        allDone = false;
        return { ...f, progress: newProgress };
      }));

      if (allDone) {
        clearInterval(interval);
        setTimeout(() => setBatchState('success'), 500);
      }
    }, 400);
  };

  const handleCancel = () => {
    setIsCancelling(true);
    toast.info('Cancelling upload...');
    setTimeout(() => {
      setCurrentState('cancelled');
      setIsCancelling(false);
    }, 1000);
  };

  const handleBatchCancel = () => {
    setBatchState('cancelled');
    toast.info('All uploads have been cancelled.');
  };

  const copyLink = () => {
    navigator.clipboard.writeText("https://directdrivex.com/download/xyz123");
    toast.success("Link copied to clipboard!");
  };

  const IdleState = () => (
    <div
      className={cn(
        "bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-bolt-blue hover:bg-bolt-light-blue/20 hover:shadow-lg group",
        { 'border-bolt-blue bg-bolt-light-blue/20 shadow-lg animate-pulse': isDragOver }
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files)} className="hidden" multiple />
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-bolt-blue/10 to-bolt-blue/20 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform animate-float">
          <CloudUpload className="w-6 h-6 sm:w-8 sm:h-8 text-bolt-blue" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          {isDragOver ? "✨ Drop files here" : "Drag & Drop up to 5 files here"}
        </h3>
        <div className="flex items-center justify-center my-4 sm:my-6">
          <div className="flex-1 h-px bg-slate-300"></div>
          <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>
        <div className="mb-3 sm:mb-4">
          <button className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-bolt-blue to-bolt-mid-blue rounded-xl shadow-lg hover:shadow-xl hover:from-bolt-mid-blue hover:to-bolt-blue focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Browse Files
          </button>
        </div>
        <div className="flex justify-center items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 opacity-60">
          {['PDF', 'ZIP', 'MP4', 'DOC'].map((type, i) => (
            <div key={type} className={`file-type-icon w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center px-4 ${['bg-red-100', 'bg-purple-100', 'bg-green-100', 'bg-blue-100'][i]}`}>
              <span className={`text-xs font-bold ${['text-red-600', 'text-purple-600', 'text-green-600', 'text-blue-600'][i]}`}>{type}</span>
            </div>
          ))}
          <div className="text-xs text-slate-400 sm:text-sm">+more</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-400">Try it now - no signup required for 2GB (max 5 files)</div>
          <div className="text-xs font-medium text-slate-500">Bank-level encryption • Up to 30GB with account</div>
        </div>
      </div>
    </div>
  );

  const FileSelectedState = () => {
    if (!selectedFile) return null;
    const { Icon, bgColor, color } = getFileTypeInfo(selectedFile.name);
    return (
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-bolt-light-blue rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-sm border border-slate-200 ${bgColor}`}>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{selectedFile.name}</h4>
              <p className="text-xs sm:text-sm text-slate-500">{getFileSize(selectedFile.size)} • Ready to upload</p>
            </div>
            <div className="flex-shrink-0">
              <button onClick={removeSelectedFile} className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors" title="Remove file">
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
        <button onClick={handleUpload} className="w-full bg-gradient-to-r from-bolt-blue to-bolt-mid-blue text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-sm sm:text-base">
          Upload File
        </button>
      </div>
    );
  };

  const BatchSelectedState = () => (
    <div className="text-center space-y-3 sm:space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-bolt-light-blue rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-bolt-blue rounded-xl flex items-center justify-center shadow-sm">
            <FileIconLucide className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">{batchFiles.length} Files Selected</h3>
            <p className="text-xs sm:text-sm text-slate-500">Ready for batch upload</p>
          </div>
        </div>
        <div className="space-y-2 max-h-32 sm:max-h-48 overflow-y-auto">
          {batchFiles.slice(0, 5).map(f => {
            const { Icon, bgColor, color } = getFileTypeInfo(f.file.name);
            return (
              <div key={f.id} className="bg-white border border-slate-200 rounded-xl p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200 ${bgColor}`}>
                    <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${color}`} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-slate-900 truncate text-xs sm:text-sm">{f.file.name}</p>
                    <p className="text-xs text-slate-500">{getFileSize(f.file.size)}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button onClick={(e) => removeBatchFile(f.id, e)} className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors" title="Remove file">
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {batchFiles.length > 5 && (
            <div className="text-center py-2">
              <span className="text-xs sm:text-sm text-slate-500 bg-white px-2 sm:px-3 py-1 rounded-full border border-slate-200">
                +{batchFiles.length - 5} more files
              </span>
            </div>
          )}
        </div>
      </div>
      <button onClick={handleBatchUpload} className="w-full bg-gradient-to-r from-bolt-blue to-bolt-mid-blue text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-sm sm:text-base">
        Upload {batchFiles.length} Files (Max {MAX_FILES})
      </button>
    </div>
  );

  const UploadingState = () => {
    if (!selectedFile) return null;
    const { Icon } = getFileTypeInfo(selectedFile.name);
    return (
      <div className="text-center space-y-3 sm:space-y-4">
        <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-bolt-light-blue rounded-2xl p-4 sm:p-6 shadow-sm transition-opacity ${isCancelling ? 'opacity-60' : ''}`}>
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${isCancelling ? 'bg-orange-500' : 'bg-slate-200'}`}>
              {isCancelling || uploadProgress > 0 ? (
                <Loader2 className="w-6 h-6 text-bolt-blue animate-spinner-rotation" />
              ) : (
                <Icon className="w-6 h-6 text-slate-600" />
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{selectedFile.name}</h4>
              <p className={`text-xs sm:text-sm text-slate-500 transition-colors ${isCancelling ? 'text-orange-600' : ''}`}>
                {isCancelling ? "Cancelling upload..." : `Uploading... ${uploadProgress}%`}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
            <div className={`h-2 rounded-full transition-all duration-200 ${isCancelling ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-bolt-blue to-bolt-cyan'}`} style={{ width: `${uploadProgress}%` }}></div>
          </div>
        </div>
        <button onClick={handleCancel} disabled={isCancelling} className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none text-sm sm:text-base">
          <div className="flex items-center justify-center space-x-2">
            {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            <span>{isCancelling ? "Cancelling..." : "Cancel Upload"}</span>
          </div>
        </button>
      </div>
    );
  };

  const BatchProcessingState = () => (
    <div className="text-center space-y-3 sm:space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-bolt-light-blue rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Uploading Files...</h3>
        <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
          {batchFiles.map(f => {
            const { Icon, color } = getFileTypeInfo(f.file.name);
            const stateBg = {
              pending: 'bg-slate-100',
              uploading: 'bg-slate-200',
              success: 'bg-green-500',
            }[f.state as 'pending' | 'uploading' | 'success'];
            return (
              <div key={f.id} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200 ${stateBg}`}>
                    {f.state === 'pending' && <Icon className={`w-5 h-5 ${color}`} />}
                    {f.state === 'uploading' && <Loader2 className="w-5 h-5 text-bolt-blue animate-spinner-rotation" />}
                    {f.state === 'success' && <Check className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-slate-900 truncate">{f.file.name}</p>
                    <p className="text-sm text-slate-500">
                      {getFileSize(f.file.size)}
                      {f.state === 'uploading' && ` • ${Math.round(f.progress)}%`}
                      {f.state === 'success' && ' • Complete'}
                    </p>
                  </div>
                </div>
                {(f.state === 'uploading' || f.state === 'success') && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-bolt-blue to-bolt-cyan h-2 rounded-full transition-all duration-500" style={{ width: `${f.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={handleBatchCancel} className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:transform hover:scale-105 text-sm sm:text-base">
        <div className="flex items-center justify-center space-x-2">
          <X className="w-4 h-4" />
          <span>Cancel All Uploads</span>
        </div>
      </button>
    </div>
  );

  const SuccessState = ({ isBatch = false }: { isBatch?: boolean }) => (
    <div className="text-center space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm sm:text-base">Upload Complete!</h4>
            <p className="text-sm text-slate-500">
              {isBatch ? `${batchFiles.length} files have been uploaded successfully` : 'Your file has been uploaded successfully'}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border border-bolt-light-blue rounded-2xl p-4 space-y-3">
        <div className="text-left">
          <p className="text-sm font-medium text-slate-700 mb-2">Download Link:</p>
          <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center space-x-2">
            <p className="flex-1 min-w-0 text-sm text-slate-600 truncate">https://directdrivex.com/download/xyz123</p>
            <button onClick={copyLink} className="flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-md transition-colors" title="Copy link">
              <Clipboard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <button className="bg-gradient-to-r from-bolt-blue to-bolt-mid-blue text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full">
          Open Download Page
        </button>
        <button onClick={resetAll} className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors w-full">
          Upload Another File
        </button>
      </div>
    </div>
  );

  const CancelledState = () => (
    <div className="text-center space-y-4">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
            <X className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm sm:text-base">Upload Cancelled</h4>
            <p className="text-sm text-slate-500 truncate">{selectedFile?.name} upload was cancelled</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <button onClick={resetAll} className="bg-gradient-to-r from-bolt-blue to-bolt-mid-blue text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full">
          Start New Upload
        </button>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center space-y-4">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-sm">
            <X className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h4 className="font-semibold text-slate-900">Upload Failed</h4>
            <p className="text-sm text-slate-500">Please try again</p>
          </div>
        </div>
      </div>
      <button onClick={resetAll} className="w-full bg-gradient-to-r from-bolt-blue to-bolt-mid-blue text-white font-bold py-3 px-6 rounded-lg">
        Try Again
      </button>
    </div>
  );

  const BatchCancelledState = () => (
    <div className="text-center space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <X className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-slate-900">Batch Upload Cancelled</h4>
            <p className="text-sm text-slate-500">All file uploads have been cancelled successfully</p>
          </div>
        </div>
      </div>
      <button onClick={resetAll} className="w-full bg-gradient-to-r from-bolt-blue to-bolt-mid-blue text-white font-bold py-3 px-6 rounded-lg">
        Start New Batch Upload
      </button>
    </div>
  );

  const renderContent = () => {
    if (currentState === 'selected') return <FileSelectedState />;
    if (currentState === 'uploading') return <UploadingState />;
    if (currentState === 'success') return <SuccessState />;
    if (currentState === 'cancelled') return <CancelledState />;
    if (currentState === 'error') return <ErrorState />;
    if (batchState === 'selected') return <BatchSelectedState />;
    if (batchState === 'processing') return <BatchProcessingState />;
    if (batchState === 'success') return <SuccessState isBatch />;
    if (batchState === 'cancelled') return <BatchCancelledState />;
    return <IdleState />;
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8 h-full">
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-bolt-blue px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Quick Upload</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Try it now</h3>
          <p className="text-sm sm:text-base text-slate-500">2GB limit for guests</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}