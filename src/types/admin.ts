export enum UserRole {
  REGULAR = 'regular',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

// ... existing types ...

export type UserStatus = 'active' | 'suspended' | 'banned';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  files_count: number;
  storage_used: number; // in bytes
  created_at: string;
  last_login?: string;
}

// ... existing types ...

// NEW TYPES FOR FILE MANAGEMENT
export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
export type FileStatus = 'completed' | 'pending' | 'uploading' | 'failed';
export type StorageLocation = 'Google Drive' | 'Hetzner';

export interface AdminFile {
  id: string;
  filename: string;
  size: number; // in bytes
  type: FileType;
  owner: string;
  uploadDate: string;
  status: FileStatus;
  storageLocation: StorageLocation;
  previewUrl?: string;
}

export interface FileStats {
  totalFiles: number;
  totalStorage: number; // in bytes
  gdriveFiles: number;
  hetznerFiles: number;
  typeDistribution: Record<FileType, { count: number; size: number }>;
}

export interface FileModalState {
  type: 'delete' | 'quarantine' | 'recover' | 'move' | 'backup' | 'integrity' | 'preview' | 'cleanup' | 'bulk' | null;
  data: any;
}

export interface FilePaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FileSortConfig {
  key: keyof AdminFile;
  direction: 'asc' | 'desc';
}