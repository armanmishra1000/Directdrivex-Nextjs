export interface User {
  id: string;
  email: string;
  name: string;
  storage_quota_gb: number;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export class AuthService {
  private readonly API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/auth`;

  isAuthenticated(): boolean {
    try {
      return !!localStorage.getItem('access_token');
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      
      // Decode JWT payload (simple base64 decode for demo)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        storage_quota_gb: payload.storage_quota_gb
      };
    } catch {
      return null;
    }
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await fetch(`${this.API_URL}/token`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data;
  }

  async register(userData: RegisterData): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed. Please try again.';
        
        try {
          const errorData = await response.json();
          // Handle different error response formats
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } catch {
          // If JSON parsing fails, use status-based messages
          if (response.status === 400) {
            errorMessage = 'Invalid registration data. Please check your inputs.';
          } else if (response.status === 409) {
            errorMessage = 'An account with this email already exists.';
          } else if (response.status === 422) {
            errorMessage = 'Please check your email and password format.';
          } else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Store token if provided in registration response
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      
      return data;
    } catch (error) {
      // Re-throw the error to preserve the message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }

  logout(): void {
    try {
      localStorage.removeItem('access_token');
      window.location.reload();
    } catch {
      // Handle case where localStorage is not available
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
