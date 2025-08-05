import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlClipboardService, FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaHierarchyObjectToken,
  CaHierarchyObjectTokenDatasource,
} from '../../../../model/entities/folder/ca-hierarchy-object-token.class';
import { CaHierarchyObjectTokenService } from '../../../../service-api/ca-hierarchy-object-token.service';
import {
  CaHierarchyObjectTokenFormDialogComponent,
  CaHierarchyObjectTokenFormDialogInput,
} from '../ca-hierarchy-object-token-form-dialog/ca-hierarchy-object-token-form-dialog.component';

@Component({
  selector: 'ca-hierarchy-object-token-table',
  imports: [
    FlDateModule,
    FlTextIconModule,
    FlUserModule,
    MatTableModule,
    MatIcon,
    TranslatePipe,
    MatButtonModule,
    MatMenuModule,
    NgClass,
    MatTooltip,
  ],
  templateUrl: './ca-hierarchy-object-token-table.component.html',
  styleUrl: './ca-hierarchy-object-token-table.component.scss',
})
export class CaHierarchyObjectTokenTableComponent {
  datasource = input.required<CaHierarchyObjectTokenDatasource>();

  columns = input<FlTableColumnStatic<CaHierarchyObjectToken>[]>([
    'expirationDate',
    'creation',
    'link',
    'actions',
  ]);

  private hierarchyObjectTokenService = inject(CaHierarchyObjectTokenService);
  private dialogService = inject(FlDialogService);
  private clipboardService = inject(FlClipboardService);
  private snackBarService = inject(FlSnackBarService);

  copyUrl(token: CaHierarchyObjectToken): void {
    if (this.clipboardService.copy(token.url)) {
      this.snackBarService.openSuccessMessage('hierarchy_object_token_copy_link_success');
    }
  }

  updateToken(token: CaHierarchyObjectToken): void {
    const data: CaHierarchyObjectTokenFormDialogInput = {
      mode: 'update',
      object: {
        expirationDate: token.expirationDate,
      },
      hierarchyObjectTokenId: token.id,
    };

    this.dialogService
      .openSmallDialog(CaHierarchyObjectTokenFormDialogComponent, { data: data })
      .afterClosed()
      .subscribe((updatedToken) => this.onUpdateClosed(updatedToken));
  }

  private onUpdateClosed(token?: CaHierarchyObjectToken): void {
    if (token) {
      this.datasource().updateItem(token);
    }
  }

  deleteToken(token: CaHierarchyObjectToken): void {
    const data: FlConfirmDialogInput = {
      title: 'hierarchy_object_token_delete',
      content: 'hierarchy_object_token_delete_confirmation',
      observable: this.hierarchyObjectTokenService.deleteToken(token.id),
      successMessage: 'hierarchy_object_token_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<void>) => this.onDeleteClosed(result, token));
  }

  private onDeleteClosed(result: FlConfirmDialogResult<void>, token: CaHierarchyObjectToken): void {
    if (result.choice) {
      this.datasource().removeItem(token);
    }
  }
}
