"use client";

import { useParams } from 'next/navigation';
import { useBatchDownload } from '@/hooks/use-batch-download';
import { BatchDownloadCard } from '@/components/batch-download/BatchDownloadCard';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { toastService } from '@/services/toastService';
import { BatchFileMetadata } from '@/types/batch-download';

export default function BatchDownloadPage() {
  const params = useParams();
  const batchId = typeof params.batchId === 'string' ? params.batchId : null;
  
  const {
    batchDetails,
    loading,
    error,
    retry,
    zipDownloadUrl,
    getFileDownloadUrl,
    formatFileSize
  } = useBatchDownload(batchId);

  const handleFileDownload = (file: BatchFileMetadata) => {
    try {
      const downloadUrl = getFileDownloadUrl(file._id);
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toastService.success(`Downloading ${file.filename}`);
    } catch (error) {
      console.error('Download error:', error);
      toastService.error(`Failed to download ${file.filename}`);
    }
  };

  const handleRetry = async () => {
    await retry();
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-bolt-black sm:p-6 lg:p-8">
        <div className="text-center">
          <div className="inline-block p-6 mb-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-bolt-blue rounded-xl">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-bolt-white">Loading Batch</h3>
            <p className="text-bolt-cyan/80">Fetching your files...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-bolt-black sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-bolt-white">
              Unable to Load Batch
            </h2>
            <p className="mb-8 leading-relaxed text-bolt-cyan/80">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-3 px-8 py-3 mx-auto font-bold text-white transition-all duration-300 group bg-gradient-to-r from-bolt-blue to-bolt-purple hover:from-bolt-purple hover:to-bolt-blue rounded-xl hover:shadow-lg hover:shadow-bolt-cyan/20 hover:-translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5 transition-transform group-hover:rotate-180" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No Batch ID
  if (!batchId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-bolt-black sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-yellow-500/20 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-bolt-white">
              Invalid Batch ID
            </h2>
            <p className="leading-relaxed text-bolt-cyan/80">
              The batch ID in the URL is invalid or missing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No Batch Details
  if (!batchDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-bolt-black sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-bolt-white">
              Batch Not Found
            </h2>
            <p className="mb-8 leading-relaxed text-bolt-cyan/80">
              The requested batch could not be found or may have expired.
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-3 px-8 py-3 mx-auto font-bold text-white transition-all duration-300 group bg-gradient-to-r from-bolt-blue to-bolt-purple hover:from-bolt-purple hover:to-bolt-blue rounded-xl hover:shadow-lg hover:shadow-bolt-cyan/20 hover:-translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5 transition-transform group-hover:rotate-180" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success State - Show Batch Details
  return (
    <div className="min-h-screen p-4 bg-bolt-black sm:p-6 lg:p-8">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl">
          {/* Batch Download Card */}
          <BatchDownloadCard
            batchDetails={batchDetails}
            zipDownloadUrl={zipDownloadUrl}
            onFileDownload={handleFileDownload}
            formatFileSize={formatFileSize}
          />

        </div>
      </div>
    </div>
  );
}