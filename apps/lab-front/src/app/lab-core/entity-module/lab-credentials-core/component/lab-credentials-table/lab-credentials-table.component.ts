import { Component, inject, Input } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlCheckCredentialsDialogComponent,
  FlCheckCredentialsDialogInput,
} from '@monorepo/front-core-lib/fl-auth';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';

import { LabCredentials, LabCredentialsData } from '../../../../model/entities/lab-credentials.entity';
import { LabCredentialsService } from '../../../../entity-service/lab-credentials.service';
import {
  LabCredentialsFormDialogComponent,
  LabCredentialsFormDialogInput,
} from '../lab-credentials-form-dialog/lab-credentials-form-dialog.component';
import { ClCredentials } from '@monorepo/core-lib';
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
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-credentials-table',
  templateUrl: './lab-credentials-table.component.html',
  styleUrls: ['./lab-credentials-table.component.scss'],
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
export class LabCredentialsTableComponent {
  private credentialsService = inject(LabCredentialsService);
  private dialogService = inject(FlDialogService);

  @Input() datasource: FlArrayObs<LabCredentials>;

  @Input() columns: FlTableColumnStatic<LabCredentials>[];

  updateCredentials(credentials: LabCredentials): void {
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

  private openUpdateCredentials(credentials: LabCredentials, credentialsData: LabCredentialsData): void {
    if (credentialsData == null) return;

    const dialogInput: LabCredentialsFormDialogInput = {
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
      .openMediumDialog(LabCredentialsFormDialogComponent, {
        data: dialogInput,
      })
      .afterClosed()
      .subscribe((result) => this.onUpdateClosed(result));
  }

  private onUpdateClosed(credentials?: LabCredentials): void {
    this.datasource.updateItem(credentials);
  }

  deleteCredentials(credentials: LabCredentials): void {
    const data: FlConfirmDialogInput = {
      title: 'biox.delete_credentials',
      content: 'biox.delete_credentials_confirmation',
      observable: this.credentialsService.delete(credentials.id),
      successMessage: 'biox.credentials_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => {
        this.deleteCredentialsClosed(result, credentials);
      });
  }

  private deleteCredentialsClosed(result: FlConfirmDialogResult, credentials: LabCredentials): void {
    if (result.choice) {
      this.datasource.removeItem(credentials);
    }
  }
}
