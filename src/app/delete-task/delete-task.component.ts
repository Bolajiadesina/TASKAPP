
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-delete-task',
  imports: [CommonModule,
    FormsModule,
    HttpClientModule],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.css'
})
export class DeleteTaskComponent {

  taskForm: FormGroup;
  constructor(private router: Router, private http: HttpClient,
    private modalService: NgbModal, private route: ActivatedRoute, private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      taskId: ['']
    });
  }

  deleteItemid: string = '';
  taskId: string = '';
  responseMessage: any = '';
  responseCode: any = '';
  tasks: any[] = [];
  task: any = {
    taskId: '',
    taskName: '',
    taskDescription: '',
    taskStatus: '',
    taskDueDate: ''
  };


  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('failedModal') failedModal!: TemplateRef<any>;
  @ViewChild('successModal') successModal!: TemplateRef<any>;

  ngOnInit() {
    console.log('route:', this.route);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<{ data: any }>(`http://localhost:8080/api/tasks/${id}`)
        .subscribe(
          response => {
            this.task = response.data;
          },
          error => {
            console.error('Error retrieving task:', error);
          }
        );
    }
  }


  getTaskById(taskId: string) {
    this.http.get<{
      responseCode: string;
      responseMessage: string;
      data: any;
    }>(`http://localhost:8080/api/tasks/${taskId}`)
      .subscribe(
        response => {
          if (response.responseCode != '00') {
            this.task = response.data;
            this.modalService.open(this.detailsModal);
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

  getTaskByIdForDelete() {
    this.http.get<{
      responseCode: string;
      responseMessage: string;
      data: any;
    }>(`http://localhost:8080/api/tasks/${encodeURIComponent(this.taskId)}`)
      .subscribe(
        response => {
          if (response.responseCode == '00') {
            this.task = response.data;
            this.closeAllModals();
            this.modalService.open(this.detailsModal);
          } else {
            this.responseMessage = response.responseMessage
            this.closeAllModals();
            this.modalService.open(this.failedModal);
          }
        },
        (error: any) => {
          console.error('Error retrieving task:', error);
        }
      );
  }

  deleteTaskDetails() {
    if (!this.taskId) {
      console.error('Task ID is required');
      return;
    }

    this.http.delete<{
      responseCode: string;
      responseMessage: string;
      data: any;
    }>(`http://localhost:8080/api/tasks/${this.taskId}`)
      .subscribe(
        response => {
          this.task = response.data;
          this.modalService.open(this.detailsModal);

        },
        (error: any) => {
          console.error('Error retrieving task:', error);
        }
      );
  }


  deleteTask(taskId: any) {
    this.closeAllModals();
    this.http.delete<{
      responseCode: string;
      responseMessage: string;
      data: any;
    }>(`http://localhost:8080/api/tasks/${taskId}`)
      .subscribe(
        response => {
          if (response.responseCode != '00') {

            this.task = response.data;
            this.responseMessage = response.responseMessage

            this.modalService.open(this.successModal);
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

  closeAllModals() {
    this.modalService.dismissAll();
  }
  goToHome() {
    this.router.navigate(['/home']);
  }

}

