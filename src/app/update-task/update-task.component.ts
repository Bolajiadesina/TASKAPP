import { Component, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, throwError } from 'rxjs';



@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  imports: [NgbModule, CommonModule,ReactiveFormsModule]
})

export class UpdateTaskComponent {
  public taskForm!: FormGroup;
  isUpdating = false;
  responseMessage: any = '';
  responseCode: any = '';
  task: any = {
    taskId: 0,
    taskName: '',
    taskDescription: '',
    taskStatus: '',
    taskDueDate: ''
  };


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal,
  ) {
    this.taskForm = this.fb.group({
      taskId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  @ViewChild('failedModal') failedModal!: TemplateRef<any>;
  @ViewChild('successModal') successModal!: TemplateRef<any>;


  goToHome() {
    this.router.navigate(['/home']);
  }


  onSubmit() {
    if (this.taskForm.invalid) return;

    this.isUpdating = true;

    const taskData = {
      task_title: this.taskForm.value.title,
      task_description: this.taskForm.value.description,
      task_status: this.taskForm.value.status,
      task_due_date: this.taskForm.value.dueDate
    };

    this.updateTask(this.taskForm.value.taskId, taskData).subscribe(response => {

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
        console.error('Error creating task:', error);
        this.modalService.dismissAll();
      }
    );

  }

  updateTask(taskId: number, taskData: any): Observable<any> {
    return this.http.put(`http://localhost:8080/api/tasks/${taskId}`, taskData)
      .pipe(
        catchError(error => {
          console.error('Error updating task:', error);
          return throwError(() => new Error('Failed to update task'));
        })
      );
  }

}

