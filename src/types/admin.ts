export enum UserRole {
  REGULAR = 'regular',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminToken {
  access_token: string;
  token_type: string;
  admin_role: string;
  expires_in: number;
}

export interface AdminUserInDB {
  id: string;
  email: string;
  role: UserRole;
  is_admin: boolean;
  created_at?: string;
  last_login?: string;
}

export interface AdminActivityLog {
  id?: string;
  admin_email: string;
  action: string;
  timestamp: string;
  ip_address?: string;
  endpoint?: string;
  details?: string;
}

export interface AdminActivityLogResponse {
  logs: AdminActivityLog[];
  total: number;
  limit: number;
  skip: number;
}

export interface AdminProfileResponse {
  data: AdminUserInDB;
  message: string;
}

export interface AdminCreateResponse {
  data: AdminUserInDB;
  message: string;
}

export interface AdminTokenVerification {
  valid: boolean;
  admin_email: string;
  admin_role: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface CreateAdminForm {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface AdminSession {
  token: string;
  adminEmail: string;
  adminRole: UserRole;
  expiresAt: Date;
}

export interface PasswordStrength {
  score: number;
  label: 'weak' | 'medium' | 'strong';
  color: string;
  text: string;
}

export interface AdminAuthError {
  message: string;
  code?: string;
  field?: string;
}

// New types for Admin Dashboard
export type SystemHealth = 'good' | 'warning' | 'critical' | 'unknown';

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
}

export interface SystemStats {
  totalUsers: number;
  totalFiles: number;
  totalStorage: number; // in bytes
  systemHealth: SystemHealth;
}

export interface GoogleDriveStats {
  totalAccounts: number;
  activeAccounts: number;
  totalQuota: number; // in bytes
  totalUsed: number; // in bytes
  health: SystemHealth;
}

export interface UploadActivityData {
  day: string;
  uploads: number;
}

export interface StorageDistributionData {
  googleDrive: number; // in bytes
  hetzner: number; // in bytes
}