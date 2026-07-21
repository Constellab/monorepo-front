import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { FlArrayObs, FlFormDialogInput, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { TranslatePipe } from '@ngx-translate/core';

import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { CaCloudProviderInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-inline/ca-cloud-provider-inline.component';
import { CaServerCloudFormDialogComponent } from '../ca-server-cloud-form-dialog/ca-server-cloud-form-dialog.component';

@Component({
  selector: 'ca-server-cloud-table',
  templateUrl: './ca-server-cloud-table.component.html',
  styleUrls: ['./ca-server-cloud-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    CaCloudProviderInlineComponent,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class CaServerCloudTableComponent {
  private dialogService = inject(FlDialogService);
  private serverService = inject(CaServerService);

  @Input({ required: true }) datasource: FlArrayObs<CaServerCloud>;

  @Input() columns: FlTableColumnStatic<CaServerCloud>[] = [
    'cloudProvider',
    'technicalName',
    'serverStandard',
    'cpu',
    'ram',
    'disk',
    'gpu',
    'actions',
  ];

  @Input() rowSelectable: boolean = false;

  @Output() serverCloudSelected: EventEmitter<CaServerCloud> = new EventEmitter();

  openEditServerCloud(serverCloud: CaServerCloud): void {
    const dialogInput: FlFormDialogInput = {
      mode: 'update',
      object: serverCloud,
    };
    this.dialogService
      .openSmallDialog(CaServerCloudFormDialogComponent, { data: dialogInput })
      .afterClosed()
      .subscribe((result) => this.onOpenEditServerCloud(result));
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
      observable: this.serverService.deleteServerCloud(serverCloud.id),
      successMessage: 'server_cloud_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, serverCloud));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, serverCloud: CaServerCloud): void {
    if (result.choice) {
      this.datasource.removeItem(serverCloud);
    }
  }

  rowClicked(serverCloud: CaServerCloud): void {
    if (this.rowSelectable) {
      this.serverCloudSelected.emit(serverCloud);
    }
  }
}
