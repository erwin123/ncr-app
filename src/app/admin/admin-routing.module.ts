import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { UsersComponent } from './users/users.component';
import { AdminComponent } from './admin.component';
import { InputComponent } from './project/input/input.component';


const routes: Routes = [
  {
    path: 'mod', component: AdminComponent,
    children: [
      {
        path: 'project',
        component: ProjectComponent,
        data: { state: 'project' }
      },
      {
        path: 'users',
        component: UsersComponent,
        data: { state: 'users' }
      }
    ]
  },
  {
    path: 'input',
    component: InputComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
