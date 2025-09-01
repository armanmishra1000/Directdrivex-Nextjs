import { AdminFile, FileStats, FileType, FileStatus, StorageLocation } from '@/types/admin';

const fileTypes: FileType[] = ['image', 'video', 'audio', 'document', 'archive', 'other'];
const statuses: FileStatus[] = ['completed', 'pending', 'uploading', 'failed'];
const locations: StorageLocation[] = ['Google Drive', 'Hetzner'];
const owners = ['user1@example.com', 'admin@example.com', 'test@example.com', 'data@example.com'];

const generateRandomFile = (id: number): AdminFile => {
  const type = fileTypes[id % fileTypes.length];
  const status = statuses[id % statuses.length];
  const location = locations[id % locations.length];
  const owner = owners[id % owners.length];
  const size = Math.floor(Math.random() * 1024 * 1024 * 100) + 1024; // 1KB to 100MB
  const uploadDate = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString();
  
  let extension = 'tmp';
  switch(type) {
    case 'image': extension = 'jpg'; break;
    case 'video': extension = 'mp4'; break;
    case 'audio': extension = 'mp3'; break;
    case 'document': extension = 'pdf'; break;
    case 'archive': extension = 'zip'; break;
  }

  return {
    id: `file_${id}_${Math.random().toString(36).substring(2, 9)}`,
    filename: `project_asset_${id}.${extension}`,
    size,
    type,
    owner,
    uploadDate,
    status,
    storageLocation: location,
    previewUrl: type === 'image' ? `https://picsum.photos/seed/${id}/200/300` : undefined,
  };
};

export const mockFiles: AdminFile[] = Array.from({ length: 128 }, (_, i) => generateRandomFile(i + 1));

export const mockFileStats: FileStats = {
  totalFiles: mockFiles.length,
  totalStorage: mockFiles.reduce((acc, file) => acc + file.size, 0),
  gdriveFiles: mockFiles.filter(f => f.storageLocation === 'Google Drive').length,
  hetznerFiles: mockFiles.filter(f => f.storageLocation === 'Hetzner').length,
  typeDistribution: {
    image: { count: mockFiles.filter(f => f.type === 'image').length, size: mockFiles.filter(f => f.type === 'image').reduce((s, f) => s + f.size, 0) },
    video: { count: mockFiles.filter(f => f.type === 'video').length, size: mockFiles.filter(f => f.type === 'video').reduce((s, f) => s + f.size, 0) },
    audio: { count: mockFiles.filter(f => f.type === 'audio').length, size: mockFiles.filter(f => f.type === 'audio').reduce((s, f) => s + f.size, 0) },
    document: { count: mockFiles.filter(f => f.type === 'document').length, size: mockFiles.filter(f => f.type === 'document').reduce((s, f) => s + f.size, 0) },
    archive: { count: mockFiles.filter(f => f.type === 'archive').length, size: mockFiles.filter(f => f.type === 'archive').reduce((s, f) => s + f.size, 0) },
    other: { count: mockFiles.filter(f => f.type === 'other').length, size: mockFiles.filter(f => f.type === 'other').reduce((s, f) => s + f.size, 0) },
  }
};