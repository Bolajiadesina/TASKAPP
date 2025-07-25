import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth";

// auth.guard.ts
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
    this.router=router;
  }

  async canActivate(): Promise<boolean> {
  try {
    await this.authService.initializeAuth(); // Wait for async token init (e.g., Google One Tap)
    
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  } catch (error) {
    console.error('Auth initialization failed:', error);
    this.router.navigate(['/login']);
    return false;
  }
}

}