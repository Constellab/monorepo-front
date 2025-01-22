import { Component, Input, inject } from '@angular/core';
import { CaBucketFull } from '../../../../ca-core/model/entities/ca-object-storage.class';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import { CaObjectStorageService } from '../../../../ca-core/service-api/ca-object-storage.service';
import {
  CaBucketFormDialogComponent,
  CaBucketFormDialogInput,
} from '../ca-bucket-form-dialog/ca-bucket-form-dialog.component';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { CaCloudProviderRegionInlineComponent } from '../../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';
import { CaLabInlineComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-inline/ca-lab-inline.component';
import { FlUserModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-bucket-table',
  templateUrl: './ca-bucket-table.component.html',
  styleUrls: ['./ca-bucket-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
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
