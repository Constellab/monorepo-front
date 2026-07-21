import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiViewConfig } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiViewConfigSearchComponent } from '../li-view-config-search/li-view-config-search.component';

@Component({
  selector: 'li-select-view-config-dialog',
  templateUrl: './li-select-view-config-dialog.component.html',
  styleUrls: ['./li-select-view-config-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, MatDialogContent, LiViewConfigSearchComponent, TranslatePipe],
})
export class LiSelectViewConfigDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectViewConfigDialogComponent>>(MatDialogRef);

  noteId: string = inject(MAT_DIALOG_DATA);

  onViewConfigSelected(viewConfig: LiViewConfig): void {
    if (viewConfig.viewType) {
      this.dialogRef.close(viewConfig);
    }

    this.dialogRef.close(viewConfig);
  }
}
