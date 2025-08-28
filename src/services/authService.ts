export interface User {
  id: string;
  email: string;
  name: string;
  storage_quota_gb: number;
}

export class AuthService {
  private apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

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

  async login(credentials: { email: string; password: string }) {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await fetch(`${this.apiUrl}/api/v1/auth/token`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data;
  }

  async register(user: any) {
    const response = await fetch(`${this.apiUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (!response.ok) throw new Error('Registration failed');
    return response.json();
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
