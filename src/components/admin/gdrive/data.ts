import { GoogleDriveAccount, GoogleDriveStats, CacheInfo } from "@/types/gdrive";

export const mockStats: GoogleDriveStats = {
  total_accounts: 12,
  active_accounts: 8,
  total_storage_used: 847 * 1024 * 1024 * 1024, // 847 GB
  total_storage_quota: 2.5 * 1024 * 1024 * 1024 * 1024, // 2.5 TB
  average_performance: 94.2,
};

export const mockCacheInfo: CacheInfo = {
  status: 'fresh',
  last_updated: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
};

export const mockAccounts: GoogleDriveAccount[] = [
  {
    account_id: 'acc_1234567890',
    email: 'storage@directdrivex.iam.gserviceaccount.com',
    is_active: true,
    storage_used: 247 * 1024 * 1024 * 1024, // 247 GB
    storage_quota: 1000 * 1024 * 1024 * 1024, // 1 TB
    storage_percentage: 24.7,
    files_count: 12847,
    last_activity: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    health_status: 'healthy',
    performance_score: 96.2,
    folder_info: {
      folder_id: 'folder_xyz',
      folder_name: 'DirectDriveX Storage',
      folder_path: '/storage/directdrivex/main',
    },
    last_quota_check: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    data_freshness: 'fresh',
  },
  {
    account_id: 'acc_0987654321',
    email: 'backup-storage@directdrivex.iam.gserviceaccount.com',
    is_active: true,
    storage_used: 550 * 1024 * 1024 * 1024, // 550 GB
    storage_quota: 1000 * 1024 * 1024 * 1024, // 1 TB
    storage_percentage: 55.0,
    files_count: 34589,
    last_activity: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    health_status: 'warning',
    performance_score: 92.1,
    folder_info: {
      folder_id: 'folder_abc',
      folder_name: 'Backup Storage',
      folder_path: '/storage/directdrivex/backup',
    },
    last_quota_check: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    data_freshness: 'stale',
  },
  {
    account_id: 'acc_1122334455',
    email: 'archive-storage@directdrivex.iam.gserviceaccount.com',
    is_active: false,
    storage_used: 50 * 1024 * 1024 * 1024, // 50 GB
    storage_quota: 500 * 1024 * 1024 * 1024, // 500 GB
    storage_percentage: 10.0,
    files_count: 5234,
    last_activity: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    health_status: 'unknown',
    performance_score: 88.5,
    folder_info: {
      folder_id: 'folder_def',
      folder_name: 'Archive Storage',
      folder_path: '/storage/directdrivex/archive',
    },
    last_quota_check: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    data_freshness: 'stale',
  },
];