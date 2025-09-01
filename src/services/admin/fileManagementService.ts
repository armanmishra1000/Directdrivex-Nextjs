 "use client";

import { adminAuthService } from '../adminAuthService';
import { toastService } from '../toastService';

// File Management Types
export interface FileSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  file_type?: FileType;
  owner_email?: string;
  storage_location?: StorageLocation;
  status?: FileStatus;
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

export interface AdminFile {
  _id: string;
  filename: string;
  size_bytes: number;
  size_formatted: string;
  content_type: string;
  file_type: FileType;
  upload_date: string;
  owner_email: string;
  status: FileStatus;
  storage_location: StorageLocation;
  download_url: string;
  preview_available?: boolean;
}

export interface StorageStats {
  total_files: number;
  total_storage: number;
  total_storage_formatted: string;
  average_file_size: number;
  gdrive_files: number;
  hetzner_files: number;
}

export interface FileTypeAnalytics {
  file_types: {
    _id: string;
    count: number;
    total_size: number;
    percentage: number;
    size_formatted: string;
  }[];
  total_files: number;
}

export interface IntegrityCheckResult {
  status: 'verified' | 'corrupted' | 'inaccessible';
  checksum_match?: boolean;
  corruption_type?: string;
  error?: string;
  last_check?: string;
}

export interface FileOperationResult {
  success: boolean;
  message: string;
  file_id: string;
  operation: string;
  target_location?: string;
  backup_path?: string;
}

export interface BulkActionResponse {
  success: boolean;
  message: string;
  files_affected: number;
  failed_files?: string[];
}

export interface OrphanedFilesResponse {
  orphaned_files: OrphanedFile[];
  total: number;
  page: number;
  limit: number;
}

export interface OrphanedFile {
  _id: string;
  filename: string;
  size_bytes: number;
  size_formatted: string;
  orphan_reason: string;
  last_accessed: string;
}

export interface CleanupResult {
  success: boolean;
  message: string;
  files_affected: number;
  cleanup_type: 'soft' | 'hard';
}

export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
export type StorageLocation = 'gdrive' | 'hetzner';
export type FileStatus = 'completed' | 'pending' | 'uploading' | 'failed' | 'quarantined';

class FileManagementService {
  private readonly API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/admin`;

  /**
   * Get files with filtering, sorting, and pagination
   */
  async getFiles(params: FileSearchParams = {}): Promise<FileListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.file_type) queryParams.append('file_type', params.file_type);
      if (params.owner_email) queryParams.append('owner_email', params.owner_email);
      if (params.storage_location) queryParams.append('storage_location', params.storage_location);
      if (params.status) queryParams.append('file_status', params.status);
      if (params.size_min !== undefined) queryParams.append('size_min', params.size_min.toString());
      if (params.size_max !== undefined) queryParams.append('size_max', params.size_max.toString());
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);

      const response = await fetch(`${this.API_BASE}/files?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to load files');
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading files:', error);
      
      // Return mock data as fallback for development
      return this.getMockFileList(params);
    }
  }

  /**
   * Download file
   */
  async downloadFile(fileId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.API_BASE}/files/${fileId}/download`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to download file');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string, reason?: string): Promise<void> {
    try {
      const queryParams = new URLSearchParams();
      if (reason) queryParams.append('reason', reason);

      const response = await fetch(`${this.API_BASE}/files/${fileId}?${queryParams.toString()}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Bulk action on multiple files
   */
  async bulkAction(fileIds: string[], action: string, reason?: string): Promise<BulkActionResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/files/bulk-action`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          file_ids: fileIds,
          action: action,
          reason: reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Bulk action failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error executing bulk action:', error);
      throw error;
    }
  }

  /**
   * Check file integrity
   */
  async checkFileIntegrity(fileId: string): Promise<IntegrityCheckResult> {
    try {
      const response = await fetch(`${this.API_BASE}/files/${fileId}/operation`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          operation: 'integrity_check',
          reason: 'Manual integrity check from admin panel'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to check file integrity');
      }

      const result = await response.json();
      return result.integrity_check;
    } catch (error) {
      console.error('Error checking file integrity:', error);
      throw error;
    }
  }

  /**
   * Move file to different storage location
   */
  async moveFile(fileId: string, targetLocation: string, reason?: string): Promise<FileOperationResult> {
    try {
      const response = await fetch(`${this.API_BASE}/files/${fileId}/operation`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          operation: 'move',
          target_location: targetLocation,
          reason: reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to move file');
      }

      return await response.json();
    } catch (error) {
      console.error('Error moving file:', error);
      throw error;
    }
  }

  /**
   * Force backup file to Hetzner storage
   */
  async forceBackup(fileId: string, reason?: string): Promise<FileOperationResult> {
    try {
      const response = await fetch(`${this.API_BASE}/files/${fileId}/operation`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          operation: 'force_backup',
          reason: reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to backup file');
      }

      return await response.json();
    } catch (error) {
      console.error('Error backing up file:', error);
      throw error;
    }
  }

  /**
   * Recover file from backup
   */
  async recoverFile(fileId: string, reason?: string): Promise<FileOperationResult> {
    try {
      const response = await fetch(`${this.API_BASE}/files/${fileId}/operation`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          operation: 'recover',
          reason: reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to recover file');
      }

      return await response.json();
    } catch (error) {
      console.error('Error recovering file:', error);
      throw error;
    }
  }

  /**
   * Quarantine suspicious file
   */
  async quarantineFile(fileId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/files/bulk-action`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          file_ids: [fileId],
          action: 'quarantine',
          reason: reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to quarantine file');
      }
    } catch (error) {
      console.error('Error quarantining file:', error);
      throw error;
    }
  }

  /**
   * Get orphaned files
   */
  async getOrphanedFiles(params: { page?: number; limit?: number } = {}): Promise<OrphanedFilesResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${this.API_BASE}/files/orphaned?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to load orphaned files');
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading orphaned files:', error);
      
      // Return mock data for development
      return {
        orphaned_files: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 50
      };
    }
  }

  /**
   * Cleanup orphaned files
   */
  async cleanupOrphanedFiles(cleanupType: 'soft' | 'hard', daysOld: number): Promise<CleanupResult> {
    try {
      const response = await fetch(`${this.API_BASE}/files/cleanup-orphaned?cleanup_type=${cleanupType}&days_old=${daysOld}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to cleanup orphaned files');
      }

      return await response.json();
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
      throw error;
    }
  }

  /**
   * Get file type analytics
   */
  async getFileTypeAnalytics(): Promise<FileTypeAnalytics> {
    try {
      const response = await fetch(`${this.API_BASE}/files/analytics/types`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to load file analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading file analytics:', error);
      
      // Return mock data for development
      return this.getMockFileTypeAnalytics();
    }
  }

  /**
   * Get file preview
   */
  async getFilePreview(fileId: string): Promise<{ preview_url: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/files/${fileId}/preview`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to load file preview');
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading file preview:', error);
      throw error;
    }
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    const token = adminAuthService.getAdminToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Generate comprehensive mock data for development
   */
  private getMockFileList(params: FileSearchParams = {}): FileListResponse {
    const page = params.page || 1;
    const limit = params.limit || 50;
    
    // Generate mock files
    const mockFiles: AdminFile[] = Array.from({ length: 150 }, (_, i) => {
      const types: FileType[] = ['document', 'image', 'video', 'audio', 'archive', 'other'];
      const statuses: FileStatus[] = ['completed', 'pending', 'uploading', 'failed', 'quarantined'];
      const locations: StorageLocation[] = ['gdrive', 'hetzner'];
      const fileType = types[i % types.length];
      
      let filename = `document_${i + 1}.pdf`;
      let contentType = 'application/pdf';
      
      if (fileType === 'image') {
        filename = `photo_${i + 1}.jpg`;
        contentType = 'image/jpeg';
      } else if (fileType === 'video') {
        filename = `recording_${i + 1}.mp4`;
        contentType = 'video/mp4';
      } else if (fileType === 'audio') {
        filename = `song_${i + 1}.mp3`;
        contentType = 'audio/mpeg';
      } else if (fileType === 'archive') {
        filename = `backup_${i + 1}.zip`;
        contentType = 'application/zip';
      }
      
      const sizeBytes = Math.floor(Math.random() * 100000000) + 10000;
      
      return {
        _id: `file_${i + 1}`,
        filename,
        size_bytes: sizeBytes,
        size_formatted: this.formatBytes(sizeBytes),
        content_type: contentType,
        file_type: fileType,
        upload_date: new Date(Date.now() - i * 3600000).toISOString(),
        owner_email: `user${i % 10 + 1}@example.com`,
        status: statuses[i % statuses.length],
        storage_location: locations[i % locations.length],
        download_url: `/api/v1/files/${i + 1}/download`,
        preview_available: fileType === 'image' || fileType === 'document',
      };
    });

    // Apply filters
    let filteredFiles = mockFiles;
    
    if (params.search) {
      const search = params.search.toLowerCase();
      filteredFiles = filteredFiles.filter(file => 
        file.filename.toLowerCase().includes(search) ||
        file.owner_email.toLowerCase().includes(search)
      );
    }
    
    if (params.file_type) {
      filteredFiles = filteredFiles.filter(file => file.file_type === params.file_type);
    }
    
    if (params.owner_email) {
      filteredFiles = filteredFiles.filter(file => file.owner_email === params.owner_email);
    }
    
    if (params.storage_location) {
      filteredFiles = filteredFiles.filter(file => file.storage_location === params.storage_location);
    }
    
    if (params.status) {
      filteredFiles = filteredFiles.filter(file => file.status === params.status);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedFiles = filteredFiles.slice(startIndex, startIndex + limit);
    
    return {
      files: paginatedFiles,
      total: filteredFiles.length,
      page: page,
      limit: limit,
      total_pages: Math.ceil(filteredFiles.length / limit),
      storage_stats: {
        total_files: mockFiles.length,
        total_storage: mockFiles.reduce((sum, file) => sum + file.size_bytes, 0),
        total_storage_formatted: this.formatBytes(mockFiles.reduce((sum, file) => sum + file.size_bytes, 0)),
        average_file_size: mockFiles.reduce((sum, file) => sum + file.size_bytes, 0) / mockFiles.length,
        gdrive_files: mockFiles.filter(f => f.storage_location === 'gdrive').length,
        hetzner_files: mockFiles.filter(f => f.storage_location === 'hetzner').length
      }
    };
  }

  /**
   * Generate mock file type analytics
   */
  private getMockFileTypeAnalytics(): FileTypeAnalytics {
    const fileTypes = [
      { _id: 'document', count: 45, total_size: 450000000, percentage: 30 },
      { _id: 'image', count: 38, total_size: 380000000, percentage: 25.3 },
      { _id: 'video', count: 25, total_size: 2500000000, percentage: 16.7 },
      { _id: 'audio', count: 22, total_size: 220000000, percentage: 14.7 },
      { _id: 'archive', count: 15, total_size: 1500000000, percentage: 10 },
      { _id: 'other', count: 5, total_size: 50000000, percentage: 3.3 }
    ];

    return {
      file_types: fileTypes.map(type => ({
        ...type,
        size_formatted: this.formatBytes(type.total_size)
      })),
      total_files: fileTypes.reduce((sum, type) => sum + type.count, 0)
    };
  }

  /**
   * Format bytes to human readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
}

// Export singleton instance
export const fileManagementService = new FileManagementService();
