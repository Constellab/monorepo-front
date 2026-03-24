import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiCredentials } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiCredentialsSearchComponent } from '../li-credentials-search/li-credentials-search.component';

@Component({
  selector: 'li-select-credentials-dialog',
  templateUrl: './li-select-credentials-dialog.component.html',
  styleUrls: ['./li-select-credentials-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LiCredentialsSearchComponent, TranslatePipe],
})
export class LiSelectCredentialsDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectCredentialsDialogComponent>>(MatDialogRef);

  columns: FlTableColumnStatic<LiCredentials>[] = ['name', 'description', 'type', 'created'];

  onCredentialsSelected(credentials: LiCredentials): void {
    this.dialogRef.close(credentials);
  }
}
