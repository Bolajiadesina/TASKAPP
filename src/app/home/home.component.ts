import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-home',
  imports: [MatProgressBarModule, MatCardModule, MatChipsModule,HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router, private http: HttpClient) {
    this.router = router;
    this.http = http;
  }
  longTextCreate = 'Create Tasks: Here you can create tasks, which will be stored in the database.';
  longTextUpdate = 'Update Tasks: Here you can update tasks that have been created. The tasks are displayed in a list format';
  longTextGetAll = 'View Tasks: Here you can view all tasks that have been created. You can also update and delete tasks. The tasks are displayed in a list format and you can click on each task to view its details.';
  longTextDelete = 'Delete Tasks: Here you can delete tasks that have been created. The tasks are displayed in a list format';

 


  goToViewTasks(): void {
    this.http.get<{
      responseCode: string;
      responseMessage: string;
      data: any;
    }>('http://localhost:8080/api/tasks/getAll').subscribe(
      response => {  
        this.router.navigate(['/viewTasks'], { state: { tasks: response.data } });
      },
      error => {
        console.error('Error retrieving tasks:', error);
      }
    );
  }

  goToCreate(): void {
    this.router.navigate(['/create']);
  }
  goToUpdateTask(): void {
    this.router.navigate(['/update',0]);
  }
  goToDeleteTask(): void {
    this.router.navigate(['/delete',0]);
  }

}
