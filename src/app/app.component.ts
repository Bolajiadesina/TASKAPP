import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  email: any;
  name: any;
  login: any;

  constructor(private router: Router, private authService: AuthService) {
    this.router = router;
  }
  title = 'TaskApp';
  isAppReady = false;
  

   todayDate = new Date();


  ngOnInit() {
    this.authService.initializeAuth().then(() => {
      this.isAppReady = true;
    });
  }

}
