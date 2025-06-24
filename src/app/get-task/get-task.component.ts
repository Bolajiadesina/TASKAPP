import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  deleteItemid: number = 0;
  taskId: number = 0;
  responseMessage: any = '';
  responseCode: any = '';

  constructor(private router: Router, private http: HttpClient, private modalService: NgbModal,) {
    const nav = this.router.getCurrentNavigation();
    this.tasks = nav?.extras.state?.['tasks'] || [];
  }
  @ViewChild('content') content!: TemplateRef<any>; // <-- Add this line
  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('failedModal') failedModal!: TemplateRef<any>;
  @ViewChild('successModal') successModal!: TemplateRef<any>;
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


  deleteTask(id: number) {
    this.http.delete<{
      responseCode: string;
      responseMessage: string;
      data: any;
    }>(`http://localhost:8080/api/tasks/${id}`)
      .subscribe(
        response => {
          if (response.responseCode != '00') {
            //this.modalService.dismissAll(this.confirmDeleteModal);
            this.task = response.data;
            this.responseMessage = response.responseMessage
            this.modalService.open(this.confirmDeleteModal);
            this.modalService.dismissAll(this.confirmDeleteModal);
            this.modalService.open(this.successModal);
            this.modalService.dismissAll();
          } else {
            this.responseMessage = response.responseMessage
            this.modalService.open(this.failedModal);
          }

        },
        (error: any) => {
          console.error('Error retrieving task:', error);
        }
      );
  }

  deleteSelectedItem(id: number) {
    this.http.get<{ data: any }>(`http://localhost:8080/api/tasks/${id}`)
      .subscribe(
        response => {
          this.task = response.data;
          this.modalService.open(this.confirmDeleteModal);
        },
        (error: any) => {
          console.error('Error retrieving task:', error);
        }
      );
    
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


  deleteItem(id: number) {
    this.closeAllModals();
   
    this.http.delete<{ responseCode: string; responseMessage: string; data: any; }>(`http://localhost:8080/api/tasks/${id}`)
      .subscribe(
        response => {
          if (response.responseCode == '00') {
            this.task = response.data;
            this.responseMessage = response.responseMessage;
            this.modalService.open(this.successModal); 
            setTimeout(() => window.location.reload(), 2000);
          } else {
            this.responseMessage = response.responseMessage;
            this.modalService.open(this.failedModal);
            setTimeout(() => window.location.reload(), 2000);
          }
        },
        error => {
          console.error('Error retrieving task:', error);
          this.modalService.open(this.failedModal);
        }
      );
  }

  goToHome() {
    this.router.navigate(['/home']);
  }


  closeAllModals(){
    this.modalService.dismissAll();
  }

}


