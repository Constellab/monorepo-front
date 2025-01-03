import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunningProcessComponent } from './component/lab-running-process/lab-running-process.component';
import { LabQuickConfigureProcessDialogComponent } from './component/lab-quick-configure-process-dialog/lab-quick-configure-process-dialog.component';
import { LabCoreModule } from '../../lab-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabProgressBarCoreModule } from '../lab-progress-bar-core/lab-progress-bar-core.module';
import { LabConfigCoreModule } from '../lab-config-core/lab-config-core.module';

@NgModule({
  declarations: [LabRunningProcessComponent, LabQuickConfigureProcessDialogComponent],
  exports: [LabRunningProcessComponent, LabQuickConfigureProcessDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LabCoreModule,
    LabProgressBarCoreModule,
    LabConfigCoreModule,
  ],
})
export class LabProcessCoreModule {}
