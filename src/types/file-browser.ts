export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
export type FileStatus = 'completed' | 'pending' | 'uploading' | 'failed' | 'deleted';
export type StorageLocation = 'gdrive' | 'hetzner';

export interface FileItem {
  id: string;
  name: string;
  size: number; // in bytes
  type: FileType;
  owner: string;
  date: string; // ISO string
  status: FileStatus;
  storage: StorageLocation;
  version: number;
  integrityHash?: string;
}

export interface StorageStats {
  totalFiles: number;
  totalStorage: number; // in bytes
  gdriveFiles: number;
  hetznerFiles: number;
}

export interface FileTypeAnalyticsData {
  type: FileType;
  fileCount: number;
  totalSize: number; // in bytes
}

export interface FilterState {
  search: string;
  type: FileType | 'all';
  owner: string;
  storage: StorageLocation | 'all';
  status: FileStatus | 'all';
  sizeMin: number;
  sizeMax: number;
}

export interface SortConfig {
  key: keyof FileItem;
  direction: 'asc' | 'desc';
}