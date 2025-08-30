import { adminAuthService } from './adminAuthService';
import { SystemHealth, SystemStats, GoogleDriveStats } from '@/types/admin';

interface SystemHealthResponse {
  timestamp: string;
  system: {
    cpu: { usage_percent: number; count: number; frequency: number };
    memory: { total: number; used: number; percent: number };
    disk: { total: number; used: number; free: number; percent: number };
    uptime: number;
  };
  database: {
    total_users: number;
    total_files: number;
    total_admins: number;
    size_bytes: number;
  };
}

interface GoogleDriveStorageStatsResponse {
  total_accounts: number;
  active_accounts: number;
  total_storage_quota: number;
  total_storage_quota_formatted: string;
  total_storage_used: number;
  total_storage_used_formatted: string;
  available_storage: number;
  available_storage_formatted: string;
  usage_percentage: number;
  health_status: 'good' | 'warning' | 'critical' | 'unknown';
}

class AdminStatsService {
  private readonly API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/admin`;
  
  async getSystemHealth(): Promise<SystemHealthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/monitoring/system-health`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to fetch system health');
      }
      
      return await response.json();
    } catch (error) {
      console.error('System health fetch error:', error);
      throw error;
    }
  }
  
  async getGoogleDriveStats(): Promise<GoogleDriveStorageStatsResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/storage/google-drive/combined-stats`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to fetch Google Drive stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Google Drive stats fetch error:', error);
      throw error;
    }
  }
  
  async getUploadActivity(days: number = 14): Promise<{ day: string; uploads: number }[]> {
    try {
      const response = await fetch(`${this.API_BASE}/analytics/upload-activity?days=${days}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to fetch upload activity');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload activity fetch error:', error);
      // Return mock data as fallback
      return this.getMockUploadActivity(days);
    }
  }
  
  async getStorageDistribution(): Promise<{ googleDrive: number; hetzner: number }> {
    try {
      const response = await fetch(`${this.API_BASE}/storage/distribution`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to fetch storage distribution');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Storage distribution fetch error:', error);
      // Return mock data as fallback
      return {
        googleDrive: 1073741824 * 15, // 15 GB
        hetzner: 1073741824 * 25 // 25 GB
      };
    }
  }
  
  private getMockUploadActivity(days: number): { day: string; uploads: number }[] {
    const result = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Generate random upload count between 10-150 with some patterns
      let uploads = Math.floor(Math.random() * 80) + 20;
      
      // Make weekends have fewer uploads
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        uploads = Math.floor(uploads * 0.6);
      }
      
      result.push({ day, uploads });
    }
    
    return result;
  }
  
  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${adminAuthService.getAdminToken()}`,
      'Content-Type': 'application/json'
    };
  }
  
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
  
  calculateSystemHealth(systemData: SystemHealthResponse): SystemHealth {
    const memoryUsage = systemData.system.memory?.percent || 0;
    const diskUsage = systemData.system.disk?.percent || 0;
    const cpuUsage = systemData.system.cpu?.usage_percent || 0;
    
    if (memoryUsage > 90 || diskUsage > 90 || cpuUsage > 90) return 'critical';
    if (memoryUsage > 75 || diskUsage > 75 || cpuUsage > 75) return 'warning';
    return 'good';
  }
}

export const adminStatsService = new AdminStatsService();
