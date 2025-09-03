export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
export type BackupStatus = 'none' | 'in_progress' | 'completed' | 'failed';

export interface DriveFileItem {
  _id: string;
  filename: string;
  size_bytes: number;
  size_formatted: string;
  content_type: string;
  file_type: FileType;
  upload_date: string;
  owner_email: string;
  gdrive_account_id: string;
  backup_status: BackupStatus;
  download_url: string;
  preview_available?: boolean;
}

export interface DriveStats {
  total_files: number;
  total_storage: number;
  total_storage_formatted: string;
  transferring_to_hetzner: number;
  backed_up_to_hetzner: number;
  failed_backups: number;
}

export interface FileTypeAnalyticsItem {
  _id: string;
  count: number;
  total_size: number;
  percentage: number;
  size_formatted: string;
}

export interface FileTypeAnalytics {
  file_types: FileTypeAnalyticsItem[];
  total_files: number;
}

export interface DriveFileListResponse {
  files: DriveFileItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  drive_stats: DriveStats;
}