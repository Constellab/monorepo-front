import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabPipPackagesDialogComponent} from './component/lab-pip-packages-dialog/lab-pip-packages-dialog.component';
import {LabCoreModule} from '../../lab-core.module';


@NgModule({
  declarations: [
    LabPipPackagesDialogComponent
  ],
  imports: [
    CommonModule,

    LabCoreModule,
  ],
  exports: [
    LabPipPackagesDialogComponent
  ]
})
export class LabSystemCoreModule { }
