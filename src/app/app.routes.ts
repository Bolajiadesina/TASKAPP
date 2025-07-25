import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Component } from '@angular/core';
import { CreateTaskComponent } from './create-task/create-task.component';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { GetTaskComponent } from './get-task/get-task.component';
import { DeleteTaskComponent } from './delete-task/delete-task.component';
import { LoginComponent } from './login/login';
import { AuthGuard } from './guards/auth-guard';



export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent,  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'create', component: CreateTaskComponent, canActivate: [AuthGuard] },
  { path: 'update', component: UpdateTaskComponent, canActivate: [AuthGuard] },
  { path: 'viewTasks', component: GetTaskComponent, canActivate: [AuthGuard] },
  { path: 'delete', component: DeleteTaskComponent, canActivate: [AuthGuard], data: { renderMode: 'default'} }
];
