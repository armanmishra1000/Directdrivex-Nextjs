export interface BackupSummary {
  total_files: number;
  backed_up_files: number;
  backup_percentage: number;
  in_progress: number;
  failed: number;
  total_backup_size: number; // in bytes
}

export interface BackupStatus {
  backup_summary: BackupSummary;
  hetzner_status: 'connected' | 'disconnected' | 'error' | 'not_configured';
}

export interface BackupQueueItem {
  id: string;
  filename: string;
  size_bytes: number;
  upload_date: string;
  backup_status: 'pending' | 'in_progress';
  user_id: string;
}

export interface BackupQueue {
  queue_files: BackupQueueItem[];
  total_in_queue: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface BackupFailure {
  id: string;
  filename: string;
  size_bytes: number;
  failed_at: string;
  backup_error: string;
  user_id: string;
}

export interface FailurePattern {
  error_type: string;
  count: number;
}