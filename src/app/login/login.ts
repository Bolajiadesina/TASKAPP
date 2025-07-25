import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  constructor(private authService: AuthService, private router: Router, private _formBuilder: FormBuilder) {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]

    });
  }


  /**
   * Handles the login process using Google OAuth.
   * Redirects the user to Google's OAuth 2.0 authorization endpoint.
   */

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

}

