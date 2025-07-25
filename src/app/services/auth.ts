import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

declare const google: any; // Google types are imported via @types/google.accounts

@Injectable({
  providedIn: 'root'
})



export class AuthService {
  private token: string | null = null;
  private isBrowser: boolean;
  private isInitialized = false;
  private userInfo: { name: string; email: string } | null = null;


  constructor(
    private router: Router,
    private ngZone: NgZone, // Needed for Google OAuth callback
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.token = localStorage.getItem('access_token');
      this.loadGoogleAuthLibrary(); // Load Google OAuth script
    }
    // const saved = localStorage.getItem('user_info');
    // if (saved) this.userInfo = JSON.parse(saved);

  }

  private loadGoogleAuthLibrary() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  loginWithGoogle(): void {
    if (!this.isBrowser) return;

    google.accounts.id.initialize({
      client_id: '853554581384-b3r6cigqjmn5562oi1p832shptom3ghm.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleSignIn(response),
    });
    google.accounts.id.prompt(); // Display the Google One Tap prompt
  }

  private handleGoogleSignIn(response: any) {

    this.ngZone.run(() => { // Ensure Angular detects changes
      const credential = response.credential;
      const payload = this.decodeJwt(credential); // Extract user data from JWT
      console.log('Google Sign-In Payload:', payload);
     // this.setToken(credential); // Store the ID token (or use it for API calls)
       //this.setUserInfo(payload); 
      this.router.navigate(['/home'], {
        queryParams: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        }
      }
      );
    })
  }

  
  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  setToken(token: string): void {
    this.token = token;
    if (this.isBrowser) {
      localStorage.setItem('access_token', token);
    }
  }

  getToken(): string | null {
    return this.token || (this.isBrowser ? localStorage.getItem('access_token') : null);
  }

  logout(): void {
    // this.token = null;
    // if (this.isBrowser) {
    //   localStorage.removeItem('access_token');
    //   google.accounts.id.revoke('', () => this.router.navigate(['/login']));
    // }
    this.router.navigate(['/login']);
  }

  // isAuthenticated(): boolean {
  //   return this.getToken() !== null;
  // }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }


  initializeAuth(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isBrowser) {
        resolve();
        return;
      }

      this.loadGoogleAuthLibrary();
      this.token = localStorage.getItem('access_token');
      this.isInitialized = true;
      resolve();
    });
  }

  isAuthInitialized(): boolean {
    return this.isInitialized;
  }

  
}