import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiStartLogFileObject, LiSystemService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Dialog to display start logs main errors
 */
@Component({
  selector: 'lab-start-logs-dialog',
  templateUrl: './lab-start-logs-dialog.component.html',
  styleUrl: './lab-start-logs-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, MatDialogContent, FlSectionModule, TranslatePipe],
})
export class LabStartLogsDialogComponent {
  private systemService = inject(LiSystemService);

  startLogs$: Observable<LiStartLogFileObject> = this.systemService.getStartLogs();
}
