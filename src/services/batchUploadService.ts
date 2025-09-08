import { Observable } from '@/lib/observable';
import { UploadEvent } from './uploadService';
import { 
  BatchDetails, 
  BatchFileMetadata, 
  BatchDownloadResponse, 
  ZipDownloadResponse,
  MockBatchData 
} from '@/types/batch-download';
import { toastService } from './toastService';

export interface BatchFileInfo {
  filename: string;
  size: number;
  content_type: string;
}

export interface BatchInitResponse {
  batch_id: string;
  files: Array<{
    file_id: string;
    original_filename: string;
    gdrive_upload_url: string;
  }>;
}

export class BatchUploadService {
  private apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  private wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws_api';

  async initiateBatch(files: BatchFileInfo[]): Promise<BatchInitResponse> {
    const response = await fetch(`${this.apiUrl}/api/v1/batch/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files })
    });

    if (!response.ok) throw new Error(`Batch initiation failed: ${response.status}`);
    return response.json();
  }

  uploadBatchFile(fileId: string, gdriveUrl: string, file: File): Observable<UploadEvent> {
    return new Observable(observer => {
      const wsUrl = `${this.wsUrl}/upload_parallel/${fileId}?gdrive_url=${encodeURIComponent(gdriveUrl)}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        this.sliceAndSend(file, ws);
      };
      
      ws.onmessage = (event) => {
        try {
          const jsonMessage = JSON.parse(event.data);
          observer.next(jsonMessage as UploadEvent);
          if (jsonMessage.type === 'success') observer.complete();
        } catch {
          // Handle string format
          const message = event.data;
          if (message.startsWith('PROGRESS:')) {
            observer.next({ type: 'progress', value: parseInt(message.split(':')[1]) });
          } else if (message.startsWith('SUCCESS:')) {
            observer.next({ type: 'success', value: message.split(':')[1] });
            observer.complete();
          }
        }
      };
      
      ws.onerror = () => observer.error(new Error('Connection failed'));
    });
  }

  async getBatchDetails(batchId: string): Promise<BatchDetails> {
    try {
      console.log('Fetching batch details for:', batchId);
      const response = await fetch(`${this.apiUrl}/api/v1/batch/${batchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch batch details: ${response.status}`);
      }

      const files: BatchFileMetadata[] = await response.json();
      
      console.log('Batch details loaded successfully from API');
      
      // Convert Angular format to React format
      const totalSizeBytes = files.reduce((sum, file) => sum + file.size_bytes, 0);
      
      return {
        batch_id: batchId,
        total_files: files.length,
        total_size_bytes: totalSizeBytes,
        total_size_formatted: this.formatFileSize(totalSizeBytes),
        created_at: new Date().toISOString(),
        files: files,
        status: 'ready',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
    } catch (error) {
      console.warn("Backend not available for batch details, using mock data:", error);
      
      // Show error toast
      toastService.error('Failed to load batch details. Using sample data.');
      
      // Return enhanced mock data when backend is not available
      const mockFiles: BatchFileMetadata[] = [
        { 
          _id: 'file1', 
          filename: 'Q3_Financial_Report_Final.pdf', 
          size_bytes: 2345678,
          size_formatted: '2.2 MB',
          content_type: 'application/pdf',
          upload_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          download_url: `${this.apiUrl}/api/v1/download/stream/file1`
        },
        { 
          _id: 'file2', 
          filename: 'Marketing_Campaign_Assets.zip', 
          size_bytes: 157286400,
          size_formatted: '150.0 MB',
          content_type: 'application/zip',
          upload_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          download_url: `${this.apiUrl}/api/v1/download/stream/file2`
        },
        { 
          _id: 'file3', 
          filename: 'Project_Alpha_Source_Code.tar.gz', 
          size_bytes: 89128960,
          size_formatted: '85.0 MB',
          content_type: 'application/gzip',
          upload_date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          download_url: `${this.apiUrl}/api/v1/download/stream/file3`
        },
        { 
          _id: 'file4', 
          filename: 'Team_Meeting_Recording.mp4', 
          size_bytes: 314572800,
          size_formatted: '300.0 MB',
          content_type: 'video/mp4',
          upload_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          download_url: `${this.apiUrl}/api/v1/download/stream/file4`
        },
        { 
          _id: 'file5', 
          filename: 'Database_Backup_2024.sql', 
          size_bytes: 52428800,
          size_formatted: '50.0 MB',
          content_type: 'application/sql',
          upload_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          download_url: `${this.apiUrl}/api/v1/download/stream/file5`
        }
      ];

      const totalSizeBytes = mockFiles.reduce((sum, file) => sum + file.size_bytes, 0);
      
      return {
        batch_id: batchId,
        total_files: mockFiles.length,
        total_size_bytes: totalSizeBytes,
        total_size_formatted: this.formatFileSize(totalSizeBytes),
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        files: mockFiles,
        status: 'ready',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
  }

  getStreamUrl(fileId: string): string {
    return `${this.apiUrl}/api/v1/download/stream/${fileId}`;
  }

  getZipDownloadUrl(batchId: string): string {
    return `${this.apiUrl}/api/v1/batch/download-zip/${batchId}`;
  }

  async getZipDownloadUrlWithAuth(batchId: string): Promise<string> {
    try {
      // Try to get authenticated ZIP download URL
      const response = await fetch(`${this.apiUrl}/api/v1/batch/zip-url/${batchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: ZipDownloadResponse = await response.json();
        if (data.success && data.download_url) {
          return data.download_url;
        }
      }
    } catch (error) {
      console.warn('Failed to get authenticated ZIP URL, using direct URL:', error);
    }

    // Fallback to direct URL
    return this.getZipDownloadUrl(batchId);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getFileIcon(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'zip':
      case 'rar':
      case '7z':
        return '📦';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'mp3':
      case 'wav':
      case 'flac':
        return '🎵';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'sql':
        return '🗄️';
      case 'tar':
      case 'gz':
        return '📁';
      default:
        return '📄';
    }
  }

  private sliceAndSend(file: File, ws: WebSocket, start: number = 0): void {
    const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks
    
    if (start >= file.size) {
      ws.send("DONE");
      return;
    }

    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(e.target.result);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = btoa(binary);
        
        ws.send(JSON.stringify({ bytes: base64Data }));
        
        setTimeout(() => {
          this.sliceAndSend(file, ws, end);
        }, 100);
      }
    };
    
    reader.readAsArrayBuffer(chunk);
  }
}

export const batchUploadService = new BatchUploadService();