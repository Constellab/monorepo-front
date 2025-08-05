import { Component, inject,Input } from '@angular/core';
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
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiCredentials, LiCredentialsData } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiCredentialsService } from '../../service/li-credentials.service';
import {
  LiCredentialsFormDialogComponent,
  LiCredentialsFormDialogInput,
} from '../li-credentials-form-dialog/li-credentials-form-dialog.component';

@Component({
  selector: 'li-credentials-table',
  templateUrl: './li-credentials-table.component.html',
  styleUrls: ['./li-credentials-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
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
export class LiCredentialsTableComponent {
  private credentialsService = inject(LiCredentialsService);
  private dialogService = inject(FlDialogService);

  @Input() datasource: FlArrayObs<LiCredentials>;

  @Input() columns: FlTableColumnStatic<LiCredentials>[];

  updateCredentials(credentials: LiCredentials): void {
    // open user check credentials dialog
    const dialogInput: FlCheckCredentialsDialogInput = {
      onSubmit: (userCredentials: ClCredentials) =>
        this.credentialsService.getCredentialsData(credentials.id, userCredentials),
    };

    this.dialogService
      .openSmallDialog(FlCheckCredentialsDialogComponent, {
        data: dialogInput,
      })
      .afterClosed()
      .subscribe((result) => this.openUpdateCredentials(credentials, result));
  }

  private openUpdateCredentials(credentials: LiCredentials, credentialsData: LiCredentialsData): void {
    if (credentialsData == null) return;

    const dialogInput: LiCredentialsFormDialogInput = {
      mode: 'update',
      id: credentials.id,
      object: {
        name: credentials.name,
        type: credentials.type,
        description: credentials.description,
        data: credentialsData,
      },
    };

    this.dialogService
      .openMediumDialog(LiCredentialsFormDialogComponent, {
        data: dialogInput,
      })
      .afterClosed()
      .subscribe((result) => this.onUpdateClosed(result));
  }

  private onUpdateClosed(credentials?: LiCredentials): void {
    this.datasource.updateItem(credentials);
  }

  deleteCredentials(credentials: LiCredentials): void {
    const data: FlConfirmDialogInput = {
      title: 'li.delete_credentials',
      content: 'li.delete_credentials_confirmation',
      observable: this.credentialsService.delete(credentials.id),
      successMessage: 'li.credentials_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => {
        this.deleteCredentialsClosed(result, credentials);
      });
  }

  private deleteCredentialsClosed(result: FlConfirmDialogResult, credentials: LiCredentials): void {
    if (result.choice) {
      this.datasource.removeItem(credentials);
    }
  }
}
