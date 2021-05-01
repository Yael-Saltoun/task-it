import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';

import { Task } from '../task.model';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  // tasks = [
  //   {title:'First Task',content: 'This is the first task\'s content'},
  //   {title:'Second Task',content: 'This is the second task\'s content'},
  //   {title:'Third Task',content: 'This is the third task\'s content'},
  // ];
  tasks: Task[] = [];
  isLoading = false;
  totalTasks = 10;
  tasksPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private tasksSub: Subscription;

  constructor(public tasksService: TasksService) { }

  ngOnInit() {
    this.isLoading = true;
    this.tasksService.getTasks(this.tasksPerPage, this.currentPage);
    this.tasksSub = this.tasksService.getTaskUpdateListener()
      .subscribe((taskData: {tasks: Task[], taskCount: number}) => {
        this.isLoading = false;
        this.totalTasks = taskData.taskCount;
        this.tasks = taskData.tasks;
      });
  }
  onDelete(taskId: string) {
    this.isLoading = true;
    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.currentPage -= 1;
      this.tasksService.getTasks(this.tasksPerPage, this.currentPage);
    });
  }
  ngOnDestroy() {
    this.tasksSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.tasksPerPage = pageData.pageSize;
    this.tasksService.getTasks(this.tasksPerPage, this.currentPage);
  }

}
