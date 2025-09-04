import {
  HetznerFileItem,
  HetznerFileListResponse,
  HetznerFileTypeAnalytics,
  HetznerStats,
} from '@/types/hetzner';
import { adminAuthService } from '../adminAuthService';

class HetznerFileManagementService {
  private readonly API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/admin/hetzner`;

  private getAuthHeaders(): HeadersInit {
    const token = adminAuthService.getAdminToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getFiles(params: any): Promise<HetznerFileListResponse> {
    // In a real app, this would make an API call.
    // For now, we return mock data.
    console.log('Fetching Hetzner files with params:', params);
    return this.getMockFilesResponse(params);
  }

  async getFileTypeAnalytics(): Promise<HetznerFileTypeAnalytics> {
    // In a real app, this would make an API call.
    // For now, we return mock data.
    return this.getMockFileTypeAnalytics();
  }

  // Mock data generation
  private getMockFilesResponse(params: any): HetznerFileListResponse {
    const mockFiles: HetznerFileItem[] = Array.from({ length: 128 }, (_, i) => this.generateMockFile(i));
    const total = mockFiles.length;
    const page = params.page || 1;
    const limit = params.limit || 50;
    const total_pages = Math.ceil(total / limit);
    const paginatedFiles = mockFiles.slice((page - 1) * limit, page * limit);

    return {
      files: paginatedFiles,
      total,
      page,
      limit,
      total_pages,
      hetzner_stats: this.getMockStats(),
    };
  }

  private getMockStats(): HetznerStats {
    return {
      total_files: 128,
      total_storage: 15.2 * 1024 * 1024 * 1024 * 1024,
      total_storage_formatted: "15.2 TB",
      recent_backups: 89,
      failed_backups: 4,
    };
  }

  private getMockFileTypeAnalytics(): HetznerFileTypeAnalytics {
    return {
      file_types: [
        { _id: 'image', count: 45, total_size: 5.3e12, percentage: 35.1, size_formatted: '5.3 TB' },
        { _id: 'video', count: 21, total_size: 8.2e12, percentage: 16.4, size_formatted: '8.2 TB' },
        { _id: 'document', count: 32, total_size: 0.7e12, percentage: 25.0, size_formatted: '0.7 TB' },
        { _id: 'archive', count: 18, total_size: 1.0e12, percentage: 14.1, size_formatted: '1.0 TB' },
        { _id: 'audio', count: 12, total_size: 0.5e12, percentage: 9.4, size_formatted: '0.5 TB' },
      ],
      total_files: 128,
    };
  }

  private generateMockFile(index: number): HetznerFileItem {
    const fileTypes: FileType[] = ['image', 'video', 'document', 'archive', 'audio', 'other'];
    const backupStatuses: BackupStatus[] = ['completed', 'failed', 'in_progress', 'not_backed_up'];
    const fileType = fileTypes[index % fileTypes.length];
    const sizeBytes = Math.random() * 1e11; // up to 100GB
    return {
      _id: `hetzner_${index}`,
      filename: `backup_file_${index}.dat`,
      size_bytes: sizeBytes,
      size_formatted: this.formatBytes(sizeBytes),
      content_type: 'application/octet-stream',
      file_type: fileType,
      upload_date: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
      owner_email: `user${index % 10}@example.com`,
      gdrive_account_id: `gdrive_acc_${index % 3}`,
      hetzner_remote_path: `/backups/user${index % 10}/backup_file_${index}.dat`,
      backup_status: backupStatuses[index % backupStatuses.length],
      download_url: '#',
      preview_available: Math.random() > 0.5,
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
}

export const hetznerFileManagementService = new HetznerFileManagementService();