import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from './task.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class TasksService {
  private tasks: Task[] = [];
  private tasksUpdated = new Subject<{tasks: Task[], taskCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getTasks(tasksPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${tasksPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, tasks: any, maxTasks: number}>('http://localhost:3000/api/tasks' + queryParams)
    .pipe(
      map(taskData => {
       return { tasks: taskData.tasks.map(task => {
        return {
          title: task.title,
          content: task.content,
          id: task._id,
          imagePath: task.imagePath,
          creator: task.creator
        };
       }), maxTasks: taskData.maxTasks
      };
    })
    )
    .subscribe(transformedTasksData => {
        this.tasks = transformedTasksData.tasks;
        this.tasksUpdated.next({
          tasks: [...this.tasks],
          taskCount: transformedTasksData.maxTasks
        });
    });
  }

  getTaskUpdateListener() {
    return this.tasksUpdated.asObservable();
  }

  getTask(id: string){
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>("http://localhost:3000/api/tasks/" + id);
  }
  addTask(title: string, content: string, image: File){
    const taskData = new FormData();
      taskData.append("title", title);
      taskData.append("content", content);
      taskData.append("image", image, title);
      this.http
      .post<{message: string, task: Task}>(
        'http://localhost:3000/api/tasks',
        taskData
        )
      .subscribe((responseData) => {

        this.router.navigate(["/"]);
    });
  }

  updateTask(id: string, title: string, content: string, image: File | string){
    let taskData: Task | FormData ;
    if (typeof(image) === 'object') {
      console.log(image);
      taskData = new FormData();
      taskData.append("id", id);
      taskData.append("title", title);
      taskData.append("content", content);
      taskData.append("image", image, title);
    } else {
        taskData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }

    this.http
    .put("http://localhost:3000/api/tasks/" + id, taskData)
    .subscribe(response => {
      this.router.navigate(["/"]);
    });
  }

  deleteTask(taskId: string) {
    return this.http.delete("http://localhost:3000/api/tasks/" + taskId);

  }
}
