import { Component, inject } from '@angular/core';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { LabViewConfigSearchComponent } from '../lab-view-config-search/lab-view-config-search.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-select-view-config-dialog',
  templateUrl: './lab-select-view-config-dialog.component.html',
  styleUrls: ['./lab-select-view-config-dialog.component.scss'],
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, LabViewConfigSearchComponent, TranslatePipe],
})
export class LabSelectViewConfigDialogComponent {
  private dialogRef = inject<MatDialogRef<LabSelectViewConfigDialogComponent>>(MatDialogRef);

  noteId: string;

  constructor() {
    const noteId = inject(MAT_DIALOG_DATA);

    this.noteId = noteId;
  }

  onViewConfigSelected(viewConfig: LabViewConfig): void {
    if (viewConfig.viewType) {
      this.dialogRef.close(viewConfig);
    }

    this.dialogRef.close(viewConfig);
  }
}
