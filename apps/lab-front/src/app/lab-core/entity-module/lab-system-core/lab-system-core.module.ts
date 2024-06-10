import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabSystemConfigDialogComponent} from './component/lab-system-config-dialog/lab-system-config-dialog.component';
import {LabCoreModule} from '../../lab-core.module';


@NgModule({
  declarations: [
    LabSystemConfigDialogComponent
  ],
  imports: [
    CommonModule,

    LabCoreModule,
  ],
  exports: [
    LabSystemConfigDialogComponent
  ]
})
export class LabSystemCoreModule { }
