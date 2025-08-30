export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
export type FileStatus = 'completed' | 'pending' | 'uploading' | 'failed';
export type StorageLocation = 'gdrive' | 'hetzner';

export interface AdminFile {
  id: string;
  filename: string;
  size: number; // in bytes
  type: FileType;
  owner: string; // email
  uploadDate: string; // ISO string
  status: FileStatus;
  storage: StorageLocation;
  previewAvailable: boolean;
}

export interface StorageStats {
  totalFiles: number;
  totalStorage: number; // in bytes
  gdriveFiles: number;
  hetznerFiles: number;
}

export interface FileTypeStat {
  type: FileType;
  count: number;
  size: number; // in bytes
  percentage: number;
}

export interface FileTypeAnalyticsData {
  fileTypes: FileTypeStat[];
  totalFiles: number;
}

export interface ModalState {
  type: 'integrity' | 'move' | 'bulkConfirm' | 'orphaned' | null;
  data: any;
}