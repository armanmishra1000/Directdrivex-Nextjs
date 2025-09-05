"use client";

import { useParams } from 'next/navigation';
import { useFileDownload } from '@/hooks/use-file-download';
import { DownloadCard } from '@/components/download/DownloadCard';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function DownloadPage() {
  const params = useParams();
  const fileId = typeof params.fileId === 'string' ? params.fileId : null;
  const { fileMeta, previewMeta, loading, error, retry } = useFileDownload(fileId);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center text-bolt-black/80">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-bolt-blue" />
          <p className="mt-4 text-lg">Loading file information...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-lg">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-bolt-black">Error Loading File</h2>
          <p className="mt-2 text-slate-600">{error}</p>
          <button
            onClick={retry}
            className="mt-6 px-6 py-2 font-semibold text-white rounded-lg bg-bolt-blue hover:bg-bolt-blue/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (fileMeta && previewMeta) {
      return <DownloadCard fileMeta={fileMeta} previewMeta={previewMeta} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-bolt-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {renderContent()}
    </div>
  );
}