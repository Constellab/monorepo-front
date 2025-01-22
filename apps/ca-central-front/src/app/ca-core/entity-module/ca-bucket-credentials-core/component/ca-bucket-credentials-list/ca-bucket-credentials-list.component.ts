import { Component, Input, OnInit, inject } from '@angular/core';
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
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlInfiniteScrollModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { CaBucketCredentialsTableComponent } from '../ca-bucket-credentials-table/ca-bucket-credentials-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * List bucket credentials with CRUD actions
 */
@Component({
  selector: 'ca-bucket-credentials-list',
  templateUrl: './ca-bucket-credentials-list.component.html',
  styleUrls: ['./ca-bucket-credentials-list.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlInfiniteScrollModule,
    CaBucketCredentialsTableComponent,
    TranslatePipe,
  ],
})
export class CaBucketCredentialsListComponent implements OnInit {
  private objectStorageService = inject(CaObjectStorageService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) mode: 'all' | 'current-space';

  bucketCredentials: CaBucketCredentialsDatasource;

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
