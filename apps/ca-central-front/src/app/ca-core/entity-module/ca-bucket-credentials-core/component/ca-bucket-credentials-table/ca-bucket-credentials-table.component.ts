import {Component, Input, OnInit} from '@angular/core';
import {
  FlCheckCredentialsDialogComponent,
  FlCheckCredentialsDialogInput,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  CaBucketCredentials,
  CaBucketCredentialsDatasource,
  CaBucketCredentialsFull
} from '../../../../model/entities/ca-object-storage.class';
import {
  CaBucketCredentialsFormDialogComponent,
  CaBucketCredentialsFormDialogInput
} from '../ca-bucket-credentials-form-dialog/ca-bucket-credentials-form-dialog.component';
import {CaObjectStorageService} from '../../../../service-api/ca-object-storage.service';
import {ClCredentials} from '@monorepo/core-lib';

@Component({
  selector: 'ca-bucket-credentials-table',
  templateUrl: './ca-bucket-credentials-table.component.html',
  styleUrls: ['./ca-bucket-credentials-table.component.scss']
})
export class CaBucketCredentialsTableComponent implements OnInit {

  @Input() datasource: CaBucketCredentialsDatasource;

  @Input() columns: FlTableColumnStatic<CaBucketCredentials>[] =
    ['name', 'cloudProvider', 'space', 's3Username', 'description', 'lastModified', 'actions'];

  constructor(private dialogService: FlDialogService,
              private objectStorageService: CaObjectStorageService) {
  }

  ngOnInit(): void {
  }

  updateBucketCredential(credentials: CaBucketCredentials): void {

    // open user check credentials dialog
    const dialogInput: FlCheckCredentialsDialogInput = {
      onSubmit: (userCredentials: ClCredentials) =>
        this.objectStorageService.getCredentialsData(credentials.id, userCredentials)
    };

    this.dialogService.openSmallDialog(FlCheckCredentialsDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      result => this.openUpdateCredentials(result)
    );

  }

  private openUpdateCredentials(credentials: CaBucketCredentialsFull): void {
    if(credentials == null) return;
    const input: CaBucketCredentialsFormDialogInput = {
      mode: 'update',
      object: credentials
    };

    this.dialogService.openSmallDialog(CaBucketCredentialsFormDialogComponent, {data: input}).afterClosed().subscribe(
      credentials => this.onUpdateClosed(credentials)
    );
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

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result, credentials)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult, credentials: CaBucketCredentials): void {
    if (result.choice) {
      this.datasource.removeItem(credentials);
    }
  }


}
