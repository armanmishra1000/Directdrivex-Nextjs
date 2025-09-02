import { FileItem, StorageStats, FileTypeAnalyticsData } from "@/types/file-browser";

export const mockStorageStats: StorageStats = {
  totalFiles: 1234,
  totalStorage: 45.2 * 1024 * 1024 * 1024, // 45.2 GB
  gdriveFiles: 890,
  hetznerFiles: 344,
};

export const mockFileTypeAnalytics: FileTypeAnalyticsData[] = [
  { type: 'image', fileCount: 450, totalSize: 12.3 * 1024 * 1024 * 1024 },
  { type: 'document', fileCount: 300, totalSize: 8.7 * 1024 * 1024 * 1024 },
  { type: 'video', fileCount: 200, totalSize: 18.2 * 1024 * 1024 * 1024 },
  { type: 'archive', fileCount: 84, totalSize: 6.0 * 1024 * 1024 * 1024 },
  { type: 'other', fileCount: 200, totalSize: 2.0 * 1024 * 1024 * 1024 },
];

export const mockFiles: FileItem[] = Array.from({ length: 1234 }, (_, i) => {
  const types: FileItem['type'][] = ['image', 'video', 'document', 'archive', 'audio', 'other'];
  const statuses: FileItem['status'][] = ['completed', 'pending', 'uploading', 'failed', 'deleted'];
  const storages: FileItem['storage'][] = ['gdrive', 'hetzner'];
  const owners = ['user@company.com', 'admin@company.com', 'guest@visitor.com', 'service-account@api.com'];
  const extensions = {
    image: 'jpg', video: 'mp4', document: 'pdf', archive: 'zip', audio: 'mp3', other: 'dat'
  };

  const type = types[i % types.length];
  const date = new Date(Date.now() - i * 3600000 * Math.random());

  return {
    id: `file_${i + 1}`,
    name: `document_${i + 1}_${date.toISOString().split('T')[0]}.${extensions[type]}`,
    size: Math.floor(Math.random() * 1024 * 1024 * 100), // up to 100MB
    type,
    owner: owners[i % owners.length],
    date: date.toISOString(),
    status: statuses[i % statuses.length],
    storage: storages[i % storages.length],
    version: Math.floor(Math.random() * 3) + 1,
  };
});