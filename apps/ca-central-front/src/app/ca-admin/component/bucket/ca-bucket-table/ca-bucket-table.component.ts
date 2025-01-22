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

@Component({
  selector: 'ca-bucket-table',
  templateUrl: './ca-bucket-table.component.html',
  styleUrls: ['./ca-bucket-table.component.scss'],
  standalone: false,
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
