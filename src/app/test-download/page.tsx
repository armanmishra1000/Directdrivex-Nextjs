"use client";

import { useState } from 'react';
import { DownloadCard } from '@/components/download/DownloadCard';
import { FileMeta, PreviewMeta } from '@/types/download';

// Mock data for testing
const mockFileData: Record<string, { fileMeta: FileMeta; previewMeta: PreviewMeta }> = {
  'video-test': {
    fileMeta: {
      file_id: 'video-test',
      filename: 'DirectDriveX_Promo_Final.mp4',
      size_bytes: 28345678,
      content_type: 'video/mp4',
      created_at: new Date().toISOString()
    },
    previewMeta: {
      file_id: 'video-test',
      filename: 'DirectDriveX_Promo_Final.mp4',
      content_type: 'video/mp4',
      preview_available: true,
      preview_type: 'video',
      can_stream: true,
      suggested_action: 'preview',
      size_bytes: 28345678,
      media_info: {
        duration: 120,
        width: 1920,
        height: 1080,
        has_audio: true,
        format: 'MP4',
        bitrate: 2000,
        fps: 30
      }
    }
  },
  'image-test': {
    fileMeta: {
      file_id: 'image-test',
      filename: 'Company_Logo_Design.png',
      size_bytes: 125890,
      content_type: 'image/png',
      created_at: new Date().toISOString()
    },
    previewMeta: {
      file_id: 'image-test',
      filename: 'Company_Logo_Design.png',
      content_type: 'image/png',
      preview_available: true,
      preview_type: 'image',
      can_stream: true,
      suggested_action: 'preview',
      size_bytes: 125890,
      media_info: {
        width: 800,
        height: 600,
        format: 'PNG'
      }
    }
  },
  'audio-test': {
    fileMeta: {
      file_id: 'audio-test',
      filename: 'Podcast_Episode_01.mp3',
      size_bytes: 45000000,
      content_type: 'audio/mpeg',
      created_at: new Date().toISOString()
    },
    previewMeta: {
      file_id: 'audio-test',
      filename: 'Podcast_Episode_01.mp3',
      content_type: 'audio/mpeg',
      preview_available: true,
      preview_type: 'audio',
      can_stream: true,
      suggested_action: 'preview',
      size_bytes: 45000000,
      media_info: {
        duration: 1800,
        has_audio: true,
        format: 'MP3',
        bitrate: 128,
        sample_rate: 44100,
        channels: 2
      }
    }
  },
  'pdf-test': {
    fileMeta: {
      file_id: 'pdf-test',
      filename: 'Q3_Financial_Report.pdf',
      size_bytes: 2345678,
      content_type: 'application/pdf',
      created_at: new Date().toISOString()
    },
    previewMeta: {
      file_id: 'pdf-test',
      filename: 'Q3_Financial_Report.pdf',
      content_type: 'application/pdf',
      preview_available: true,
      preview_type: 'document',
      can_stream: true,
      suggested_action: 'preview',
      size_bytes: 2345678,
      media_info: {
        format: 'PDF'
      }
    }
  },
  'text-test': {
    fileMeta: {
      file_id: 'text-test',
      filename: 'release_notes.txt',
      size_bytes: 12345,
      content_type: 'text/plain',
      created_at: new Date().toISOString()
    },
    previewMeta: {
      file_id: 'text-test',
      filename: 'release_notes.txt',
      content_type: 'text/plain',
      preview_available: true,
      preview_type: 'text',
      can_stream: true,
      suggested_action: 'preview',
      size_bytes: 12345
    }
  },
  'unsupported-test': {
    fileMeta: {
      file_id: 'unsupported-test',
      filename: 'Project_Archive.zip',
      size_bytes: 123456789,
      content_type: 'application/zip',
      created_at: new Date().toISOString()
    },
    previewMeta: {
      file_id: 'unsupported-test',
      filename: 'Project_Archive.zip',
      content_type: 'application/zip',
      preview_available: false,
      preview_type: 'unsupported',
      can_stream: false,
      suggested_action: 'download',
      message: 'Preview is not available for .zip files.'
    }
  }
};

export default function TestDownloadPage() {
  const [selectedFile, setSelectedFile] = useState<string>('video-test');
  const currentData = mockFileData[selectedFile];

  return (
    <div className="min-h-screen bg-bolt-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-bolt-black mb-8 text-center">
          DirectDriveX Download Page Test
        </h1>
        
        {/* File Selection */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-bolt-cyan/20">
          <h2 className="text-xl font-semibold text-bolt-black mb-4">Test Different File Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(mockFileData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedFile(key)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedFile === key
                    ? 'border-bolt-blue bg-bolt-blue/10 text-bolt-blue'
                    : 'border-bolt-cyan/20 bg-white hover:border-bolt-blue/50 hover:bg-bolt-blue/5'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {data.fileMeta.content_type.split('/')[0].toUpperCase()}
                </div>
                <div className="text-xs text-bolt-black/70 truncate">
                  {data.fileMeta.filename}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Download Card */}
        {currentData && (
          <DownloadCard 
            fileMeta={currentData.fileMeta} 
            previewMeta={currentData.previewMeta} 
          />
        )}

        {/* Test Instructions */}
        <div className="mt-8 p-6 bg-bolt-cyan/5 rounded-2xl border border-bolt-cyan/20">
          <h3 className="text-lg font-semibold text-bolt-black mb-3">Test Instructions</h3>
          <ul className="space-y-2 text-sm text-bolt-black/70">
            <li>• Click different file type buttons to test various preview types</li>
            <li>• Test the preview toggle functionality</li>
            <li>• Verify BOLT color scheme is applied consistently</li>
            <li>• Test video player controls (play, pause, skip, volume, fullscreen)</li>
            <li>• Check error handling by testing with invalid URLs</li>
            <li>• Verify analytics tracking in browser console</li>
            <li>• Test responsive design on different screen sizes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
