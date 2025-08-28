"use client";

import { BatchUploadState, FileState, UploadState } from '@/types/upload';
import { QuotaInfo, UploadEvent, BatchFileInfo } from '@/types/api';
import { Check, CheckCircle2, Clipboard, CloudUpload, File as FileIconLucide, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { UploadService } from '@/services/uploadService';
import { BatchUploadService } from '@/services/batchUploadService';
import { AuthService } from '@/services/authService';
import { QuotaDisplay } from '@/components/ui/QuotaDisplay';
import { getFileSize, getFileTypeInfo, validateFileSize, validateBatchFiles, validateFileCount, copyToClipboard } from '@/lib/fileUtils';
import { AnalyticsService } from '@/services/analyticsService';

const MAX_FILES = 5;

export function UploadWidget() {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Services
  const uploadService = new UploadService();
  const batchUploadService = new BatchUploadService();
  const authService = new AuthService();

  // Single file state
  const [currentState, setCurrentState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  // Batch file state
  const [batchState, setBatchState] = useState<BatchUploadState>('idle');
  const [batchFiles, setBatchFiles] = useState<FileState[]>([]);
  const [finalBatchLink, setFinalBatchLink] = useState<string | null>(null);

  // Quota and authentication state
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load quota and check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const auth = authService.isAuthenticated();
      setIsAuthenticated(auth);
    };

    const loadQuota = async () => {
      setQuotaLoading(true);
      try {
        const quota = await uploadService.getQuotaInfo();
        setQuotaInfo(quota);
        
        // Track quota information
        AnalyticsService.trackQuotaInfo({
          user_type: quota.user_type,
          daily_limit_gb: quota.daily_limit_gb,
          current_usage_gb: quota.current_usage_gb,
          remaining_gb: quota.remaining_gb,
          usage_percentage: quota.usage_percentage
        });
      } catch (error) {
        console.error('Failed to load quota info:', error);
      } finally {
        setQuotaLoading(false);
      }
    };

    checkAuth();
    loadQuota();
    
    // Track homepage view
    AnalyticsService.trackHomepageViewed();
  }, []);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // Reset state
    resetAll();
    
    if (files.length === 1) {
      const file = files[0];
      
      // Validate file size
      if (!validateFileSize(file, isAuthenticated)) {
        const limitText = isAuthenticated ? '5GB' : '2GB';
        toast.error(`File size exceeds ${limitText} limit for ${isAuthenticated ? 'authenticated' : 'anonymous'} users`);
        return;
      }
      
      setSelectedFile(file);
      setCurrentState('selected');
      setBatchState('idle');
      setBatchFiles([]);
      
      // Track file selection
      AnalyticsService.trackFileSelected({
        file_type: file.type || 'unknown',
        file_size: file.size,
        upload_type: 'single'
      });
    } else {
      if (!validateFileCount(Array.from(files))) {
        toast.error(`You can upload a maximum of ${MAX_FILES} files at a time.`);
        return;
      }
      
      const fileArray = Array.from(files);
      
      // Validate batch files
      if (!validateBatchFiles(fileArray, isAuthenticated)) {
        const limitText = isAuthenticated ? '5GB' : '2GB';
        toast.error(`Total file size exceeds ${limitText} daily limit`);
        return;
      }
      
      setBatchFiles(fileArray.map(file => ({
        id: crypto.randomUUID(),
        file,
        state: 'pending',
        progress: 0,
      })));
      setBatchState('selected');
      setCurrentState('idle');
      setSelectedFile(null);
      
      // Track batch file selection
      AnalyticsService.trackFileSelected({
        file_type: 'batch',
        file_size: fileArray.reduce((sum, f) => sum + f.size, 0),
        upload_type: 'batch',
        file_count: fileArray.length
      });
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
    setDownloadLink(null);
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
    setDownloadLink(null);
    setBatchState('idle');
    setBatchFiles([]);
    setFinalBatchLink(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Real upload implementation
  const handleUpload = () => {
    if (!selectedFile || currentState === 'uploading') return;

    setCurrentState('uploading');
    setUploadProgress(0);
    setIsCancelling(false);
    setDownloadLink(null);
    
    // Track upload started
    AnalyticsService.trackUploadStarted({
      file_name: selectedFile.name,
      file_size: selectedFile.size,
      file_type: selectedFile.type || 'unknown',
      upload_type: 'single'
    });

    try {
      const uploadObservable = uploadService.upload(selectedFile);
      
      const subscription = uploadObservable.subscribe({
        next: (event: UploadEvent) => {
          if (event.type === 'progress') {
            setUploadProgress(event.value as number);
          } else if (event.type === 'success') {
            setCurrentState('success');
            // Extract file ID from the API path
            const fileId = typeof event.value === 'string' ? event.value.split('/').pop() : event.value;
            // Generate frontend route URL like batch downloads (not direct API URL)
            const link = `${window.location.origin}/download/${fileId}`;
            setDownloadLink(link);
            toast.success('File uploaded successfully!');
            
            // Track upload completion
            AnalyticsService.trackUploadCompleted({
              file_name: selectedFile.name,
              file_size: selectedFile.size,
              file_type: selectedFile.type || 'unknown',
              file_id: fileId as string,
              upload_type: 'single'
            });
            
            // Refresh quota info after successful upload
            loadQuotaInfo();
          }
        },
        error: (err) => {
          if (!isCancelling) {
            setCurrentState('error');
            toast.error('Upload failed: ' + err.message);
            
            // Track upload failure
            AnalyticsService.trackUploadFailed({
              file_name: selectedFile.name,
              file_size: selectedFile.size,
              file_type: selectedFile.type || 'unknown',
              error_message: err.message,
              progress_at_failure: uploadProgress,
              upload_type: 'single'
            });
          }
        },
        complete: () => {
          // Upload completed successfully
        }
      });

      // Store subscription for cleanup
      return () => subscription.unsubscribe();
    } catch (error) {
      setCurrentState('error');
      toast.error('Failed to start upload');
    }
  };

  // Real batch upload implementation
  const handleBatchUpload = async () => {
    if (batchFiles.length === 0 || batchState === 'processing') return;

    setBatchState('processing');
    setFinalBatchLink(null);
    
    // Track batch upload started
    AnalyticsService.trackUploadStarted({
      file_name: `Batch of ${batchFiles.length} files`,
      file_size: batchFiles.reduce((sum, f) => sum + f.file.size, 0),
      file_type: 'batch',
      upload_type: 'batch'
    });

    try {
      // Initiate batch
      const response = await batchUploadService.initiateBatch(
        batchFiles.map(f => ({
          filename: f.file.name,
          size: f.file.size,
          content_type: f.file.type || 'application/octet-stream'
        }))
      );

      console.log(`[UPLOAD_WIDGET] Batch initiated successfully for ${response.files.length} files, batch_id: ${response.batch_id}`);

      // Upload each file in parallel
      const uploadPromises = response.files.map(async (fileInfo) => {
        const matchingFile = batchFiles.find(bf => bf.file.name === fileInfo.original_filename);
        if (matchingFile) {
          const observable = batchUploadService.uploadBatchFile(
            fileInfo.file_id, 
            fileInfo.gdrive_upload_url, 
            matchingFile.file
          );
          
          observable.subscribe({
            next: (event) => {
              if (event.type === 'progress') {
                setBatchFiles(files => files.map(f => 
                  f.id === matchingFile.id ? { ...f, progress: event.value as number, state: 'uploading' } : f
                ));
              } else if (event.type === 'success') {
                setBatchFiles(files => files.map(f => 
                  f.id === matchingFile.id ? { ...f, state: 'success', progress: 100 } : f
                ));
                checkBatchCompletion(response.batch_id);
              }
            },
            error: (err) => {
              setBatchFiles(files => files.map(f => 
                f.id === matchingFile.id ? { ...f, state: 'error', error: err.message } : f
              ));
              checkBatchCompletion(response.batch_id);
            },
            complete: () => {
              // File upload completed
            }
          });
        }
      });

      // Wait for all uploads to start
      await Promise.all(uploadPromises);
    } catch (error) {
      setBatchState('error');
      toast.error('Batch upload failed to start');
    }
  };

  const checkBatchCompletion = (batchId: string) => {
    const allCompleted = batchFiles.every(f => f.state === 'success' || f.state === 'error');
    if (allCompleted) {
      setBatchState('success');
      setFinalBatchLink(`${window.location.origin}/batch-download/${batchId}`);
      toast.success('All files uploaded successfully!');
      
      // Refresh quota info after successful batch upload
      loadQuotaInfo();
    }
  };

  const loadQuotaInfo = async () => {
    setQuotaLoading(true);
    try {
      const quota = await uploadService.getQuotaInfo();
      setQuotaInfo(quota);
    } catch (error) {
      console.error('Failed to load quota info:', error);
    } finally {
      setQuotaLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentState !== 'uploading') return;

    setIsCancelling(true);
    toast.info('Cancelling upload...');
    
    const cancelled = uploadService.cancelUpload();
    if (cancelled) {
      // Track upload cancellation
      AnalyticsService.trackUploadCancelled({
        file_name: selectedFile?.name,
        progress_at_cancellation: uploadProgress,
        upload_type: 'single'
      });
      
    setTimeout(() => {
      setCurrentState('cancelled');
      setIsCancelling(false);
        toast.success('Upload cancelled successfully');
        
        setTimeout(() => {
          resetAll();
    }, 1000);
      }, 500);
    } else {
      toast.info('Upload cancelled');
      resetAll();
    }
  };

  const handleBatchCancel = () => {
    if (batchState !== 'processing') return;

    setIsCancelling(true);
    toast.info('Cancelling all uploads...');
    
    // Track batch upload cancellation
    AnalyticsService.trackUploadCancelled({
      progress_at_cancellation: batchFiles.reduce((sum, f) => sum + f.progress, 0) / batchFiles.length,
      upload_type: 'batch'
    });
    
    // Cancel all uploading files
    setBatchFiles(files => files.map(f => {
      if (f.state === 'uploading') {
        return { ...f, state: 'cancelled', error: 'Upload cancelled by user' };
      }
      return f;
    }));
    
    setTimeout(() => {
    setBatchState('cancelled');
      setIsCancelling(false);
      toast.success('All uploads cancelled successfully');
      
      setTimeout(() => {
        resetAll();
      }, 2000);
    }, 500);
  };

  const copyLink = async (link: string) => {
    const success = await copyToClipboard(link);
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  const openDownloadLink = (link: string | null) => {
    if (link) {
      window.open(link, '_blank');
    }
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
      
      {/* Quota Display */}
      <QuotaDisplay quotaInfo={quotaInfo} loading={quotaLoading} />
      
      <div className="text-center">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 transition-transform rounded-full sm:w-16 sm:h-16 sm:mb-4 bg-gradient-to-br from-bolt-blue/10 to-bolt-blue/20 group-hover:scale-105 animate-float">
          <CloudUpload className="w-6 h-6 sm:w-8 sm:h-8 text-bolt-blue" />
        </div>
        <h3 className="mb-2 text-base font-semibold sm:text-lg text-slate-900">
          {isDragOver ? "✨ Drop files here" : "Drag & Drop up to 5 files here"}
        </h3>
        <div className="flex items-center justify-center my-4 sm:my-6">
          <div className="flex-1 h-px bg-slate-300"></div>
          <span className="px-3 text-xs font-medium sm:px-4 sm:text-sm text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>
        <div className="mb-3 sm:mb-4">
          <button className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-bolt-blue to-bolt-mid-blue rounded-xl shadow-lg hover:shadow-xl hover:from-bolt-mid-blue hover:to-bolt-blue focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5">
            <Plus className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
            Browse Files
          </button>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-400">
            Try it now - no signup required for {isAuthenticated ? '5GB' : '2GB'} (max 5 files)
          </div>
          <div className="text-xs font-medium text-slate-500">
            Bank-level encryption • Up to 30GB with account
          </div>
        </div>
      </div>
    </div>
  );

  const FileSelectedState = () => (
    <div className="space-y-3 text-center sm:space-y-4">
      <div className="p-4 border border-blue-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-sm border border-slate-200 ${getFileTypeInfo(selectedFile?.name || '').bgColor}`}>
            <div className={getFileTypeInfo(selectedFile?.name || '').color}>
              <FileIconLucide className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h4 className="text-sm font-semibold truncate text-slate-900 sm:text-base">
              {selectedFile?.name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              {getFileSize(selectedFile?.size || 0)} • Ready to upload
            </p>
            </div>
            <div className="flex-shrink-0">
            <button 
              onClick={removeSelectedFile} 
              className="flex items-center justify-center w-6 h-6 transition-all duration-200 bg-red-100 rounded-full sm:w-8 sm:h-8 hover:bg-red-200 hover:scale-110"
              title="Remove file"
            >
              <X className="w-3 h-3 text-red-600 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      <button
        onClick={handleUpload}
        className="w-full px-4 py-2 text-sm font-bold text-white transition-all shadow-lg bg-gradient-to-r from-bolt-blue to-bolt-mid-blue sm:py-3 sm:px-6 rounded-xl hover:shadow-xl hover:-translate-y-1 sm:text-base"
      >
          Upload File
        </button>
      </div>
    );

  const BatchFilesSelectedState = () => (
    <div className="space-y-3 text-center sm:space-y-4">
      <div className="p-4 border border-blue-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:p-6">
        <div className="flex items-center justify-center mb-3 space-x-2 sm:space-x-3 sm:mb-4">
          <div className="flex items-center justify-center w-10 h-10 shadow-sm sm:w-12 sm:h-12 bg-bolt-blue rounded-xl">
            <FileIconLucide className="w-5 h-5 text-white sm:w-6 sm:h-6" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold sm:text-lg text-slate-900">
              {batchFiles.length} Files Selected
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Ready for batch upload
            </p>
          </div>
        </div>

        {/* File list preview */}
        <div className="space-y-2 overflow-y-auto max-h-32 sm:max-h-48">
          {batchFiles.slice(0, 5).map((f) => (
            <div
              key={f.id}
              className="p-2 transition-shadow bg-white border shadow-sm border-slate-200 rounded-xl sm:p-3 hover:shadow-md"
            >
                <div className="flex items-center space-x-2 sm:space-x-3">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200 ${getFileTypeInfo(f.file.name).bgColor}`}>
                  <div className={getFileTypeInfo(f.file.name).color}>
                    <FileIconLucide className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium truncate text-slate-900 sm:text-sm">
                    {f.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getFileSize(f.file.size)}
                  </p>
                  </div>
                  <div className="flex-shrink-0">
                  <button 
                    onClick={(e) => removeBatchFile(f.id, e)} 
                    className="flex items-center justify-center w-5 h-5 transition-all duration-200 bg-red-100 rounded-full sm:w-6 sm:h-6 hover:bg-red-200 hover:scale-110"
                    title="Remove file"
                  >
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
          ))}
          {batchFiles.length > 5 && (
            <div className="py-2 text-center">
              <span className="px-2 py-1 text-xs bg-white border rounded-full sm:text-sm text-slate-500 sm:px-3 border-slate-200">
                +{batchFiles.length - 5} more files
              </span>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleBatchUpload}
        className="w-full px-4 py-2 text-sm font-bold text-white transition-all shadow-lg bg-gradient-to-r from-bolt-blue to-bolt-mid-blue sm:py-3 sm:px-6 rounded-xl hover:shadow-xl hover:-translate-y-1 sm:text-base"
      >
        Upload {batchFiles.length} Files (Max 5)
      </button>
    </div>
  );

  const UploadProgressState = () => (
    <div className="space-y-3 text-center sm:space-y-4">
      <div className="p-4 border border-blue-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:p-6">
        <div className="flex items-center mb-3 space-x-3 sm:space-x-4 sm:mb-4">
          <div className="flex items-center justify-center w-10 h-10 shadow-sm sm:w-12 sm:h-12 rounded-xl bg-slate-200">
            <Loader2 className="w-6 h-6 text-bolt-blue animate-spin" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h4 className="text-sm font-semibold truncate text-slate-900 sm:text-base">
              {selectedFile?.name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              Uploading... {uploadProgress}%
            </p>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full shadow-inner">
          <div
            className="h-2 transition-all duration-300 rounded-full shadow-sm bg-gradient-to-r from-bolt-blue to-bolt-mid-blue"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          </div>
      </div>

      <button
        onClick={handleCancel}
        disabled={isCancelling}
        className="px-4 py-2 text-sm font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 sm:py-3 sm:px-6 hover:from-red-500 hover:to-red-600 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
      >
        {isCancelling ? 'Cancelling...' : 'Cancel Upload'}
      </button>
      </div>
    );

  const BatchUploadProgressState = () => (
    <div className="space-y-3 text-center sm:space-y-4">
      <div className="p-4 border border-blue-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:p-6">
        <h3 className="mb-3 text-base font-semibold sm:text-lg text-slate-900 sm:mb-4">
          Uploading Files...
        </h3>
        <div className="space-y-3 overflow-y-auto max-h-48 sm:max-h-64">
          {batchFiles.map((f) => (
            <div
              key={f.id}
              className="p-3 transition-shadow bg-white border shadow-sm border-slate-200 rounded-xl sm:p-4 hover:shadow-md"
            >
                <div className="flex items-center space-x-2 sm:space-x-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200 ${
                  f.state === 'pending' ? 'bg-slate-100' :
                  f.state === 'uploading' ? 'bg-slate-200' :
                  f.state === 'success' ? 'bg-green-500' :
                  f.state === 'error' ? 'bg-red-500' :
                  'bg-orange-500'
                }`}>
                  {f.state === 'pending' && (
                    <FileIconLucide className="w-5 h-5 text-slate-600" />
                  )}
                  {f.state === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-bolt-blue animate-spin" />
                  )}
                  {f.state === 'success' && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                  {f.state === 'error' && (
                    <X className="w-5 h-5 text-white" />
                  )}
                  {f.state === 'cancelled' && (
                    <X className="w-5 h-5 text-white" />
                  )}
                  </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium truncate text-slate-900">
                    {f.file.name}
                  </p>
                    <p className="text-sm text-slate-500">
                      {getFileSize(f.file.size)}
                    {f.state === 'uploading' && ` • ${f.progress}%`}
                      {f.state === 'success' && ' • Complete'}
                    {f.state === 'error' && ' • Error'}
                    {f.state === 'cancelled' && ' • Cancelled'}
                    </p>
                  </div>
                </div>

              {/* Progress bar for uploading files */}
              {f.state === 'uploading' && (
                  <div className="mt-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 transition-all duration-300 rounded-full bg-gradient-to-r from-bolt-blue to-bolt-mid-blue"
                      style={{ width: `${f.progress}%` }}
                    ></div>
                  </div>
                  </div>
                )}
              </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleBatchCancel}
        disabled={isCancelling}
        className="px-4 py-2 text-sm font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 sm:py-3 sm:px-6 hover:from-red-500 hover:to-red-600 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
      >
        {isCancelling ? 'Cancelling All...' : 'Cancel All Uploads'}
      </button>
    </div>
  );

  const SuccessState = () => (
    <div className="space-y-4 text-center">
      <div className="p-6 border border-green-200 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 shadow-sm rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h4 className="text-sm font-semibold text-slate-900 sm:text-base">
              Upload Complete!
            </h4>
            <p className="text-sm text-slate-500">
              Your file has been uploaded successfully
            </p>
          </div>
        </div>
      </div>

      {downloadLink && (
        <div className="p-4 space-y-3 border border-blue-200 bg-blue-50 rounded-2xl">
        <div className="text-left">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Download Link:
            </p>
            <div className="flex items-center p-3 space-x-2 bg-white border rounded-lg border-slate-200">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate text-slate-600">
                  {downloadLink}
                </p>
              </div>
              <button
                onClick={() => copyLink(downloadLink)}
                className="flex-shrink-0 p-2 transition-colors rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                title="Copy link"
              >
              <Clipboard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => openDownloadLink(downloadLink)}
          className="w-full px-6 py-3 font-bold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-bolt-blue to-bolt-mid-blue hover:shadow-xl hover:-translate-y-1"
        >
          Open Download Page
        </button>
        <button
          onClick={resetAll}
          className="w-full px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Upload Another File
        </button>
      </div>
    </div>
  );

  const BatchSuccessState = () => (
    <div className="space-y-4 text-center">
      <div className="p-6 border border-green-200 bg-green-50 rounded-2xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-slate-900">
              Batch Upload Complete!
            </h4>
            <p className="text-sm text-slate-500">
              {batchFiles.length} files uploaded successfully
            </p>
          </div>
        </div>
      </div>

      {finalBatchLink && (
        <div className="p-4 space-y-3 border border-blue-200 bg-blue-50 rounded-2xl">
          <div className="text-left">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Batch Download Link:
            </p>
            <div className="flex items-center p-3 space-x-2 bg-white border rounded-lg border-slate-200">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate text-slate-600">
                  {finalBatchLink}
                </p>
              </div>
              <button
                onClick={() => copyLink(finalBatchLink)}
                className="flex-shrink-0 p-2 transition-colors rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                title="Copy link"
              >
                <Clipboard className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => openDownloadLink(finalBatchLink)}
          className="w-full px-6 py-3 font-bold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-bolt-blue to-bolt-mid-blue hover:shadow-xl hover:-translate-y-1"
        >
          Open Download Page
        </button>
        <button
          onClick={resetAll}
          className="w-full px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Upload Another Batch
        </button>
      </div>
    </div>
  );

  const CancelledState = () => (
    <div className="space-y-4 text-center">
      <div className="p-6 border border-orange-200 shadow-sm bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl animate-fade-in">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-500 shadow-sm rounded-xl">
            <X className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h4 className="text-sm font-semibold text-slate-900 sm:text-base">
              Upload Cancelled
            </h4>
            <p className="text-sm truncate text-slate-500">
              {selectedFile?.name} upload was cancelled
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <button
          onClick={resetAll}
          className="w-full px-6 py-3 font-bold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-bolt-blue to-bolt-mid-blue hover:shadow-xl hover:-translate-y-1"
        >
          Start New Upload
      </button>
      </div>
    </div>
  );

  const BatchCancelledState = () => (
    <div className="space-y-4 text-center">
      <div className="p-6 border border-orange-200 bg-orange-50 rounded-2xl animate-fade-in">
        <div className="flex items-center mb-4 space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-lg">
            <X className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-slate-900">
              Batch Upload Cancelled
            </h4>
            <p className="text-sm text-slate-500">
              All file uploads have been cancelled successfully
            </p>
          </div>
        </div>

        <div className="p-4 mb-4 bg-white border border-orange-100 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Cancelled Files</span>
            <span className="text-sm text-orange-600">{batchFiles.length} files</span>
          </div>
          <div className="mt-2 overflow-y-auto max-h-32">
            {batchFiles.map((f) => (
              <div key={f.id} className="flex items-center justify-between py-1">
                <span className="text-xs truncate text-slate-500">{f.file.name}</span>
                <span className="text-xs text-orange-500">Cancelled</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={resetAll}
          className="w-full px-6 py-3 font-bold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-bolt-blue to-bolt-mid-blue hover:shadow-xl hover:-translate-y-1"
        >
        Start New Batch Upload
      </button>
      </div>
    </div>
  );

  // Render based on current state
  const renderContent = () => {
    if (currentState === 'selected') {
      return <FileSelectedState />;
    } else if (currentState === 'uploading') {
      return <UploadProgressState />;
    } else if (currentState === 'success') {
      return <SuccessState />;
    } else if (currentState === 'cancelled') {
      return <CancelledState />;
    } else if (batchState === 'selected') {
      return <BatchFilesSelectedState />;
    } else if (batchState === 'processing') {
      return <BatchUploadProgressState />;
    } else if (batchState === 'success') {
      return <BatchSuccessState />;
    } else if (batchState === 'cancelled') {
      return <BatchCancelledState />;
    } else {
    return <IdleState />;
    }
  };

  return (
    <div className="h-full p-4 bg-white border shadow-lg premium-card rounded-2xl border-slate-200 sm:p-6 lg:p-8">
      <div className="mb-4 text-center sm:mb-6">
        <div className="inline-flex items-center px-2 py-1 mb-3 space-x-2 text-xs font-medium text-blue-700 rounded-full bg-blue-50 sm:px-3 sm:text-sm sm:mb-4">
          <CloudUpload className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Quick Upload</span>
        </div>
        <h3 className="mb-1 text-lg font-bold sm:text-xl text-slate-900 sm:mb-2">
          Try it now
        </h3>
        <p className="text-sm sm:text-base text-slate-500">
          {isAuthenticated ? '5GB' : '2GB'} limit for {isAuthenticated ? 'users' : 'guests'}
        </p>
      </div>

      {renderContent()}
    </div>
  );
}