import { Component, Input, OnInit } from '@angular/core';
import {
  CaBucketCredentials,
  CaBucketCredentialsDatasource,
} from '../../../../model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../service-api/ca-object-storage.service';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  CaBucketCredentialsFormDialogComponent,
  CaBucketCredentialsFormDialogInput,
} from '../ca-bucket-credentials-form-dialog/ca-bucket-credentials-form-dialog.component';

/**
 * List bucket credentials with CRUD actions
 */
@Component({
  selector: 'ca-bucket-credentials-list',
  templateUrl: './ca-bucket-credentials-list.component.html',
  styleUrls: ['./ca-bucket-credentials-list.component.scss'],
})
export class CaBucketCredentialsListComponent implements OnInit {
  @Input({ required: true }) mode: 'all' | 'current-space';

  bucketCredentials: CaBucketCredentialsDatasource;

  constructor(
    private objectStorageService: CaObjectStorageService,
    private dialogService: FlDialogService
  ) {}

  ngOnInit(): void {
    if (this.mode === 'all') {
      this.bucketCredentials = this.objectStorageService.getAllCredentialsDatasource();
    } else {
      this.bucketCredentials = this.objectStorageService.getAllCredentialsByCurrentSpaceDatasource();
    }
  }

  openCreateDialog(): void {
    const input: CaBucketCredentialsFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaBucketCredentialsFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((credentials) => this.onCreateClosed(credentials));
  }

  private onCreateClosed(credentials?: CaBucketCredentials): void {
    if (credentials) {
      this.bucketCredentials.addItem(credentials);
    }
  }
}
