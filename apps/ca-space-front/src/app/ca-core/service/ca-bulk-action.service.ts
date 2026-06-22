import { inject, Injectable } from '@angular/core';
import { ClBulkActionResult } from '@monorepo/core-lib';
import { FlBulkActionContext } from '@monorepo/front-core-lib/fl-bulk-selection';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import {
  FlBulkActionResultDialogComponent,
  FlPortalActionsService,
} from '@monorepo/front-core-lib/fl-portal-actions';

import {
  CaSelectFolderDialogComponent,
  CaSelectFolderDialogInput,
} from '../entity-module/ca-folder-core/component/ca-select-folder-dialog/ca-select-folder-dialog.component';
import {
  CaHierarchyObjectBulkTagsDialogComponent,
  CaHierarchyObjectBulkTagsDialogInput,
} from '../entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-bulk-tags-dialog/ca-hierarchy-object-bulk-tags-dialog.component';
import { CaHierarchyObjectService } from '../service-api/ca-hierarchy-object.service';

@Injectable({ providedIn: 'root' })
export class CaBulkActionService {
  private hierarchyObjectService = inject(CaHierarchyObjectService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  bulkMoveToTrash(context: FlBulkActionContext): void {
    const count = this.getSelectionCount(context);
    const confirmInput: FlConfirmDialogInput = {
      title: 'bulk_move_to_trash',
      content: {
        text: 'bulk_move_to_trash_confirmation',
        translateParam: { param: { count } },
      },
    };

    this.dialogService
      .openConfirmDialog(confirmInput)
      .afterClosed()
      .subscribe((dialogResult: FlConfirmDialogResult) => {
        if (!dialogResult.choice) return;
        this.actionService.addAction({
          type: 'bulkMoveToTrash',
          action: this.hierarchyObjectService.bulkMoveToTrash(context),
          text: { text: 'moving_to_trash', translateText: true },
          successMessage: (result: ClBulkActionResult) => ({
            text: 'moved_to_trash_done',
            translateParam: {
              param: {
                successCount: result.successCount,
                total: result.total,
              },
            },
          }),
          onSuccessClick: (result: ClBulkActionResult) => {
            this.openBulkResultDialog(result);
          },
        });
      });
  }

  bulkMoveToFolder(context: FlBulkActionContext): void {
    const input: CaSelectFolderDialogInput = {
      title: { text: 'move_to_folder', translateText: true },
      mode: 'any',
    };

    this.dialogService
      .openMediumDialog(CaSelectFolderDialogComponent, {
        data: input,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((folder) => {
        if (!folder) return;
        this.actionService.addAction({
          type: 'bulkMoveToFolder',
          action: this.hierarchyObjectService.bulkMoveToFolder(context, folder.id),
          text: { text: 'moving_to_folder', translateText: true },
          successMessage: (result: ClBulkActionResult) => ({
            text: 'moved_to_folder_done',
            translateParam: {
              param: {
                successCount: result.successCount,
                total: result.total,
              },
            },
          }),
          onSuccessClick: (result: ClBulkActionResult) => {
            this.openBulkResultDialog(result);
          },
        });
      });
  }

  bulkAddTags(context: FlBulkActionContext, parentHierarchyObjectId: string): void {
    const input: CaHierarchyObjectBulkTagsDialogInput = {
      parentHierarchyObjectId,
      context,
    };

    this.dialogService.openMediumDialog(CaHierarchyObjectBulkTagsDialogComponent, { data: input });
  }

  private getSelectionCount(context: FlBulkActionContext): string {
    return context.isEntireSearchSelected ? 'all' : String(context.selectedIds.length);
  }

  private openBulkResultDialog(result: ClBulkActionResult): void {
    this.dialogService.openSmallDialog(FlBulkActionResultDialogComponent, { data: result });
  }
}
