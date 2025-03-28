import { Component, inject } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiCredentials, LiCredentialsDatasource } from '@monorepo/lab-lib/li-core';
import {
  LiCredentialsFormDialogComponent,
  LiCredentialsFormDialogInput, LiCredentialsService,
  LiCredentialsTableComponent,
} from '@monorepo/lab-lib/li-credentials';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
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
    LiCredentialsTableComponent,
    TranslatePipe,
  ],
})
export class LabMonitoringCredentialsPageComponent {
  private credentialsService = inject(LiCredentialsService);
  private dialogService = inject(FlDialogService);

  allCredentials: LiCredentialsDatasource = this.credentialsService.getAllDatasource();

  displayedColumns: FlTableColumnStatic<LiCredentials>[] = [
    'name',
    'description',
    'type',
    'created',
    'actions',
  ];

  createCredentials(): void {
    const data: LiCredentialsFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openMediumDialog(LiCredentialsFormDialogComponent, {
        data: data,
      })
      .afterClosed()
      .subscribe((result) => this.createCredentialsClosed(result));
  }

  private createCredentialsClosed(credentials?: LiCredentials): void {
    if (credentials) {
      this.allCredentials.addItem(credentials, () => true);
    }
  }
}
