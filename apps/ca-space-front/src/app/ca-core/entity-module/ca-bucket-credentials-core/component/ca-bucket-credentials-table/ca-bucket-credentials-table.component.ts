import { Component, inject, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
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
import { ClCredentials } from '@monorepo/core-lib';
import {
  FlCheckCredentialsDialogComponent,
  FlCheckCredentialsDialogInput,
} from '@monorepo/front-core-lib/fl-auth';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaBucketCredentials,
  CaBucketCredentialsDatasource,
  CaBucketCredentialsFull,
} from '../../../../model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../service-api/ca-object-storage.service';
import { CaCloudProviderInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-inline/ca-cloud-provider-inline.component';
import { CaSpaceInlineComponent } from '../../../ca-space-core/component/ca-space-inline/ca-space-inline.component';
import {
  CaBucketCredentialsFormDialogComponent,
  CaBucketCredentialsFormDialogInput,
} from '../ca-bucket-credentials-form-dialog/ca-bucket-credentials-form-dialog.component';

@Component({
  selector: 'ca-bucket-credentials-table',
  templateUrl: './ca-bucket-credentials-table.component.html',
  styleUrls: ['./ca-bucket-credentials-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    CaCloudProviderInlineComponent,
    CaSpaceInlineComponent,
    FlUserModule,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class CaBucketCredentialsTableComponent {
  private dialogService = inject(FlDialogService);
  private objectStorageService = inject(CaObjectStorageService);

  @Input() datasource: CaBucketCredentialsDatasource;

  @Input() columns: FlTableColumnStatic<CaBucketCredentials>[] = [
    'name',
    'cloudProvider',
    'space',
    's3Username',
    'description',
    'lastModified',
    'actions',
  ];

  updateBucketCredential(credentials: CaBucketCredentials): void {
    // open user check credentials dialog
    const dialogInput: FlCheckCredentialsDialogInput = {
      onSubmit: (userCredentials: ClCredentials) =>
        this.objectStorageService.getCredentialsData(credentials.id, userCredentials),
    };

    this.dialogService
      .openSmallDialog(FlCheckCredentialsDialogComponent, {
        data: dialogInput,
      })
      .afterClosed()
      .subscribe((result) => this.openUpdateCredentials(result));
  }

  private openUpdateCredentials(credentials: CaBucketCredentialsFull): void {
    if (credentials == null) return;
    const input: CaBucketCredentialsFormDialogInput = {
      mode: 'update',
      object: credentials,
    };

    this.dialogService
      .openSmallDialog(CaBucketCredentialsFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((credentials) => this.onUpdateClosed(credentials));
  }

  private onUpdateClosed(credentials?: CaBucketCredentials): void {
    if (credentials) {
      this.datasource.updateItem(credentials);
    }
  }

  deleteBucketCredentials(credentials: CaBucketCredentials): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_bucket_credentials',
      content: 'delete_bucket_credentials_confirm',
      observable: this.objectStorageService.deleteCredentials(credentials.id),
      successMessage: 'bucket_credentials_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, credentials));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, credentials: CaBucketCredentials): void {
    if (result.choice) {
      this.datasource.removeItem(credentials);
    }
  }
}
