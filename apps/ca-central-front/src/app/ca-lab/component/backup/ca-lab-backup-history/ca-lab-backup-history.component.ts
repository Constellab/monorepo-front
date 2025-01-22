import { Component, Input, OnInit, inject } from '@angular/core';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  CaLabBackupHistory,
  CaLabBackupHistoryDatasource,
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityPaginatedDatasource,
} from '@monorepo/front-core-lib';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'ca-lab-backup-history',
  templateUrl: './ca-lab-backup-history.component.html',
  styleUrls: ['./ca-lab-backup-history.component.scss'],
  standalone: false,
})
export class CaLabBackupHistoryComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);
  private state = inject(CaLabDetailPageState);

  @Input() labId: string;

  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  datasource: CaLabBackupHistoryDatasource;

  syncIsLoading: boolean = false;

  ngOnInit(): void {
    this.initDatasource();
  }

  private initDatasource(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, size) => this.labService.getBackupHistory(this.labId, page, size),
      20
    );
  }

  backupProd(): void {
    const input: FlConfirmDialogInput = {
      title: 'backup_lab_production',
      content: 'backup_lab_production_confirmation',
      observable: this.labService.backupProd(this.labId),
      successMessage: 'backup_lab_production_started',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onBackupProdClosed(result));
  }

  private onBackupProdClosed(result: FlConfirmDialogResult<CaLabBackupHistory[]>): void {
    if (result.choice) {
      this.datasource.addItem(result.result, () => true);
    }
  }

  stopCurrentBackup(): void {
    const input: FlConfirmDialogInput = {
      title: 'stop_lab_current_backups',
      content: 'stop_lab_current_backups_confirmation',
      observable: this.labService.stopCurrentBackup(this.labId),
      successMessage: 'lab_current_backups_stopped',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onStopCurrentBackupClosed(result));
  }

  private onStopCurrentBackupClosed(result: FlConfirmDialogResult<CaLabBackupHistory[]>): void {
    if (result.choice) {
      this.datasource.updateItem(result.result);
    }
  }

  syncHistory(): void {
    this.syncIsLoading = true;
    this.labService.syncBackupHistory(this.labId).subscribe({
      next: () => {
        this.syncIsLoading = false;
        this.initDatasource();
      },
      error: () => (this.syncIsLoading = false),
    });
  }
}
