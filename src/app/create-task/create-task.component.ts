import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, NgbModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  public taskForm!: FormGroup;
  modalData: any = {};
  responseMessage: any = '';
  responseCode: any = '';
  task: any = {
    taskId: 0,
    taskName: '',
    taskDescription: '',
    taskStatus: '',
    taskDueDate: ''
  };
  today: string = new Date().toISOString().split('T')[0];

  @ViewChild('content') content!: TemplateRef<any>;
  @ViewChild('failedModal') failedModal!: TemplateRef<any>;
  @ViewChild('successModal') successModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    this.activatedRoute.queryParams.subscribe(param => {
      this.taskForm = this.fb.group({
        taskName: [param['taskName'] || '', Validators.required],
        taskDescription: [param['taskDescription'] || '', Validators.required],
        taskStatus: [param['taskStatus'] || '', Validators.required],
        taskDueDate: [param['taskDueDate'] || '', Validators.required]
      });
    });
  }


//http://3.10.228.46:8080
  onSubmit() {
    if (this.taskForm.valid) {
      this.modalData = this.taskForm.value;
      setTimeout(() => {
        this.modalService.open(this.content);
      }, 0);
    }
  }


  onSubmitModal(formValue: any) {

    this.http.post<{ responseCode: string; responseMessage: string; data: any; }>
      //('http://localhost:8080/api/tasks/create', formValue).subscribe(response => {
         ('http://3.10.228.46:8080/api/tasks/create', formValue).subscribe(response => {

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

  closeAllModals() {
    this.modalService.dismissAll();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}