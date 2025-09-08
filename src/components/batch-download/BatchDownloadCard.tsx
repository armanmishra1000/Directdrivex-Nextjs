"use client";

import { BatchDownloadCardProps } from '@/types/batch-download';
import { FileListItem } from './FileListItem';
import { Download, Archive, Clock, HardDrive } from 'lucide-react';
import { batchUploadService } from '@/services/batchUploadService';

export function BatchDownloadCard({ 
  batchDetails, 
  zipDownloadUrl, 
  onFileDownload, 
  formatFileSize 
}: BatchDownloadCardProps) {
  const handleZipDownload = () => {
    if (zipDownloadUrl) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = zipDownloadUrl;
      link.download = `batch-${batchDetails.batch_id}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-400';
      case 'processing':
        return 'text-yellow-400';
      case 'expired':
        return 'text-red-400';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-bolt-cyan';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Ready for Download';
      case 'processing':
        return 'Processing Files';
      case 'expired':
        return 'Download Expired';
      case 'error':
        return 'Error Processing';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
      {/* Header Section */}
      <div className="px-8 py-6 border-b border-cyan-500/20">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-bolt-blue rounded-xl">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-bolt-white">
                Files Ready for Download
              </h2>
            </div>
          </div>
          
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(batchDetails.status)} bg-bolt-cyan/10 border border-bolt-cyan/20`}>
              <div className="w-2 h-2 bg-bolt-cyan rounded-full"></div>
              {getStatusText(batchDetails.status)}
            </div>
            
            {batchDetails.status === 'ready' && zipDownloadUrl && (
              <button
                onClick={handleZipDownload}
                className="flex items-center gap-3 px-8 py-3 font-bold text-white transition-all duration-300 group bg-gradient-to-r from-bolt-blue to-bolt-purple hover:from-bolt-purple hover:to-bolt-blue rounded-xl hover:shadow-lg hover:shadow-bolt-cyan/20 hover:-translate-y-0.5"
              >
                <div className="p-1 transition-colors rounded-lg bg-white/20 group-hover:bg-white/30">
                  <Download className="w-5 h-5" />
                </div>
                <span>Download All (ZIP)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Batch Statistics */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="p-6 text-center transition-all duration-300 border border-white/10 group bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 hover:shadow-lg hover:shadow-bolt-cyan/20">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 transition-transform bg-bolt-blue rounded-xl group-hover:scale-110">
              <Archive className="w-6 h-6 text-white" />
            </div>
            <div className="mb-1 text-3xl font-bold text-bolt-white">{batchDetails.total_files}</div>
            <div className="text-sm font-semibold tracking-wide uppercase text-bolt-cyan">Total Files</div>
          </div>
          <div className="p-6 text-center transition-all duration-300 border border-white/10 group bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 hover:shadow-lg hover:shadow-bolt-cyan/20">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 transition-transform bg-bolt-cyan rounded-xl group-hover:scale-110">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <div className="mb-1 text-3xl font-bold text-bolt-white">{batchDetails.total_size_formatted}</div>
            <div className="text-sm font-semibold tracking-wide uppercase text-bolt-cyan">Total Size</div>
          </div>
          <div className="p-6 text-center transition-all duration-300 border border-white/10 group bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 hover:shadow-lg hover:shadow-bolt-cyan/20">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 transition-transform bg-bolt-purple rounded-xl group-hover:scale-110">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="mb-1 text-2xl font-bold text-bolt-white">
              {batchDetails.expires_at ? formatDate(batchDetails.expires_at) : 'N/A'}
            </div>
            <div className="text-sm font-semibold tracking-wide uppercase text-bolt-cyan">Expires</div>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="px-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full bg-bolt-blue"></div>
          <h3 className="text-xl font-bold text-bolt-black">
            Files in this batch ({batchDetails.files.length})
          </h3>
        </div>
        
        {batchDetails.files.length === 0 ? (
          <div className="py-12 text-center border-2 border-gray-200 border-dashed bg-gray-50 rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
              <Archive className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-medium text-gray-500">No files found in this batch</p>
          </div>
        ) : (
          <div className="pr-2 space-y-3 overflow-y-auto max-h-96">
            {batchDetails.files.map((file, index) => (
              <FileListItem
                key={file._id}
                file={file}
                onDownload={onFileDownload}
                formatFileSize={formatFileSize}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {batchDetails.status === 'ready' && (
        <div className="p-6 mx-8 mb-6 border border-blue-200 bg-blue-50 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-bolt-blue">
              <span className="text-sm text-white">💡</span>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-bolt-black">Download Tip</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                You can download all files as a ZIP archive or download individual files. 
                The ZIP download is faster for multiple files and preserves the folder structure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}