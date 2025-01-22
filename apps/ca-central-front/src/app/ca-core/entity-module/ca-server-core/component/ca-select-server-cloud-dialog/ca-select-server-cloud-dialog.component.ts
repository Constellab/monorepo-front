import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CaServerCloudSearchComponent } from '../ca-server-cloud-search/ca-server-cloud-search.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-select-server-cloud-dialog',
  templateUrl: './ca-select-server-cloud-dialog.component.html',
  styleUrl: './ca-select-server-cloud-dialog.component.scss',
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, CaServerCloudSearchComponent, TranslatePipe],
})
export class CaSelectServerCloudDialogComponent {
  private dialogRef = inject<MatDialogRef<CaSelectServerCloudDialogComponent>>(MatDialogRef);

  selectServerCloud(serverCloud: CaServerCloud): void {
    this.dialogRef.close(serverCloud);
  }
}
