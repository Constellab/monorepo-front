import { Component, inject } from '@angular/core';
import { LabSystemService } from '../../../../service/lab-system.service';
import { Observable } from 'rxjs';
import { LabSystemConfig } from '../../../../model/global/lab-system.class';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent } from '@angular/material/dialog';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to list the pip packages of the system
 */
@Component({
  selector: 'lab-system-config-dialog',
  templateUrl: './lab-system-config-dialog.component.html',
  styleUrl: './lab-system-config-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlSectionModule,
    FlKeyValueModule,
    TranslatePipe,
  ],
})
export class LabSystemConfigDialogComponent {
  private systemService = inject(LabSystemService);

  systemConfig$: Observable<LabSystemConfig> = this.systemService.getSystemConfig();
}
