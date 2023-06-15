import {Component, Input} from '@angular/core';
import {
  FlArrayObs,
  FlCheckCredentialsDialogComponent,
  FlCheckCredentialsDialogInput,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {LabCredentials, LabCredentialsData} from '../../../../model/entities/lab-credentials.entity';
import {LabCredentialsService} from '../../../../entity-service/lab-credentials.service';
import {
  LabCredentialsFormDialogComponent,
  LabCredentialsFormDialogInput
} from '../lab-credentials-form-dialog/lab-credentials-form-dialog.component';
import {CmCredentials} from '@monorepo/common-model';

@Component({
  selector: 'lab-credentials-table',
  templateUrl: './lab-credentials-table.component.html',
  styleUrls: ['./lab-credentials-table.component.scss'],
})
export class LabCredentialsTableComponent {

  @Input() datasource: FlArrayObs<LabCredentials>;

  @Input() columns: FlTableColumnStatic<LabCredentials>[];

  constructor(private credentialsService: LabCredentialsService,
              private dialogService: FlDialogService) {
  }

  updateCredentials(credentials: LabCredentials): void {

    // open user check credentials dialog
    const dialogInput: FlCheckCredentialsDialogInput = {
      onSubmit: (userCredentials: CmCredentials) =>
        this.credentialsService.getCredentialsData(credentials.id, userCredentials)
    };

    this.dialogService.openSmallDialog(FlCheckCredentialsDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      result => this.openUpdateCredentials(credentials, result)
    );
  }

  private openUpdateCredentials(credentials: LabCredentials, credentialsData: LabCredentialsData): void {

    const dialogInput: LabCredentialsFormDialogInput = {
      mode: 'update',
      id: credentials.id,
      object: {
        name: credentials.name,
        type: credentials.type,
        description: credentials.description,
        data: credentialsData,
      }
    };

    this.dialogService.openMediumDialog(LabCredentialsFormDialogComponent, {
      data: dialogInput,
    }).afterClosed().subscribe(
      result => this.onUpdateClosed(result)
    );

  }

  private onUpdateClosed(credentials?: LabCredentials): void {
    this.datasource.updateItem(credentials);
  }

  deleteCredentials(credentials: LabCredentials): void {
    const data: FlConfirmDialogInput = {
      title: 'biox.delete_credentials',
      content: 'biox.delete_credentials_confirmation',
      translateTitleAndContent: true,
      observable: this.credentialsService.delete(credentials.id),
      successMessage: 'biox.credentials_deleted',
      translateMessage: true,
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe((result: FlConfirmDialogResult) => {
      this.deleteCredentialsClosed(result, credentials);
    });
  }

  private deleteCredentialsClosed(result: FlConfirmDialogResult, credentials: LabCredentials): void {
    if (result.choice) {
      this.datasource.removeItem(credentials);
    }
  }
}
