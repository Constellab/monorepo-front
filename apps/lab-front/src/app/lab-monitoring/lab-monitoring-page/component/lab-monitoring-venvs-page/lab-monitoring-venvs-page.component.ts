import { Component, OnInit, inject } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiVEnvsStatus, LiVenvArrayObs, LiVenvService } from '@monorepo/lab-lib/li-core';
import { LiVenvTableComponent } from '@monorepo/lab-lib/li-venv';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Observable, share } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

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
    LiVenvTableComponent,
    TranslatePipe,
  ],
})
export class LabMonitoringVenvsPageComponent implements OnInit {
  private venvService = inject(LiVenvService);
  private dialogService = inject(FlDialogService);

  venvsStatus$: Observable<LiVEnvsStatus>;

  venvsList: LiVenvArrayObs;

  ngOnInit(): void {
    this.venvsStatus$ = this.venvService.getVenvsStatus().pipe(share());
    this.venvsList = new LiVenvArrayObs(this.venvsStatus$.pipe(map((status) => status.envs)));
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
