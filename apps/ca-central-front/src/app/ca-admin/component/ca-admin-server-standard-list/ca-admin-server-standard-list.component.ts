import { Component } from '@angular/core';
import { FlDialogService, FlFileHelper, FlSnackBarService } from '@monorepo/front-core-lib';
import {
  CaServerStandard,
  CaServerStandardDatasource,
} from '../../../ca-core/model/entities/server/ca-server-standard.class';
import { CaServerService } from '../../../ca-core/service-api/ca-server.service';
import {
  CaServerStandardFormDialogComponent,
  CaServerStandardFormDialogInput,
} from '../../../ca-core/entity-module/ca-server-core/component/ca-server-standard-form-dialog/ca-server-standard-form-dialog.component';
import { CaSettingsService } from '../../../ca-core/service-api/ca-settings.service';

@Component({
  selector: 'ca-admin-server-standard-list',
  templateUrl: './ca-admin-server-standard-list.component.html',
  styleUrl: './ca-admin-server-standard-list.component.scss',
})
export class CaAdminServerStandardListComponent {
  serverStandards: CaServerStandardDatasource = this.serverService.findAllServerStandardDatasource();

  constructor(
    private serverService: CaServerService,
    private dialogService: FlDialogService,
    private settingsService: CaSettingsService,
    private snackBarService: FlSnackBarService
  ) {}

  openCreateDialog(): void {
    const input: CaServerStandardFormDialogInput = { mode: 'create' };
    this.dialogService
      .openSmallDialog(CaServerStandardFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((serverStandard: CaServerStandard) => this.onCreateClosed(serverStandard));
  }

  private onCreateClosed(serverStandard?: CaServerStandard): void {
    if (serverStandard) {
      this.serverStandards.addItem(serverStandard);
    }
  }

  downloadDecisionTree(): void {
    this.settingsService.getDecisionTree().subscribe((blob) => {
      FlFileHelper.downloadJsonFile(blob, 'decision-tree.json');
    });
  }

  uploadDecisionTree(file: File): void {
    this.settingsService.uploadDecisionTree(file).subscribe(() => this.uploadDecisionTreeSuccess());
  }

  private uploadDecisionTreeSuccess(): void {
    this.snackBarService.openSuccessMessage({ text: 'server_decision_tree_uploaded', translateText: true });
  }
}
