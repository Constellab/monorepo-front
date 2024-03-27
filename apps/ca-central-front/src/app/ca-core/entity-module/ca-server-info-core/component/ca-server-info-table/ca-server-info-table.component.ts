import {Component, Input} from '@angular/core';
import {CaServerInfo} from '../../../../model/entities/ca-server-info.class';
import {CaServerInfoFormDialogComponent} from '../ca-server-info-form-dialog/ca-server-info-form-dialog.component';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlFormDialogInput,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {CaServerInfoService} from '../../../../service-api/ca-server-info.service';

@Component({
  selector: 'ca-server-info-table',
  templateUrl: './ca-server-info-table.component.html',
  styleUrls: ['./ca-server-info-table.component.scss']
})
export class CaServerInfoTableComponent {

  @Input({required: true}) datasource: FlArrayObs<CaServerInfo>;

  @Input() columns: FlTableColumnStatic<CaServerInfo>[] = ['cloudProvider', 'name', 'technicalName', 'ram',
    'disk', 'cpu', 'gpu', 'price', 'actions'];

  constructor(private dialogService: FlDialogService,
              private serverInfoService: CaServerInfoService) {
  }

  openEditServerInfo(serverInfo: CaServerInfo): void {
    const dialogInput: FlFormDialogInput = {
      mode: 'update',
      object: serverInfo
    };
    this.dialogService.openSmallDialog(CaServerInfoFormDialogComponent, {data: dialogInput}).afterClosed()
      .subscribe(
        result => this.onOpenEditServerInfo(result)
      );
  }

  private onOpenEditServerInfo(serverInfo?: CaServerInfo): void {
    if (serverInfo) {
      this.datasource.updateItem(serverInfo);
    }
  }

  deleteServerInfo(serverInfo: CaServerInfo): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_server_info',
      content: 'delete_server_info_confirm',
      translateTitleAndContent: true,
      observable: this.serverInfoService.delete(serverInfo.id),
      successMessage: 'server_info_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result, serverInfo)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult, serverInfo: CaServerInfo): void {
    if (result.choice) {
      this.datasource.removeItem(serverInfo);
    }
  }
}
