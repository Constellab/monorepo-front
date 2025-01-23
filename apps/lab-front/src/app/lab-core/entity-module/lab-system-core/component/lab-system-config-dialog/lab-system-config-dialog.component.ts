import { Component, inject } from '@angular/core';
import { LabSystemService } from '../../../../service/lab-system.service';
import { Observable } from 'rxjs';
import { LabSystemConfig } from '../../../../model/global/lab-system.class';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent } from '@angular/material/dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
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
