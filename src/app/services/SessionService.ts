import { Injectable } from "@angular/core";
import { AuthService } from "./auth";

@Injectable({ providedIn: 'root' })
export class SessionService {
  private timeoutId: any;
  private readonly timeoutDuration = 5 * 60 * 1000; // 15 minutes

  constructor(private auth: AuthService) {
    this.resetTimer();
    this.initActivityListeners();
  }

  private initActivityListeners() {
    ['click', 'mousemove', 'keydown'].forEach(event =>
      document.addEventListener(event, () => this.resetTimer())
    );
  }

  resetTimer() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.auth.logout();
      alert('Logged out due to inactivity.');
    }, this.timeoutDuration);
  }
}
