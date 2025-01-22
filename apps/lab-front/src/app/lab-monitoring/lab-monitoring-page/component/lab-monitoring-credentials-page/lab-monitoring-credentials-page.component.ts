import { Component, inject } from '@angular/core';
import {
  LabCredentials,
  LabCredentialsDatasource,
} from '../../../../lab-core/model/entities/lab-credentials.entity';
import { FlDialogService, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabCredentialsService } from '../../../../lab-core/entity-service/lab-credentials.service';
import {
  LabCredentialsFormDialogComponent,
  LabCredentialsFormDialogInput,
} from '../../../../lab-core/entity-module/lab-credentials-core/component/lab-credentials-form-dialog/lab-credentials-form-dialog.component';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
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
