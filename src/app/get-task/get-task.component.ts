import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild, TemplateRef } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';


@Component({
  selector: 'app-get-task',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, NgxPaginationModule, FormsModule],
  templateUrl: './get-task.component.html',
  styleUrl: './get-task.component.css'
})
export class GetTaskComponent {


  page = 1;
  filterText: string = '';
  tasks: any[] = [];
  task: any = {
    taskId: 0,
    taskName: '',
    taskDescription: '',
    taskStatus: '',
    taskDueDate: ''
  };
  deleteItemid: number = 0;
  taskId: any = 0;
  responseMessage: any = '';
  responseCode: any = '';
  statusForm: any;

  constructor(private router: Router, public http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService: AuthService) {
    const nav = this.router.getCurrentNavigation();
    this.authService = authService;
    this.tasks = nav?.extras.state?.['tasks'] || [];
    this.statusForm = this.fb.group({
      taskStatus: ['']
    });
  }
  @ViewChild('content') content!: TemplateRef<any>;
  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('failedModal') failedModal!: TemplateRef<any>;
  @ViewChild('successModal') successModal!: TemplateRef<any>;
  @ViewChild('statusUpdateModal') statusUpdateModal!: TemplateRef<any>;


  ngOnInit() {
    if (!this.tasks.length) {

      this.http.get<{ data: any[] }>('http://localhost:8080/api/tasks/getAll')
        .subscribe(response => {
          this.tasks = response.data;
        }),
        (error: any) => {
          console.error('Error retrieving tasks:', error);
        };
    }
  }


  deleteTask(id: any) {
    this.http.delete<{
      responseCode: string;
      responseMessage: string;
      data: any;
    }>(`http://localhost:8080/api/tasks/${id}`)
      .subscribe(
        response => {
          if (response.responseCode != '00') {
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

  deleteSelectedItem(id: any) {
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

  getTaskById(id: any) {
    this.http.get<{ data: any }>(`http://localhost:8080/api/tasks/${id}`)
      .subscribe(
        response => {
          this.task = response.data;
          this.modalService.open(this.content);
        },
        (error: any) => {
          console.error('Error retrieving task:', error);
        }
      );
  }


  deleteItem(taskId: any) {
    this.closeAllModals();

    this.http.delete<{ responseCode: string; responseMessage: string; data: any; }>(`http://localhost:8080/api/tasks/${taskId}`)
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


  closeAllModals() {
    this.modalService.dismissAll();
  }

  updateTaskStatus(taskId: String) {
    this.http.get<{ data: any }>(`http://localhost:8080/api/tasks/${taskId}`)
      .subscribe(
        response => {
          this.task = response.data;
          this.modalService.open(this.statusUpdateModal);
        },
        (error: any) => {
          console.error('Error retrieving task:', error);
        }
      );
  }

  changeTaskStatus(taskId: string, taskName: string, taskDescription: string, taskDueDate: string) {
    this.task.taskStatus = this.statusForm.get('taskStatus').value;
    this.task.taskId = taskId;
    this.task.taskName = taskName;
    this.task.taskDescription = taskDescription;
    this.task.taskDueDate = taskDueDate;
    console.log(this.task.taskStatus);


    this.http.put<{ responseCode: string; responseMessage: string; data: any; }>(
      'http://localhost:8080/api/tasks',
      this.task
    ).subscribe(
      response => {
        if (response.responseCode == '00') {
          this.task = response.data;
          this.responseMessage = response.responseMessage;
          this.modalService.open(this.successModal);
          setTimeout(() => window.location.reload(), 2000);
        } else {
          this.responseMessage = response.responseMessage;
          this.modalService.open(this.failedModal);

        }
      },
      error => {
        console.error('Error updating task:', error);
        this.modalService.dismissAll();
      }
    );
  }

  getTimeliness(task: any): 'On Time' | 'Overdue' | 'Due' {
    if (!task.taskDueDate) return 'Due';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(task.taskDueDate);
    due.setHours(0, 0, 0, 0);

    // 1. Completed tasks are always "On Time"
    if (task.taskStatus === 'COMPLETED') {
      return 'On Time';
    }

    // 2. If due date is before today, and not completed
    if (due.getTime() < today.getTime()) {
      return 'Overdue';
    }

    // 3. Due today or in future, and not completed
    return 'Due';
  }





  get filteredTasks() {
    if (!this.filterText) return this.tasks;
    const lower = this.filterText.toLowerCase();
    return this.tasks.filter(task =>
      (task.taskName && task.taskName.toLowerCase().includes(lower)) ||
      (task.taskDescription && task.taskDescription.toLowerCase().includes(lower)) ||
      (task.taskStatus && task.taskStatus.toLowerCase().includes(lower)) ||
      (task.taskId && task.taskId.toLowerCase().includes(lower))
    );
  }

  logout(): void {
    this.authService.logout();
  }

}


