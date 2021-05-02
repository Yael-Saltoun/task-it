import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { TaskCreateComponent } from "./tasks/task-create/task-create.component";
import { TaskListComponent } from "./tasks/task-list/task-list.component";

const routes: Routes = [
  { path: '', component: TaskListComponent},
  { path: 'create', component: TaskCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:taskId', component: TaskCreateComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
