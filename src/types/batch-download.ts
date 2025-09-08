// Batch Download Type Definitions
// Based on Angular IFileMetadata interface and batch operations

export interface BatchFileMetadata {
  _id: string;
  filename: string;
  size_bytes: number;
  size_formatted?: string;
  content_type?: string;
  upload_date?: string;
  download_url?: string;
}

export interface BatchDetails {
  batch_id: string;
  total_files: number;
  total_size_bytes: number;
  total_size_formatted: string;
  created_at: string;
  files: BatchFileMetadata[];
  status: 'processing' | 'ready' | 'expired' | 'error';
  expires_at?: string;
}

export interface BatchDownloadResponse {
  success: boolean;
  data?: BatchDetails;
  error?: string;
  message?: string;
}

export interface ZipDownloadResponse {
  success: boolean;
  download_url?: string;
  expires_at?: string;
  error?: string;
}

// Service method return types
export type GetBatchDetailsResult = BatchDetails | null;
export type GetZipDownloadUrlResult = string;
export type GetStreamUrlResult = string;

// Hook state interface
export interface UseBatchDownloadReturn {
  batchDetails: BatchDetails | null;
  loading: boolean;
  error: string | null;
  retry: () => Promise<void>;
  zipDownloadUrl: string | null;
  getFileDownloadUrl: (fileId: string) => string;
  formatFileSize: (bytes: number) => string;
}

// Component props interfaces
export interface BatchDownloadCardProps {
  batchDetails: BatchDetails;
  zipDownloadUrl: string | null;
  onFileDownload: (file: BatchFileMetadata) => void;
  formatFileSize: (bytes: number) => string;
}

export interface FileListItemProps {
  file: BatchFileMetadata;
  onDownload: (file: BatchFileMetadata) => void;
  formatFileSize: (bytes: number) => string;
  index: number;
}

// Error types
export interface BatchDownloadError {
  type: 'network' | 'not_found' | 'expired' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
}

// Mock data types for development
export interface MockBatchData {
  batch_id: string;
  files: BatchFileMetadata[];
  created_at: string;
  status: 'ready';
}