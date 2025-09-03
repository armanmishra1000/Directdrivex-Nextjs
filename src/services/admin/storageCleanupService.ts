import { CleanupResult } from '@/types/cleanup';
import { adminAuthService } from '../adminAuthService';
import { activityLogsService } from './activityLogsService';

class StorageCleanupService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  private getAuthHeaders(): HeadersInit {
    const token = adminAuthService.getAdminToken();
    if (!token) {
      throw new Error('Admin authentication required');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async runStorageCleanup(useHardDelete: boolean = false): Promise<CleanupResult> {
    try {
      const endpoint = `${this.baseUrl}/api/v1/admin/storage/google-drive/reset-all${useHardDelete ? '?hard=true' : ''}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: Storage cleanup failed`);
      }

      const result = await response.json();
      
      // Log activity for audit trail
      await this.logCleanupActivity(result);
      
      return result;
    } catch (error) {
      console.error('Storage cleanup failed:', error);
      throw error;
    }
  }

  private async logCleanupActivity(result: CleanupResult): Promise<void> {
    try {
      await activityLogsService.logActivity({
        action: 'storage_cleanup',
        details: {
          resource: 'google_drive',
          message: `Storage cleanup completed: ${result.mode} mode, ${result.gdrive.summary.deleted} GDrive files deleted, ${result.files_marked_deleted} DB files processed`,
          mode: result.mode,
          gdrive_deleted: result.gdrive.summary.deleted,
          gdrive_errors: result.gdrive.summary.errors,
          db_files_marked: result.files_marked_deleted,
          db_files_hard_deleted: result.files_hard_deleted,
          batches_deleted: result.batches_deleted
        }
      });
    } catch (error) {
      console.warn('Failed to log cleanup activity:', error);
    }
  }

  // Demo mode fallback for development
  async runStorageCleanupDemo(useHardDelete: boolean = false): Promise<CleanupResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResult: CleanupResult = {
      message: "Storage cleanup successful",
      mode: useHardDelete ? 'hard' : 'soft',
      files_marked_deleted: useHardDelete ? 0 : 5678,
      files_hard_deleted: useHardDelete ? 5678 : 0,
      batches_deleted: 23,
      gdrive: {
        summary: {
          deleted: 1234,
          errors: 2,
        },
        per_account: {
          "account1@gmail.com": {
            deleted: 456,
            errors: 1,
            message: "OK",
          },
          "account2@gmail.com": {
            deleted: 789,
            errors: 0,
            message: "OK",
          },
          "account3@gmail.com": {
            deleted: 0,
            errors: 1,
            message: "API connection failed",
          },
        },
      },
    };

    return mockResult;
  }
}

export const storageCleanupService = new StorageCleanupService();
