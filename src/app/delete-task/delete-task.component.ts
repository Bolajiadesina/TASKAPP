
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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


  constructor(private router: Router, private http: HttpClient, private modalService: NgbModal, private route: ActivatedRoute,) {

  }



  deleteItemid: number = 0;
  taskId: number = 0;
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<{ data: any }>(`http://localhost:8080/api/tasks/${id}`)
        .subscribe(
          response => {
            this.task = response.data;
            setTimeout(() => this.modalService.open(this.confirmDeleteModal)); // open modal after view init
          },
          error => {
            console.error('Error retrieving task:', error);
          }
        );
    }
  }


  getTaskById(id: number) {
    this.http.get<{
      responseCode: string;
      responseMessage: string;
      data: any;
    }>(`http://localhost:8080/api/tasks/${id}`)
      .subscribe(
        response => {
          // this.task = response.data;
          // this.modalService.open(this.detailsModal); // Pass your modal template reference here
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
    this.deleteItemid = this.taskId;
    this.http.get<{
      responseCode: string;
      responseMessage: string;
      data: any;
    }>(`http://localhost:8080/api/tasks/${this.deleteItemid}`)
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

  closeAllModals() {
    this.modalService.dismissAll();

  }
  goToHome() {
    this.router.navigate(['/home']);
  }

}

