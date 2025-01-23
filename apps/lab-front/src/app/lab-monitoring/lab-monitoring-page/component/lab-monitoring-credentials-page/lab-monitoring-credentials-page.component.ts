import { Component, inject } from '@angular/core';
import {
  LabCredentials,
  LabCredentialsDatasource,
} from '../../../../lab-core/model/entities/lab-credentials.entity';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LabCredentialsService } from '../../../../lab-core/entity-service/lab-credentials.service';
import {
  LabCredentialsFormDialogComponent,
  LabCredentialsFormDialogInput,
} from '../../../../lab-core/entity-module/lab-credentials-core/component/lab-credentials-form-dialog/lab-credentials-form-dialog.component';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LabCredentialsTableComponent } from '../../../../lab-core/entity-module/lab-credentials-core/component/lab-credentials-table/lab-credentials-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-monitoring-credentials-page',
  templateUrl: './lab-monitoring-credentials-page.component.html',
  styleUrls: ['./lab-monitoring-credentials-page.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatButton,
    FlSectionModule,
    LabCredentialsTableComponent,
    TranslatePipe,
  ],
})
export class LabMonitoringCredentialsPageComponent {
  private credentialsService = inject(LabCredentialsService);
  private dialogService = inject(FlDialogService);

  allCredentials: LabCredentialsDatasource = this.credentialsService.getAllDatasource();

  displayedColumns: FlTableColumnStatic<LabCredentials>[] = [
    'name',
    'description',
    'type',
    'created',
    'actions',
  ];

  createCredentials(): void {
    const data: LabCredentialsFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openMediumDialog(LabCredentialsFormDialogComponent, {
        data: data,
      })
      .afterClosed()
      .subscribe((result) => this.createCredentialsClosed(result));
  }

  private createCredentialsClosed(credentials?: LabCredentials): void {
    if (credentials) {
      this.allCredentials.addItem(credentials, () => true);
    }
  }
}
