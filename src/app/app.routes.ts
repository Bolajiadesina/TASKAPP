import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Component } from '@angular/core';
import { CreateTaskComponent } from './create-task/create-task.component';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { GetTaskComponent } from './get-task/get-task.component';
import { DeleteTaskComponent } from './delete-task/delete-task.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: 'create', component: CreateTaskComponent
    },
    {
        path: 'update', component: UpdateTaskComponent,data: { renderMode: 'default'}
    },
    {
        path: 'viewTasks', component: GetTaskComponent
    }, {
        path: 'delete', component: DeleteTaskComponent,data: { renderMode: 'default'}
    }
];
