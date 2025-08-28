import { Observable } from '@/lib/observable';
import { UploadEvent } from './uploadService';

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
