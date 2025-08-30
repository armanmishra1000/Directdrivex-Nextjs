import { AdminFile, StorageStats, FileTypeAnalyticsData } from '@/types/admin-files';

export const mockFiles: AdminFile[] = [
  { id: 'file_01', filename: 'Q2-Financial-Report.pdf', size: 5242880, type: 'document', owner: 'finance@example.com', uploadDate: '2024-07-20T10:00:00Z', status: 'completed', storage: 'gdrive', previewAvailable: true },
  { id: 'file_02', filename: 'Marketing-Campaign-Assets.zip', size: 157286400, type: 'archive', owner: 'marketing@example.com', uploadDate: '2024-07-19T15:30:00Z', status: 'completed', storage: 'hetzner', previewAvailable: false },
  { id: 'file_03', filename: 'Product-Launch-Video-Final.mp4', size: 1073741824, type: 'video', owner: 'design@example.com', uploadDate: '2024-07-18T09:00:00Z', status: 'completed', storage: 'gdrive', previewAvailable: true },
  { id: 'file_04', filename: 'User-Avatars-Batch-1.png', size: 2097152, type: 'image', owner: 'support@example.com', uploadDate: '2024-07-17T12:45:00Z', status: 'pending', storage: 'gdrive', previewAvailable: true },
  { id: 'file_05', filename: 'System-Log-Archive.log', size: 536870912, type: 'other', owner: 'devops@example.com', uploadDate: '2024-07-16T23:00:00Z', status: 'failed', storage: 'hetzner', previewAvailable: false },
  { id: 'file_06', filename: 'Podcast-Interview-Audio.mp3', size: 83886080, type: 'audio', owner: 'media@example.com', uploadDate: '2024-07-15T11:00:00Z', status: 'uploading', storage: 'gdrive', previewAvailable: false },
];

export const mockStorageStats: StorageStats = {
  totalFiles: 125847,
  totalStorage: 5.2 * 1024**4, // 5.2 TB
  gdriveFiles: 89123,
  hetznerFiles: 36724,
};

export const mockFileTypeAnalytics: FileTypeAnalyticsData = {
  totalFiles: 125847,
  fileTypes: [
    { type: 'video', count: 45000, size: 2.5 * 1024**4, percentage: 35.7 },
    { type: 'image', count: 35000, size: 1.2 * 1024**4, percentage: 27.8 },
    { type: 'archive', count: 20000, size: 0.8 * 1024**4, percentage: 15.9 },
    { type: 'document', count: 15000, size: 0.4 * 1024**4, percentage: 11.9 },
    { type: 'audio', count: 8000, size: 0.2 * 1024**4, percentage: 6.4 },
    { type: 'other', count: 2847, size: 0.1 * 1024**4, percentage: 2.3 },
  ]
};