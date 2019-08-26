import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharemodModule } from '../sharemod/sharemod.module';
import { AdminRoutingModule } from './admin-routing.module';
import { ProjectComponent } from './project/project.component';
import { UsersComponent } from './users/users.component';
import { AdminComponent } from './admin.component';
import { InputComponent } from './project/input/input.component';

@NgModule({
  declarations: [ProjectComponent, UsersComponent, AdminComponent, InputComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharemodModule
  ]
})
export class AdminModule { }
