import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";

import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskListComponent } from './task-list/task-list.component';

@NgModule ({
  declarations:[
    TaskCreateComponent,
    TaskListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule
    ]
})
export class TaskModule {}
