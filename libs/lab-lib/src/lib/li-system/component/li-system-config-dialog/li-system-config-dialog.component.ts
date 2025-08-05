import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, inject } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiSystemConfig, LiSystemService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Dialog to list the pip packages of the system
 */
@Component({
  selector: 'li-system-config-dialog',
  templateUrl: './li-system-config-dialog.component.html',
  styleUrl: './li-system-config-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlSectionModule,
    FlKeyValueModule,
    TranslatePipe,
  ],
})
export class LiSystemConfigDialogComponent {
  private systemService = inject(LiSystemService);

  systemConfig$: Observable<LiSystemConfig> = this.systemService.getSystemConfig();
}
