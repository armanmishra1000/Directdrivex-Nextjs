export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
export type FileStatus = 'completed' | 'pending' | 'uploading' | 'failed' | 'deleted' | 'quarantined';
export type StorageLocation = 'gdrive' | 'hetzner';

// Enhanced FileItem interface matching Angular exactly
export interface FileItem {
  _id: string; // Match Angular exactly
  filename: string;
  size_bytes: number;
  size_formatted: string;
  content_type: string;
  file_type: FileType;
  upload_date: string;
  owner_email: string;
  status: FileStatus;
  storage_location: StorageLocation;
  download_url: string;
  preview_available?: boolean;
  integrity_hash?: string;
  version: number;
}

// Legacy interface for backward compatibility
export interface LegacyFileItem {
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

// Storage stats matching Angular response
export interface StorageStats {
  total_files: number;
  total_storage: number;
  total_storage_formatted: string;
  average_file_size: number;
  gdrive_files: number;
  hetzner_files: number;
}

// File type analytics matching Angular exactly
export interface FileTypeAnalytics {
  file_types: {
    _id: string;
    count: number;
    total_size: number;
    percentage: number;
    size_formatted: string;
  }[];
  total_files: number;
}

// File list response matching Angular exactly
export interface FileListResponse {
  files: FileItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  storage_stats: StorageStats;
}

// File list parameters matching Angular exactly
export interface FileListParams {
  page: number;
  limit: number;
  sort_by: string;
  sort_order: string;
  search?: string;
  file_type?: string;
  owner_email?: string;
  storage_location?: string;
  file_status?: string;
  size_min?: number;
  size_max?: number;
}

// File operation results
export interface IntegrityResult {
  status: 'verified' | 'corrupted' | 'inaccessible';
  checksum_match?: boolean;
  last_check?: string;
  corruption_detected?: boolean;
  corruption_type?: string;
  error?: string;
}

export interface MoveResult {
  success: boolean;
  target_location: string;
  message: string;
}

export interface BackupResult {
  success: boolean;
  backup_path: string;
  message: string;
}

export interface RecoveryResult {
  success: boolean;
  message: string;
  backup_used?: string;
}

export interface BulkActionResult {
  success: boolean;
  message: string;
  files_affected: number;
  failed_files?: string[];
}

// Orphaned files management
export interface OrphanedFile extends FileItem {
  orphan_reason: string;
}

export interface OrphanedFilesResponse {
  orphaned_files: OrphanedFile[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CleanupResult {
  success: boolean;
  message: string;
  files_affected: number;
  cleanup_type: 'soft' | 'hard';
  days_old: number;
}

// File preview
export interface PreviewData {
  preview_url: string;
  file_type: string;
  available: boolean;
}

// Enhanced filter state
export interface FilterState {
  search: string;
  type: FileType | 'all';
  owner: string;
  storage: StorageLocation | 'all';
  status: FileStatus | 'all';
  sizeMin: number;
  sizeMax: number;
}

// Enhanced sort config
export interface SortConfig {
  key: string; // Allow any sortable field
  direction: 'asc' | 'desc';
}

// Pagination state
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ADD: Mapping utility for legacy compatibility
export function mapLegacyToFileItem(legacy: any): FileItem {
  return {
    _id: legacy.id || legacy._id,
    filename: legacy.name || legacy.filename,
    size_bytes: legacy.size || legacy.size_bytes,
    size_formatted: legacy.size_formatted || formatBytes(legacy.size || legacy.size_bytes),
    content_type: legacy.content_type || 'application/octet-stream',
    file_type: legacy.type || legacy.file_type,
    upload_date: legacy.date || legacy.upload_date,
    owner_email: legacy.owner || legacy.owner_email,
    status: legacy.status,
    storage_location: legacy.storage || legacy.storage_location,
    download_url: legacy.download_url || `/api/files/${legacy.id || legacy._id}/download`,
    preview_available: legacy.preview_available,
    integrity_hash: legacy.integrityHash || legacy.integrity_hash,
    version: legacy.version || 1
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}