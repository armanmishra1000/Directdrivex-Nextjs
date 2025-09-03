export interface GoogleDriveAccount {
  account_id: string;
  email: string;
  alias?: string;
  is_active: boolean;
  storage_used: number;
  storage_quota: number;
  storage_used_formatted?: string;
  storage_quota_formatted?: string;
  storage_percentage?: number;
  files_count: number;
  last_activity: string;
  health_status: 'healthy' | 'warning' | 'quota_warning' | 'critical' | 'unknown';
  performance_score: number;
  created_at?: string;
  updated_at?: string;
  folder_info?: {
    folder_id: string;
    folder_name: string;
    folder_path: string;
  };
  last_quota_check?: string;
  data_freshness?: 'fresh' | 'stale';
}

export interface GoogleDriveStats {
  total_accounts: number;
  active_accounts: number;
  total_storage_used: number;
  total_storage_quota: number;
  average_performance: number;
}

export interface CacheInfo {
  status: 'fresh' | 'stale' | 'error';
  last_updated: string;
}

export interface GoogleDriveAccountsResponse {
  accounts: GoogleDriveAccount[];
  statistics: GoogleDriveStats;
  cache_info?: CacheInfo;
}

export interface AddAccountRequest {
  service_account_key: string;
  account_email: string;
  account_alias: string;
}