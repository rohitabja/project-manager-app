import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTaskComponent } from 'src/app/task/add-task/add-task.component';
import { ViewTaskComponent } from 'src/app/task/view-task/view-task.component';
import { AddUserComponent } from 'src/app/user/add-user/add-user.component';
import { AddProjectComponent } from 'src/app/project/add-project/add-project.component';

const routes: Routes = [
  {path: 'addTask', component: AddTaskComponent, runGuardsAndResolvers: 'always'},
  {path: 'viewTask', component: ViewTaskComponent},
  {path: '', redirectTo: '/addProject', pathMatch: 'full'},
  {path: 'updateTask/:taskId', component: AddTaskComponent, runGuardsAndResolvers: 'paramsChange'},
  {path: 'addUser', component: AddUserComponent, runGuardsAndResolvers: 'always'},
  {path: 'addUser/:userId', component: AddUserComponent, runGuardsAndResolvers: 'paramsChange'},
  {path: 'addProject', component: AddProjectComponent, runGuardsAndResolvers: 'always'},
  {path: 'addProject/:projectId', component: AddProjectComponent, runGuardsAndResolvers: 'paramsChange'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
