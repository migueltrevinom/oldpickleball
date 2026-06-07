import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'super_admin' | 'court_admin' | 'court_staff' | 'player';
  roleModel: string;
  isOnboarded: boolean;
  exp: number;
  iat: number;
}

export interface VerifyOtpResponse {
  accessToken: string;
  role: string;
  roleModel: string;
  isOnboarded: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  accessToken = signal<string | null>(this.getStoredToken());
  currentUser = computed<JwtPayload | null>(() => {
    const token = this.accessToken();
    return token ? this.decodeToken(token) : null;
  });
  isAuthenticated = computed(() => {
    const user = this.currentUser();
    return !!user && user.exp * 1000 > Date.now();
  });
  role = computed(() => this.currentUser()?.role ?? null);
  isOnboarded = computed(() => this.currentUser()?.isOnboarded ?? false);

  constructor(private http: HttpClient) {}

  requestOtp(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/request-otp`, { email });
  }

  verifyOtp(email: string, code: string): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(`${environment.apiUrl}/auth/verify-otp`, { email, code }).pipe(
      tap((res) => {
        this.setToken(res.accessToken);
      })
    );
  }

  onboard(data: Record<string, unknown>): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/auth/onboard`, data);
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${environment.apiUrl}/auth/refresh`, {}).pipe(
      tap((res) => {
        this.setToken(res.accessToken);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.accessToken.set(null);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.accessToken.set(token);
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  }
}
