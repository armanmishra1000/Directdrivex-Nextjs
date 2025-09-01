import { AdminFile, StorageStats, FileTypeAnalytics } from '@/types/admin';
import { adminAuthService } from '@/services/adminAuthService';

export interface FileQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  file_type?: string;
  owner_email?: string;
  storage_location?: string;
  file_status?: string;
  size_min?: number;
  size_max?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FileListResponse {
  files: AdminFile[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  storage_stats: StorageStats;
}

export interface BulkActionResponse {
  message: string;
  files_affected: number;
  successful: string[];
  failed: string[];
}

export interface OrphanedFilesResponse {
  orphaned_files: Array<{
    filename: string;
    size_formatted: string;
    orphan_reason: string;
  }>;
  total: number;
}

export interface FileOperationResult {
  success: boolean;
  message: string;
  integrity_check?: {
    status: 'verified' | 'corrupted' | 'inaccessible';
    checksum_match?: boolean;
    last_check?: string;
    corruption_detected?: boolean;
    corruption_type?: string;
    error?: string;
  };
  target_location?: string;
  backup_path?: string;
  preview_url?: string;
}

class FileManagementService {
  private readonly API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/admin/files`;

  async getFiles(params: FileQueryParams = {}): Promise<FileListResponse> {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryString.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.API_BASE}?${queryString}`, {
      headers: adminAuthService.getAdminAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to load files: ${response.statusText}`);
    }

    return await response.json();
  }

  async getFileTypeAnalytics(): Promise<FileTypeAnalytics> {
    const response = await fetch(`${this.API_BASE}/analytics/types`, {
      headers: adminAuthService.getAdminAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to load file type analytics');
    }

    return await response.json();
  }

  downloadFile(file: AdminFile): void {
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${file.download_url}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async deleteFile(fileId: string, reason?: string): Promise<void> {
    const queryString = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    const response = await fetch(`${this.API_BASE}/${fileId}${queryString}`, {
      method: 'DELETE',
      headers: adminAuthService.getAdminAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  }

  async checkIntegrity(fileId: string, reason?: string): Promise<FileOperationResult> {
    const response = await fetch(`${this.API_BASE}/${fileId}/operation`, {
      method: 'POST',
      headers: adminAuthService.getAdminAuthHeaders(),
      body: JSON.stringify({
        operation: 'integrity_check',
        reason: reason || 'Manual integrity check from admin panel'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to check file integrity');
    }

    return await response.json();
  }

  async moveFile(fileId: string, targetLocation: string, reason?: string): Promise<FileOperationResult> {
    const response = await fetch(`${this.API_BASE}/${fileId}/operation`, {
      method: 'POST',
      headers: adminAuthService.getAdminAuthHeaders(),
      body: JSON.stringify({
        operation: 'move',
        target_location: targetLocation,
        reason: reason
      })
    });

    if (!response.ok) {
      throw new Error('Failed to move file');
    }

    return await response.json();
  }

  async forceBackup(fileId: string, reason?: string): Promise<FileOperationResult> {
    const response = await fetch(`${this.API_BASE}/${fileId}/operation`, {
      method: 'POST',
      headers: adminAuthService.getAdminAuthHeaders(),
      body: JSON.stringify({
        operation: 'force_backup',
        reason: reason
      })
    });

    if (!response.ok) {
      throw new Error('Failed to backup file');
    }

    return await response.json();
  }

  async recoverFile(fileId: string, reason?: string): Promise<FileOperationResult> {
    const response = await fetch(`${this.API_BASE}/${fileId}/operation`, {
      method: 'POST',
      headers: adminAuthService.getAdminAuthHeaders(),
      body: JSON.stringify({
        operation: 'recover',
        reason: reason
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.detail?.includes('no completed backup')) {
        throw new Error('Cannot recover file: No completed backup available');
      }
      throw new Error('Failed to recover file');
    }

    return await response.json();
  }

  async getPreview(fileId: string): Promise<{ preview_url: string }> {
    const response = await fetch(`${this.API_BASE}/${fileId}/preview`, {
      headers: adminAuthService.getAdminAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to load file preview');
    }

    return await response.json();
  }

  async bulkAction(fileIds: string[], action: string, reason?: string): Promise<BulkActionResponse> {
    const response = await fetch(`${this.API_BASE}/bulk-action`, {
      method: 'POST',
      headers: adminAuthService.getAdminAuthHeaders(),
      body: JSON.stringify({
        file_ids: fileIds,
        action: action,
        reason: reason
      })
    });

    if (!response.ok) {
      throw new Error('Bulk action failed');
    }

    return await response.json();
  }

  async getOrphanedFiles(page: number = 1, limit: number = 50): Promise<OrphanedFilesResponse> {
    const response = await fetch(`${this.API_BASE}/orphaned?page=${page}&limit=${limit}`, {
      headers: adminAuthService.getAdminAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to load orphaned files');
    }

    return await response.json();
  }

  async cleanupOrphaned(cleanupType: 'soft' | 'hard', daysOld: number): Promise<BulkActionResponse> {
    const response = await fetch(`${this.API_BASE}/cleanup-orphaned?cleanup_type=${cleanupType}&days_old=${daysOld}`, {
      method: 'POST',
      headers: adminAuthService.getAdminAuthHeaders(),
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error('Failed to cleanup orphaned files');
    }

    return await response.json();
  }

  async quarantineFile(fileId: string, reason: string): Promise<BulkActionResponse> {
    return this.bulkAction([fileId], 'quarantine', reason);
  }
}

export const fileManagementService = new FileManagementService();
export default fileManagementService;