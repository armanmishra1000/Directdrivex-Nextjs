import { User } from '@/types/api';

export class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  // Get current user info
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const response = await fetch(`${this.baseUrl}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token might be expired, remove it
        this.logout();
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      this.logout();
      return null;
    }
  }

  // Google OAuth login
  googleLogin(): void {
    if (typeof window === 'undefined') return;
    window.location.href = `${this.baseUrl}/auth/google`;
  }

  // Logout
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.reload();
  }

  // Get access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  // Set access token
  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', token);
  }

  // Refresh token
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setAccessToken(data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.logout();
      return false;
    }
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return true;
    }
  }

  // Get user type for quota purposes
  getUserType(): 'anonymous' | 'authenticated' {
    return this.isAuthenticated() ? 'authenticated' : 'anonymous';
  }

  // Get file size limits based on authentication
  getFileSizeLimits(): { singleFile: number; daily: number } {
    const isAuthenticated = this.isAuthenticated();
    return {
      singleFile: isAuthenticated ? 5 * 1024 * 1024 * 1024 : 2 * 1024 * 1024 * 1024, // 5GB or 2GB
      daily: isAuthenticated ? 5 * 1024 * 1024 * 1024 : 2 * 1024 * 1024 * 1024 // 5GB or 2GB
    };
  }
}
