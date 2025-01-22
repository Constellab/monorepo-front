import { Component, OnInit, inject } from '@angular/core';
import { LabVenvService } from '../../../../lab-core/entity-service/lab-venv.service';
import { Observable, share } from 'rxjs';
import { LabVenvArrayObs, LabVEnvsStatus } from '../../../../lab-core/model/entities/lab-venv.entity';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { map } from 'rxjs/operators';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { LabVenvTableComponent } from '../../../../lab-core/entity-module/lab-venv-core/lab-venv-table/lab-venv-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Sub-page of monitoring to list all venvs
 * Check the detail of a venv and delete it
 */
@Component({
  selector: 'lab-monitoring-venvs-page',
  templateUrl: './lab-monitoring-venvs-page.component.html',
  styleUrls: ['./lab-monitoring-venvs-page.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatButton,
    FlSectionModule,
    FlKeyValueModule,
    LabVenvTableComponent,
    TranslatePipe,
  ],
})
export class LabMonitoringVenvsPageComponent implements OnInit {
  private venvService = inject(LabVenvService);
  private dialogService = inject(FlDialogService);

  venvsStatus$: Observable<LabVEnvsStatus>;

  venvsList: LabVenvArrayObs;

  ngOnInit(): void {
    this.venvsStatus$ = this.venvService.getVenvsStatus().pipe(share());
    this.venvsList = new LabVenvArrayObs(this.venvsStatus$.pipe(map((status) => status.envs)));
  }

  openDeleteAllEnvsDialog(): void {
    const data: FlConfirmDialogInput = {
      title: 'monitoring.delete_all_venvs',
      content: 'monitoring.delete_all_venvs_confirmation',
      observable: this.venvService.deleteAllVenvs(),
      successMessage: 'monitoring.delete_all_venvs_success',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteAllEnvsClosed(result));
  }

  private onDeleteAllEnvsClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.venvsList.clear();
    }
  }
}
