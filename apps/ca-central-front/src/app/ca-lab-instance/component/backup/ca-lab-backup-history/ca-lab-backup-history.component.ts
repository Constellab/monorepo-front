import {Component, Input, OnInit} from '@angular/core';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {
  CaLabBackupHistory,
  CaLabBackupHistoryDatasource
} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityPaginatedDatasource
} from '@monorepo/front-core-lib';
import {CaLabInstanceDetailPageState} from '../../../state/ca-lab-instance-detail-page.state';
import {Observable} from 'rxjs';

@Component({
  selector: 'ca-lab-backup-history',
  templateUrl: './ca-lab-backup-history.component.html',
  styleUrls: ['./ca-lab-backup-history.component.scss'],
})
export class CaLabBackupHistoryComponent implements OnInit {

  @Input() labInstanceId: string;

  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  datasource: CaLabBackupHistoryDatasource;

  syncIsLoading: boolean = false;

  constructor(private labInstanceService: CaLabInstanceService,
              private dialogService: FlDialogService,
              private state: CaLabInstanceDetailPageState) {
  }

  ngOnInit(): void {
    this.initDatasource();
  }

  private initDatasource(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, size) => this.labInstanceService.getBackupHistory(this.labInstanceId, page, size), 20, true
    );
  }

  backupProd(): void {
    const input: FlConfirmDialogInput = {
      title: 'backup_lab_production',
      content: 'backup_lab_production_confirmation',
      translateTitleAndContent: true,
      observable: this.labInstanceService.backupProd(this.labInstanceId),
      successMessage: 'backup_lab_production_started',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onBackupProdClosed(result)
    );
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
      translateTitleAndContent: true,
      observable: this.labInstanceService.stopCurrentBackup(this.labInstanceId),
      successMessage: 'lab_current_backups_stopped',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onStopCurrentBackupClosed(result)
    );
  }

  private onStopCurrentBackupClosed(result: FlConfirmDialogResult<CaLabBackupHistory[]>): void {
    if (result.choice) {
      this.datasource.updateItem(result.result);
    }
  }

  syncHistory(): void {
    this.syncIsLoading = true;
    this.labInstanceService.syncBackupHistory(this.labInstanceId).subscribe(
      {
        next: () => {
          this.syncIsLoading = false;
          this.initDatasource();
        },
        error: () => this.syncIsLoading = false
      }
    );
  }

}
