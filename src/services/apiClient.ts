import {
  CitizenProfile,
  GovernmentService,
  ServiceApplication,
  ConsentToken,
  AuditLogEntry,
  GatewayMetrics,
  AuthMethod,
  AuthSession
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    const saved = localStorage.getItem('govsync_auth_session');
    if (saved) {
      try {
        const session = JSON.parse(saved);
        this.token = session.jwtToken || null;
      } catch (e) {
        this.token = null;
      }
    }
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Health check
  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Auth
  public async login(authMethod: AuthMethod, payload?: any): Promise<{ user: CitizenProfile; jwtToken: string; claims: any }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ authMethod, ...payload })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Login failed');
    this.setToken(json.data.jwtToken);
    return json.data;
  }

  public async register(profile: CitizenProfile): Promise<{ user: CitizenProfile; jwtToken: string; claims: any }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(profile)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Registration failed');
    this.setToken(json.data.jwtToken);
    return json.data;
  }

  // Citizen Profile
  public async getProfile(): Promise<CitizenProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch profile');
    return json.data;
  }

  public async updateProfile(profile: Partial<CitizenProfile>): Promise<CitizenProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profile)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update profile');
    return json.data;
  }

  // Services
  public async getServices(category?: string, search?: string): Promise<GovernmentService[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/services?${params.toString()}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch services');
    return json.data;
  }

  // Applications
  public async getApplications(department?: string): Promise<ServiceApplication[]> {
    const params = new URLSearchParams();
    if (department && department !== 'ALL') params.append('department', department);

    const res = await fetch(`${API_BASE}/applications?${params.toString()}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch applications');
    return json.data;
  }

  public async applyForService(serviceId: string, deltaData: Record<string, any>): Promise<ServiceApplication> {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ serviceId, deltaData })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to submit application');
    return json.data;
  }

  public async updateApplicationStatus(
    applicationId: string,
    status: 'APPROVED' | 'REJECTED',
    remarks: string,
    officerName: string
  ): Promise<ServiceApplication> {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, remarks, officerName })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update application status');
    return json.data;
  }

  // Consents
  public async getConsents(): Promise<ConsentToken[]> {
    const res = await fetch(`${API_BASE}/consents`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch consents');
    return json.data;
  }

  public async revokeConsent(tokenId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/consents/${tokenId}/revoke`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to revoke consent');
    return true;
  }

  // Admin
  public async getAuditLogs(action?: string, search?: string): Promise<AuditLogEntry[]> {
    const params = new URLSearchParams();
    if (action && action !== 'ALL') params.append('action', action);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/admin/audit-ledger?${params.toString()}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch audit ledger');
    return json.data;
  }

  public async getMetrics(): Promise<GatewayMetrics> {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch metrics');
    return json.data;
  }

  public async resetData(): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/reset`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to reset backend data');
  }
}

export const apiClient = new ApiClient();
