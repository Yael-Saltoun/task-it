import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';


import { Task } from '../task.model';
import { TasksService } from '../tasks.service';
import { AuthService } from "src/app/auth/auth.service";

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
  userIsAuthenticated = false;
  userId: string;
  private tasksSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public tasksService: TasksService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.tasksService.getTasks(this.tasksPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.tasksSub = this.tasksService
      .getTaskUpdateListener()
      .subscribe((taskData: {tasks: Task[], taskCount: number}) => {
        this.isLoading = false;
        this.totalTasks = taskData.taskCount;
        this.tasks = taskData.tasks;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();

      });
  }
  onDelete(taskId: string) {
    this.isLoading = true;
    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.currentPage -= 1;
      this.tasksService.getTasks(this.tasksPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }
  ngOnDestroy() {
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.tasksPerPage = pageData.pageSize;
    this.tasksService.getTasks(this.tasksPerPage, this.currentPage);
  }

}
