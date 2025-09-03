import { DriveFileItem, DriveStats, FileTypeAnalytics, FileType, BackupStatus } from '@/types/drive';

export const mockDriveStats: DriveStats = {
  total_files: 12345,
  total_storage: 1.5 * 1024 * 1024 * 1024 * 1024, // 1.5 TB
  total_storage_formatted: "1.5 TB",
  transferring_to_hetzner: 12,
  backed_up_to_hetzner: 12010,
  failed_backups: 3,
};

export const mockFileTypeAnalytics: FileTypeAnalytics = {
  file_types: [
    { _id: 'image', count: 4500, total_size: 0.5 * 1024 * 1024 * 1024 * 1024, percentage: 36.5, size_formatted: '0.5 TB' },
    { _id: 'video', count: 2000, total_size: 0.8 * 1024 * 1024 * 1024 * 1024, percentage: 16.2, size_formatted: '0.8 TB' },
    { _id: 'document', count: 3000, total_size: 0.1 * 1024 * 1024 * 1024 * 1024, percentage: 24.3, size_formatted: '0.1 TB' },
    { _id: 'archive', count: 1845, total_size: 0.08 * 1024 * 1024 * 1024 * 1024, percentage: 14.9, size_formatted: '80 GB' },
    { _id: 'audio', count: 1000, total_size: 0.02 * 1024 * 1024 * 1024 * 1024, percentage: 8.1, size_formatted: '20 GB' }
  ],
  total_files: 12345
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getContentType = (fileType: FileType): string => {
  const contentTypes = {
    image: 'image/jpeg', video: 'video/mp4', document: 'application/pdf',
    archive: 'application/zip', audio: 'audio/mpeg', other: 'application/octet-stream'
  };
  return contentTypes[fileType];
};

export const mockFiles: DriveFileItem[] = Array.from({ length: 100 }, (_, i) => {
  const types: FileType[] = ['image', 'video', 'document', 'archive', 'audio', 'other'];
  const statuses: BackupStatus[] = ['none', 'in_progress', 'completed', 'failed'];
  const owners = ['user@company.com', 'admin@company.com', 'guest@visitor.com', 'service-account@api.com'];
  const accounts = ['acc_1', 'acc_2', 'acc_3'];
  const extensions = { image: 'jpg', video: 'mp4', document: 'pdf', archive: 'zip', audio: 'mp3', other: 'dat' };

  const fileType = types[i % types.length];
  const date = new Date(Date.now() - i * 3600000 * Math.random());
  const sizeBytes = Math.floor(Math.random() * 1024 * 1024 * 100); // up to 100MB

  return {
    _id: `file_${i + 1}`,
    filename: `document_${i + 1}_${date.toISOString().split('T')[0]}.${extensions[fileType]}`,
    size_bytes: sizeBytes,
    size_formatted: formatBytes(sizeBytes),
    content_type: getContentType(fileType),
    file_type: fileType,
    upload_date: date.toISOString(),
    owner_email: owners[i % owners.length],
    gdrive_account_id: accounts[i % accounts.length],
    backup_status: statuses[i % statuses.length],
    download_url: `/api/files/${i + 1}/download`,
    preview_available: Math.random() > 0.3,
  };
});