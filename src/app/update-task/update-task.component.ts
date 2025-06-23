import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-task',
  imports: [],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.css'
})
export class UpdateTaskComponent {

  constructor(private router: Router) { }

  goToHome() {
    this.router.navigate(['/home']);
  }

}
