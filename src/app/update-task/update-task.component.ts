import { Component, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  imports: [NgbModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  styleUrl: './update-task.component.css'
})

export class UpdateTaskComponent {
  public taskForm!: FormGroup;
  isUpdating = false;
  responseMessage: any = '';
  responseCode: any = '';
  task: any = {
    taskId: '',
    taskName: '',
    taskDescription: '',
    taskStatus: '',
    taskDueDate: ''
  };
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal,
  ) {
    this.taskForm = this.fb.group({
      taskId: ['', Validators.required],
      taskName: ['', Validators.required],
      taskDescription: ['', Validators.required],
      taskStatus: ['', Validators.required],
      taskDueDate: ['', Validators.required]
    });
  }

  @ViewChild('failedModal') failedModal!: TemplateRef<any>;
  @ViewChild('successModal') successModal!: TemplateRef<any>;

  goToHome() {
    this.router.navigate(['/home']);
  }

  onSubmitUpdate() {
    if (this.taskForm.invalid) return;
    this.isUpdating = true;
    this.task = {
      taskId: this.taskForm.value.taskId,
      taskName: this.taskForm.value.taskName,
      taskDescription: this.taskForm.value.taskDescription,
      taskStatus: this.taskForm.value.taskStatus,
      taskDueDate: this.taskForm.value.taskDueDate
    };

    this.updateTask(this.taskForm.value.taskId, this.task).subscribe(response => {

      if (response.responseCode == '00') {
        this.task = response.data;
        this.responseMessage = response.responseMessage;
        this.modalService.open(this.successModal);
       
      } else {
        this.responseMessage = response.responseMessage;
        this.modalService.open(this.failedModal);
        
      }
    },
      error => {
        this.modalService.dismissAll();
      }
    );
  }

  updateTask(taskId: string, taskData: any): Observable<any> {
    return this.http.put('http://3.10.228.46:8080/api/tasks', taskData)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Failed to update task'));
        })
      );
  }

  closeAllModals() {
    this.modalService.dismissAll();
  }

}

