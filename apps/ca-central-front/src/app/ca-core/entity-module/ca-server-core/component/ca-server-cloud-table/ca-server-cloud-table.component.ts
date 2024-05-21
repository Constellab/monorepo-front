import {Component, Input} from '@angular/core';
import {CaServerCloud} from '../../../../model/entities/server/ca-server-cloud.class';
import {CaServerCloudFormDialogComponent} from '../ca-server-cloud-form-dialog/ca-server-cloud-form-dialog.component';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlFormDialogInput,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {CaServerService} from '../../../../service-api/ca-server.service';

@Component({
  selector: 'ca-server-cloud-table',
  templateUrl: './ca-server-cloud-table.component.html',
  styleUrls: ['./ca-server-cloud-table.component.scss']
})
export class CaServerCloudTableComponent {

  @Input({required: true}) datasource: FlArrayObs<CaServerCloud>;

  @Input() columns: FlTableColumnStatic<CaServerCloud>[] = ['cloudProvider', 'technicalName', 'serverStandard', 'cpu', 'ram',
    'disk', 'gpu', 'actions'];

  constructor(private dialogService: FlDialogService,
              private serverService: CaServerService) {
  }

  openEditServerCloud(serverCloud: CaServerCloud): void {
    const dialogInput: FlFormDialogInput = {
      mode: 'update',
      object: serverCloud
    };
    this.dialogService.openSmallDialog(CaServerCloudFormDialogComponent, {data: dialogInput}).afterClosed()
      .subscribe(
        result => this.onOpenEditServerCloud(result)
      );
  }

  private onOpenEditServerCloud(serverCloud?: CaServerCloud): void {
    if (serverCloud) {
      this.datasource.updateItem(serverCloud);
    }
  }

  deleteServerCloud(serverCloud: CaServerCloud): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_server_cloud',
      content: 'delete_server_cloud_confirm',
      translateTitleAndContent: true,
      observable: this.serverService.deleteServerCloud(serverCloud.id),
      successMessage: 'server_cloud_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result, serverCloud)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult, serverCloud: CaServerCloud): void {
    if (result.choice) {
      this.datasource.removeItem(serverCloud);
    }
  }
}
