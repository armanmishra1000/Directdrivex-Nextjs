export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
export type BackupStatus = 'completed' | 'failed' | 'in_progress' | 'not_backed_up';

export interface HetznerFileItem {
  _id: string;
  filename: string;
  size_bytes: number;
  size_formatted: string;
  content_type: string;
  file_type: FileType;
  upload_date: string;
  owner_email: string;
  gdrive_account_id: string;
  hetzner_remote_path: string;
  backup_status: BackupStatus;
  download_url: string;
  preview_available: boolean;
}

export interface HetznerStats {
  total_files: number;
  total_storage: number;
  total_storage_formatted: string;
  recent_backups: number; // 7-day count
  failed_backups: number;
}

export interface HetznerFileTypeAnalyticsItem {
  _id: string;
  count: number;
  total_size: number;
  percentage: number;
  size_formatted: string;
}

export interface HetznerFileTypeAnalytics {
  file_types: HetznerFileTypeAnalyticsItem[];
  total_files: number;
}

export interface HetznerFileListResponse {
  files: HetznerFileItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  hetzner_stats: HetznerStats;
}