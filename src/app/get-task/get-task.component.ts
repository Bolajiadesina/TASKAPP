import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal,NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-get-task',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './get-task.component.html',
  styleUrl: './get-task.component.css'
})
export class GetTaskComponent {

  tasks: any[] = [];
  task: any = {
    taskId: 0,
    taskName: '',
    taskDescription: '',
    taskStatus: '',
    taskDueDate: ''
  };

  constructor(private router: Router, private http: HttpClient, private modalService: NgbModal) {
    const nav = this.router.getCurrentNavigation();
    this.tasks = nav?.extras.state?.['tasks'] || [];
  }
  @ViewChild('content') content!: TemplateRef<any>; // <-- Add this line

  ngOnInit() {
    if (!this.tasks.length) {
      // Fetch from API if tasks not present (e.g., after refresh)
      this.http.get<{ data: any[] }>('http://localhost:8080/api/tasks/getAll')
        .subscribe(response => {
          this.tasks = response.data;
        }),
      (error: any) => {
        console.error('Error retrieving tasks:', error);
      };
    }
  }

  goToDelete(id: number) {
    this.router.navigate(['/delete',id]);
  }

  goToUpdate(id: number) {
    this.router.navigate(['/update/{taskId}']);
  }

  getTaskById(id: number) {
  this.http.get<{ data: any }>(`http://localhost:8080/api/tasks/${id}`)
    .subscribe(
      response => {
        this.task = response.data;
        this.modalService.open(this.content); // Pass your modal template reference here
      },
      (error: any) => {
        console.error('Error retrieving task:', error);
      }
    );
}

  goToHome() {
    this.router.navigate(['/home']);
  }

}


