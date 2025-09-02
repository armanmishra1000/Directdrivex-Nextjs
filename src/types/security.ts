export interface SecurityConfig {
  session_timeout_minutes: number;
  max_login_attempts: number;
  lockout_duration_minutes: number;
  require_strong_passwords: boolean;
  enable_two_factor_auth: boolean;
  allowed_cors_origins: string[];
  enable_api_rate_limiting: boolean;
}

export interface AccessRule {
  id: string;
  rule_name: string;
  ip_pattern: string;
  action: 'allow' | 'deny' | 'rate_limit';
  description: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  last_modified: string;
}

export interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_special_chars: boolean;
  password_history_count: number;
  password_expiry_days: number;
}

export interface ActiveSession {
  session_id: string;
  admin_email: string;
  ip_address: string;
  user_agent: string;
  login_time: string;
  last_activity: string;
}

export interface SessionManagement {
  active_sessions: ActiveSession[];
  total_active: number;
}