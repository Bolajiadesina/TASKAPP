import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const GOOGLE_CLIENT_ID = '853554581384-b3r6cigqjmn5562oi1p832shptom3ghm.apps.googleusercontent.com';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string | null = 'http://localhost:8080/api/tasks';
  private token: string | null = null;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.token = localStorage.getItem('access_token');
    }
  }

  loginWithGoogle(loginForm: any): void {
    if (!this.isBrowser) return;

    const redirectUri = encodeURIComponent('http://localhost:4200/home');
    const scope = encodeURIComponent(
      'openid profile email https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly'
    );

    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&include_granted_scopes=true`;

    window.location.href = url;
  }

  setToken(token: string): void {
    this.token = token;
    if (this.isBrowser) {
      localStorage.setItem('access_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (this.isBrowser) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  logout(): void {
    this.token = null;
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
