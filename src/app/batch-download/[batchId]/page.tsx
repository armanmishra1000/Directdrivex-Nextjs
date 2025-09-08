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
      <div className="flex items-center justify-center min-h-screen p-4 bg-white sm:p-6 lg:p-8">
        <div className="text-center">
          <div className="inline-block p-6 mb-6 bg-white border border-gray-100 shadow-xl rounded-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-bolt-blue rounded-2xl">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-bolt-black">Loading Batch</h3>
            <p className="text-gray-600">Fetching your files...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-white sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-red-100 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-bolt-black">
              Unable to Load Batch
            </h2>
            <p className="mb-8 leading-relaxed text-gray-600">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-3 px-8 py-3 mx-auto font-bold text-white transition-all duration-300 group bg-bolt-blue hover:bg-bolt-purple rounded-xl hover:shadow-xl hover:shadow-bolt-blue/25 hover:-translate-y-1"
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
      <div className="flex items-center justify-center min-h-screen p-4 bg-white sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-yellow-100 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-bolt-black">
              Invalid Batch ID
            </h2>
            <p className="leading-relaxed text-gray-600">
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
      <div className="flex items-center justify-center min-h-screen p-4 bg-white sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-red-100 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-bolt-black">
              Batch Not Found
            </h2>
            <p className="mb-8 leading-relaxed text-gray-600">
              The requested batch could not be found or may have expired.
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-3 px-8 py-3 mx-auto font-bold text-white transition-all duration-300 group bg-bolt-blue hover:bg-bolt-purple rounded-xl hover:shadow-xl hover:shadow-bolt-blue/25 hover:-translate-y-1"
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
    <div className="min-h-screen p-4 bg-white sm:p-6 lg:p-8">
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