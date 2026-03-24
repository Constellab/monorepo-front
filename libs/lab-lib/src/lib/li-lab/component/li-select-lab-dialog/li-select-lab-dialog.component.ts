import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiLab } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiLabSearchComponent } from '../li-lab-search/li-lab-search.component';

@Component({
  selector: 'li-select-lab-dialog',
  templateUrl: './li-select-lab-dialog.component.html',
  styleUrls: ['./li-select-lab-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LiLabSearchComponent, TranslatePipe],
})
export class LiSelectLabDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectLabDialogComponent>>(MatDialogRef);

  onLabSelected(lab: LiLab): void {
    this.dialogRef.close(lab);
  }
}
