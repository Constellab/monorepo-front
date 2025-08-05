import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerCloudSearchComponent } from '../ca-server-cloud-search/ca-server-cloud-search.component';

@Component({
  selector: 'ca-select-server-cloud-dialog',
  templateUrl: './ca-select-server-cloud-dialog.component.html',
  styleUrl: './ca-select-server-cloud-dialog.component.scss',
  imports: [FlDialogModule, MatDialogContent, CaServerCloudSearchComponent, TranslatePipe],
})
export class CaSelectServerCloudDialogComponent {
  private dialogRef = inject<MatDialogRef<CaSelectServerCloudDialogComponent>>(MatDialogRef);

  selectServerCloud(serverCloud: CaServerCloud): void {
    this.dialogRef.close(serverCloud);
  }
}
