"use client";

import { EnhancedVideoPlayer } from './EnhancedVideoPlayer';
import { fileService } from '@/services/fileService';

interface FilePreviewProps {
  fileId: string;
  fileName: string;
  previewType: 'video' | 'audio' | 'image' | 'pdf' | 'text' | 'unsupported';
}

export function FilePreview({ fileId, fileName, previewType }: FilePreviewProps) {
  const previewUrl = fileService.getPreviewStreamUrl(fileId);

  const renderPreview = () => {
    switch (previewType) {
      case 'video':
        return <EnhancedVideoPlayer src={previewUrl} fileName={fileName} />;
      case 'image':
        return <img src={previewUrl} alt={`Preview of ${fileName}`} className="max-w-full max-h-[70vh] rounded-lg shadow-lg" />;
      case 'audio':
        return <audio controls src={previewUrl} className="w-full" />;
      case 'pdf':
        return <iframe src={previewUrl} className="w-full h-[80vh] border-0 rounded-lg shadow-lg" title={`Preview of ${fileName}`} />;
      case 'text':
        return <iframe src={previewUrl} className="w-full h-[60vh] border bg-bolt-white dark:bg-bolt-black rounded-lg shadow-lg" title={`Preview of ${fileName}`} />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 flex justify-center">
      {renderPreview()}
    </div>
  );
}