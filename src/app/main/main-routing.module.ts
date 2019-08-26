import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { LandingComponent } from './landing/landing.component';
import { BaseTicketComponent } from './base-ticket/base-ticket.component';
import { StreamTaskComponent } from './stream-task/stream-task.component';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { ProgressComponent } from './progress/progress.component';
import { DialogPicComponent } from './dialog-pic/dialog-pic.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { AuthguardService } from '../services/authguard.service';

const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent,
    data: { state: 'landing' },
    canActivate:[AuthguardService]
  },
  {
    path: 'building/:type',
    component: BaseTicketComponent,
    data: { state: 'baseticket' },
    canActivate:[AuthguardService]
  },
  {
    path: 'infra/:type',
    component: BaseTicketComponent,
    data: { state: 'baseticket' },
    canActivate:[AuthguardService]
  },
  {
    path: 'foundation/:type',
    component: BaseTicketComponent,
    data: { state: 'baseticket' },
    canActivate:[AuthguardService]
  },
  {
    path: 'info',
    component: InfoComponent
  },
  {
    path: 'my-report',
    component: StreamTaskComponent,
    data: { state: 'feed' },
    canActivate:[AuthguardService]
  },
  {
    path: 'dialog',
    component: DialogEditComponent,
    canActivate:[AuthguardService]
  },
  {
    path: 'dialog-info',
    component: DialogInfoComponent,
    canActivate:[AuthguardService]
  },
  {
    path: 'dialog-pic',
    component: DialogPicComponent,
    canActivate:[AuthguardService]
  },
  {
    path: 'dialog-pic',
    component: DialogPicComponent,
    canActivate:[AuthguardService]
  },
  {
    path: 'dialog-confirm',
    component: DialogConfirmComponent,
    canActivate:[AuthguardService]
  },
  {
    path: 'progress',
    component: ProgressComponent,
    data: { state: 'progress' },
    canActivate:[AuthguardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
