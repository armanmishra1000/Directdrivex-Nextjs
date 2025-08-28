import { UploadEvent, QuotaInfo } from '@/types/api';

export class UploadService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  private wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';
  private currentWebSocket?: WebSocket;

  // Single file upload with WebSocket progress tracking
  upload(file: File): Observable<UploadEvent> {
    return new Observable(observer => {
      const wsUrl = `${this.wsUrl}/upload`;
      
      console.log(`[UPLOAD_SERVICE] Connecting to WebSocket: ${wsUrl}`);
      const ws = new WebSocket(wsUrl);
      this.currentWebSocket = ws;
      
      let connectionStartTime = Date.now();
      
      // Add connection timeout to prevent infinite waiting
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.error(`[UPLOAD_SERVICE] Connection timeout for file: ${file.name}`);
          ws.close();
          observer.error(new Error('Connection timeout - server may be unavailable'));
        }
      }, 30000); // 30 second timeout
      
      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        const connectionTime = Date.now() - connectionStartTime;
        console.log(`[DEBUG] 🔌 [UPLOAD_SERVICE] WebSocket opened successfully in ${connectionTime}ms`);
        console.log(`[DEBUG] 🔌 [UPLOAD_SERVICE] WebSocket readyState:`, ws.readyState);
        
        // Start sending file chunks
        this.sliceAndSend(file, ws, observer);
      };
      
      ws.onmessage = (event) => {
        console.log(`[DEBUG] 📨 [UPLOAD_SERVICE] WebSocket message received:`, {
          data: event.data,
          type: event.type
        });
        
        try {
          const message: any = JSON.parse(event.data);
          
          if (message.type === 'progress') {
            observer.next(message as UploadEvent);
          } else if (message.type === 'success') {
            observer.next(message as UploadEvent);
            observer.complete();
          } else if (message.type === 'error') {
            observer.error(new Error(message.value));
          }
        } catch (e) {
          console.error('[UPLOAD_SERVICE] Failed to parse message from server:', event.data);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('[UPLOAD_SERVICE] WebSocket error:', error);
        observer.error(new Error('Connection to server failed.'));
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log(`[DEBUG] 🔌 [UPLOAD_SERVICE] WebSocket closed:`, {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        
        if (!event.wasClean) {
          observer.error(new Error('Lost connection to server during upload.'));
        } else {
          observer.complete();
        }
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      };
    });
  }

  private sliceAndSend(file: File, ws: WebSocket, observer: Observer<UploadEvent>, start: number = 0): void {
    const chunkSize = 4 * 1024 * 1024; // 4MB chunks
    console.log(`[DEBUG] 🔪 sliceAndSend called - start: ${start}, file size: ${file.size}`);
    
    if (start >= file.size) {
      console.log(`[DEBUG] ✅ File upload complete, sending DONE message`);
      ws.send("DONE");
      return;
    }

    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    console.log(`[DEBUG] 📦 Chunk created - start: ${start}, end: ${end}, size: ${chunk.size} bytes`);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer && ws.readyState === WebSocket.OPEN) {
        // Convert ArrayBuffer to base64 and send as JSON
        const bytes = new Uint8Array(e.target.result);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = btoa(binary);
        
        const chunkMessage = {
          bytes: base64Data
        };
        
        console.log(`[DEBUG] 📤 Sending JSON chunk message with base64 data, length: ${base64Data.length}`);
        ws.send(JSON.stringify(chunkMessage));
        
        // Send next chunk
        setTimeout(() => {
          this.sliceAndSend(file, ws, observer, end);
        }, 100); // Small delay to prevent overwhelming the WebSocket
      } else {
        console.log(`[DEBUG] ❌ WebSocket not ready, state:`, ws.readyState);
      }
    };
    
    reader.onerror = (e) => {
      console.error(`[DEBUG] ❌ FileReader error:`, e);
      observer.error(new Error('Failed to read file chunk'));
    };
    
    console.log(`[DEBUG] 📖 Starting FileReader.readAsArrayBuffer for chunk`);
    reader.readAsArrayBuffer(chunk);
  }

  // Cancel current upload
  cancelUpload(): boolean {
    if (this.currentWebSocket) {
      this.currentWebSocket.close();
      this.currentWebSocket = undefined;
      return true;
    }
    return false;
  }

  // Get user quota information
  async getQuotaInfo(): Promise<QuotaInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/api/quota`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch quota info:', error);
      // Return default quota for anonymous users
      return {
        daily_limit_gb: 2,
        current_usage_gb: 0,
        remaining_gb: 2,
        usage_percentage: 0,
        user_type: 'anonymous'
      };
    }
  }
}

// Simple Observable implementation for WebSocket events
class Observable<T> {
  constructor(private subscribeFn: (observer: Observer<T>) => () => void) {}

  subscribe(observer: Observer<T>): { unsubscribe: () => void } {
    const cleanup = this.subscribeFn(observer);
    return {
      unsubscribe: cleanup
    };
  }
}

interface Observer<T> {
  next: (value: T) => void;
  error: (error: any) => void;
  complete: () => void;
}
