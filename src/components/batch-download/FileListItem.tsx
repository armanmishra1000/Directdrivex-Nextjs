"use client";

import { FileListItemProps } from '@/types/batch-download';
import { Download, FileText, Calendar } from 'lucide-react';
import { batchUploadService } from '@/services/batchUploadService';

export function FileListItem({ 
  file, 
  onDownload, 
  formatFileSize, 
  index 
}: FileListItemProps) {
  const handleDownload = () => {
    onDownload(file);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = () => {
    return batchUploadService.getFileIcon(file.filename);
  };

  const getFileTypeColor = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'text-red-400';
      case 'zip':
      case 'rar':
      case '7z':
        return 'text-yellow-400';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'text-purple-400';
      case 'mp3':
      case 'wav':
      case 'flac':
        return 'text-green-400';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'text-pink-400';
      case 'doc':
      case 'docx':
        return 'text-blue-400';
      case 'xls':
      case 'xlsx':
        return 'text-green-500';
      case 'ppt':
      case 'pptx':
        return 'text-orange-400';
      case 'sql':
        return 'text-cyan-400';
      case 'tar':
      case 'gz':
        return 'text-gray-400';
      default:
        return 'text-bolt-cyan';
    }
  };

  return (
    <div className="group flex items-center p-4 bg-white border border-gray-200 rounded-2xl hover:border-bolt-blue/30 hover:shadow-lg hover:shadow-bolt-blue/10 transition-all duration-300 hover:-translate-y-0.5">
      {/* File Icon */}
      <div className="flex-shrink-0 mr-4">
        <div className="relative">
          <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl ${getFileTypeColor(file.filename)} group-hover:scale-110 transition-transform duration-300`}>
            {getFileIcon()}
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-bolt-blue rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{index + 1}</span>
          </div>
        </div>
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="text-bolt-black font-semibold truncate group-hover:text-bolt-blue transition-colors text-lg">
            {file.filename}
          </h4>
          {file.content_type && (
            <span className="text-xs font-bold text-bolt-blue bg-bolt-blue/10 px-3 py-1 rounded-full border border-bolt-blue/20">
              {file.content_type.split('/')[1]?.toUpperCase() || 'FILE'}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-1 bg-gray-100 rounded-md">
              <FileText className="w-3 h-3" />
            </div>
            <span className="font-medium">{file.size_formatted || formatFileSize(file.size_bytes)}</span>
          </div>
          
          {file.upload_date && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1 bg-gray-100 rounded-md">
                <Calendar className="w-3 h-3" />
              </div>
              <span className="font-medium">{formatDate(file.upload_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Download Button */}
      <div className="flex-shrink-0 ml-4">
        <button
          onClick={handleDownload}
          className="group/btn bg-bolt-blue hover:bg-bolt-purple text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-bolt-blue/25 hover:-translate-y-1 flex items-center gap-2 opacity-0 group-hover:opacity-100"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover/btn:bg-white/30 transition-colors">
            <Download className="w-4 h-4" />
          </div>
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}