import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: true,
  imports: [FormsModule, HttpClientModule, ReactiveFormsModule],
  styleUrls: ['./login.css']
})
export class LoginComponent {
  public loginForm!: FormGroup;
  constructor(private authService: AuthService, private router: Router) { 
    this.loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });
  }

 

/**
 * Handles the login process using Google OAuth.
 * Redirects the user to Google's OAuth 2.0 authorization endpoint.
 */
onLogin(): void {
  if(this.loginForm.valid) {
  this.authService.loginWithGoogle(this.loginForm.value);
}


this.router.navigate(['/home']); // Redirect to home on successful login
  }

}

