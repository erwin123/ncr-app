import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { LyCardModule } from '@alyle/ui/card';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyListModule } from '@alyle/ui/list';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LyGridModule } from '@alyle/ui/grid';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LySnackBarModule } from '@alyle/ui/snack-bar';
import { FilterEnumPipe } from '../pipes/filter-enum.pipe';
import { GroupByPipe } from '../pipes/group-by.pipe';
import { ProgressBarModule } from "angular-progress-bar";
import { Ng5SliderModule } from 'ng5-slider';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { TableModule } from 'ngx-easy-table';
import { NgSelectModule } from '@ng-select/ng-select';
import { LyCheckboxModule } from '@alyle/ui/checkbox';

@NgModule({
  declarations: [
    FilterEnumPipe,
    GroupByPipe
  ],
  imports: [
    CommonModule,
    DeviceDetectorModule.forRoot(),
    LyDrawerModule,
    LyButtonModule,
    LyToolbarModule,
    LyResizingCroppingImageModule,
    LyIconModule,
    LyListModule,
    LyMenuModule,
    LyTypographyModule,
    LyCardModule,
    LyGridModule,
    NgxChartsModule,
    LyFieldModule,
    ReactiveFormsModule,
    FormsModule,
    LySelectModule,
    LyDialogModule,
    LySnackBarModule,
    ProgressBarModule,
    Ng5SliderModule,
    LyRadioModule,
    TableModule,
    NgSelectModule,
    LyCheckboxModule
  ],
  exports: [LyDrawerModule,
    DeviceDetectorModule,
    LyButtonModule,
    LyToolbarModule,
    LyResizingCroppingImageModule,
    LyIconModule,
    LyListModule,
    LyMenuModule,
    LyTypographyModule,
    FormsModule,
    LyCardModule,
    LyGridModule,
    NgxChartsModule,
    LyFieldModule,
    ReactiveFormsModule,
    ProgressBarModule,
    LySelectModule,
    LyDialogModule,
    LySnackBarModule,
    FilterEnumPipe,
    GroupByPipe,
    Ng5SliderModule,
    LyRadioModule,
    NgSelectModule,
    LyCheckboxModule,
    TableModule]
})
export class SharemodModule { }
