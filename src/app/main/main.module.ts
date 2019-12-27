import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from '../main/info/info.component';
import { MainRoutingModule } from './main-routing.module';
import { ChartbarComponent } from './landing/chartbar/chartbar.component';
import { SharemodModule } from '../sharemod/sharemod.module';
import { LandingComponent } from './landing/landing.component';
import { ImageDrawingComponent } from './image-drawing/image-drawing.component';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';
import { BaseTicketComponent } from './base-ticket/base-ticket.component';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { StreamTaskComponent } from './stream-task/stream-task.component';
import { ContentLoaderModule } from '@netbasal/ngx-content-loader';
import { StreamCardComponent } from './stream-card/stream-card.component';
import { ProgressComponent } from './progress/progress.component';
import { DialogPicComponent } from './dialog-pic/dialog-pic.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { ChartpieComponent } from './landing/chartpie/chartpie.component';
import { ChartlineComponent } from './landing/chartline/chartline.component';


@NgModule({
  declarations: [
    InfoComponent,
    LandingComponent,
    ChartbarComponent,
    ImageDrawingComponent,
    DialogEditComponent,
    BaseTicketComponent,
    DialogInfoComponent,
    StreamTaskComponent,
    StreamCardComponent,
    ProgressComponent,
    DialogPicComponent,
    DialogConfirmComponent,
    ChartpieComponent,
    ChartlineComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharemodModule,
    ContentLoaderModule
  ],
  entryComponents: [DialogInfoComponent]
})
export class MainModule { }
