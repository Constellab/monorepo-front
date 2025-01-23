import { Component, Input, inject } from '@angular/core';
import {
  CaServerStandard,
  CaServerStandardDatasource,
} from '../../../../model/entities/server/ca-server-standard.class';
import { FlConfirmDialogInput } from '@monorepo/front-core-lib/fl-dialog';
import { FlConfirmDialogResult } from '@monorepo/front-core-lib/fl-dialog';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';

import { CaServerService } from '../../../../service-api/ca-server.service';
import {
  CaServerStandardFormDialogComponent,
  CaServerStandardFormDialogInput,
} from '../ca-server-standard-form-dialog/ca-server-standard-form-dialog.component';
import { CaServerPricesDialogComponent } from '../ca-server-prices-dialog/ca-server-prices-dialog.component';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { CaServerStandardPriceComponent } from '../ca-server-standard-price/ca-server-standard-price.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-server-standard-table',
  templateUrl: './ca-server-standard-table.component.html',
  styleUrl: './ca-server-standard-table.component.scss',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    CaServerStandardPriceComponent,
    FlUserModule,
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
