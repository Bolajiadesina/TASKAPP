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

  today: string = new Date().toISOString().split('T')[0];

  @ViewChild('content') content!: TemplateRef<any>;

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

  // onSubmit() {
  //   if (this.taskForm.valid) {
  //     this.modalData = this.taskForm.value;
  //     this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  //   }
  // }

  onSubmit() {
    if (this.taskForm.valid) {
      this.modalData = this.taskForm.value;
      setTimeout(() => {
        this.modalService.open(this.content);
      }, 0);
    }
  }


  onSubmitModal(formValue: any) {
    console.log('Form Value:', formValue);
    this.http.post('http://localhost:8080/api/tasks/create', formValue).subscribe(
      response => {
        console.log('Task created successfully:', response);
        this.modalService.dismissAll();
        alert('Task created successfully!');
        this.router.navigate(['/home']); 
      },
      error => {
        console.error('Error creating task:', error);
        this.modalService.dismissAll();
      }
    );
  }



  goToHome() {
    this.router.navigate(['/home']);
  }
}