import { Component, inject, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaCloudProviderRegionInlineComponent } from '../../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';
import { CaLabInlineComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-inline/ca-lab-inline.component';
import { CaBucketFull } from '../../../../ca-core/model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../ca-core/service-api/ca-object-storage.service';
import {
  CaBucketFormDialogComponent,
  CaBucketFormDialogInput,
} from '../ca-bucket-form-dialog/ca-bucket-form-dialog.component';

@Component({
  selector: 'ca-bucket-table',
  templateUrl: './ca-bucket-table.component.html',
  styleUrls: ['./ca-bucket-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    CaCloudProviderRegionInlineComponent,
    CaLabInlineComponent,
    FlUserModule,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class CaBucketTableComponent {
  private dialogService = inject(FlDialogService);
  private objectStorageService = inject(CaObjectStorageService);

  @Input({ required: true }) datasource: FlArrayObs<CaBucketFull>;

  @Input() columns: FlTableColumnStatic<CaBucketFull>[] = [
    'name',
    'contentType',
    'object',
    'credentials',
    'lastModified',
    'actions',
  ];

  updateBucket(bucket: CaBucketFull): void {
    const input: CaBucketFormDialogInput = {
      mode: 'update',
      object: bucket,
    };

    this.dialogService
      .openSmallDialog(CaBucketFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((region) => this.onUpdateClosed(region));
  }

  private onUpdateClosed(bucket?: CaBucketFull): void {
    if (bucket) {
      this.datasource.updateItem(bucket);
    }
  }

  deleteBucket(bucket: CaBucketFull): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_bucket',
      content: 'delete_bucket_confirm',
      observable: this.objectStorageService.deleteBucket(bucket.id),
      successMessage: 'bucket_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, bucket));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, bucket: CaBucketFull): void {
    if (result.choice) {
      this.datasource.removeItem(bucket);
    }
  }
}
