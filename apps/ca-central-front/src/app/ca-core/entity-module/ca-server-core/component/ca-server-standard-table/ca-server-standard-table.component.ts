import { Component, Input, inject } from '@angular/core';
import {
  CaServerStandard,
  CaServerStandardDatasource,
} from '../../../../model/entities/server/ca-server-standard.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import { CaServerService } from '../../../../service-api/ca-server.service';
import {
  CaServerStandardFormDialogComponent,
  CaServerStandardFormDialogInput,
} from '../ca-server-standard-form-dialog/ca-server-standard-form-dialog.component';
import { CaServerPricesDialogComponent } from '../ca-server-prices-dialog/ca-server-prices-dialog.component';

@Component({
  selector: 'ca-server-standard-table',
  templateUrl: './ca-server-standard-table.component.html',
  styleUrl: './ca-server-standard-table.component.scss',
  standalone: false,
})
export class CaServerStandardTableComponent {
  private serverService = inject(CaServerService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: CaServerStandardDatasource;

  @Input() columns: FlTableColumnStatic<CaServerStandard>[] = [
    'name',
    'description',
    'technicalDescription',
    'price',
    'lastModified',
    'actions',
  ];

  openServerPricesDialog(serverStandard: CaServerStandard): void {
    this.dialogService.openMediumDialog(CaServerPricesDialogComponent, {
      data: serverStandard,
      autoFocus: false,
    });
  }

  updateServerStandard(serverStandard: CaServerStandard): void {
    const input: CaServerStandardFormDialogInput = {
      mode: 'update',
      object: {
        id: serverStandard.id,
        name: serverStandard.name,
        description: serverStandard.description,
        technicalDescription: serverStandard.technicalDescription,
        price: null,
      },
    };

    this.dialogService
      .openSmallDialog(CaServerStandardFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((serverStandard) => this.onUpdateClosed(serverStandard));
  }

  private onUpdateClosed(serverStandard?: CaServerStandard): void {
    if (serverStandard) {
      this.datasource.updateItem(serverStandard);
    }
  }

  deleteServerStandard(serverStandard: CaServerStandard): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_server_standard',
      content: 'delete_server_standard_confirm',
      observable: this.serverService.deleteServerStandard(serverStandard.id),
      successMessage: 'server_standard_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, serverStandard));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, serverStandard: CaServerStandard): void {
    if (result.choice) {
      this.datasource.removeItem(serverStandard);
    }
  }
}
