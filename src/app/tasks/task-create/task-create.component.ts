import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Task } from "../task.model";
import { TasksService } from "../tasks.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  task: Task;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private taskId: string;


  constructor(
    public tasksService: TasksService,
    public route: ActivatedRoute
    ) {}

  ngOnInit() {
    console.log(this.mode);
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taskId')) {
        this.mode = 'edit';
        this.taskId = paramMap.get('taskId');
        this.isLoading = true;
        this.tasksService.getTask(this.taskId).subscribe(taskData => {
          this.isLoading = false;
          this.task = {
            id: taskData._id,
            title: taskData.title,
            content: taskData.content,
            imagePath: taskData.imagePath
          };
          this.form.setValue({
            'title': this.task.title,
            'content': this.task.content,
            'image': this.task.imagePath
           });
        });
      } else {
        this.mode = 'create';
        this.taskId = null;
      }
    });
  }

onImagePicked(event: Event) {
  const file = (event.target as HTMLInputElement).files[0];

  this.form.patchValue({image: file});
  this.form.get('image').updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
  };
  reader.readAsDataURL(file);
}

  onSaveTask() {
      if (this.form.invalid) {
      return;
    }
    //this.isLoading = true;
    if (this.mode === 'create') {
      this.tasksService.addTask(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    } else {
      this.tasksService.updateTask(
        this.taskId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    };
    this.form.reset();
  }
}

