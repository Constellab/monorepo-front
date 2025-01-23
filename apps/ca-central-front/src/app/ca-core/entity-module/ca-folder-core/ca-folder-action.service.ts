import { inject, Injectable } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';

import { CaFolderService } from '../../service-api/ca-folder.service';
import { filter, Observable } from 'rxjs';
import {
  CaFolderFormDialogComponent,
  CaFolderFormDialogInput,
} from './component/ca-folder-form-dialog/ca-folder-form-dialog.component';
import { CaFolderWithHierarchy } from '../../model/entities/folder/ca-folder.class';
import {
  CaDocumentNameFormDialogComponent,
  CaDocumentNameFormDialogInput,
} from '../../../ca-folder/module/ca-document-core/component/ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import { CaConstellabDocument } from '../../model/entities/folder/ca-document.class';
import { ClHelpService } from '@monorepo/core-lib';
import { CaHierarchyObject } from '../../model/entities/folder/ca-hierarchy-object.class';
import { map } from 'rxjs/operators';

/**
 * Service to gather action on folder that can be done in multiple location from the UI
 */
@Injectable({
  providedIn: 'root',
})
export class CaFolderActionService {
  private folderService = inject(CaFolderService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  private uploadDocumentActionName = 'upload-document-action';

  public openCreateRootFolderDialog(): Observable<CaFolderWithHierarchy | null> {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'create',
    };
    return this.dialogService
      .openSmallDialog(CaFolderFormDialogComponent, { data: dialogInput })
      .afterClosed();
  }

  public openChildCreation(folderId: string): Observable<CaFolderWithHierarchy | null> {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'create',
      parentId: folderId,
    };

    return this.dialogService
      .openSmallDialog(CaFolderFormDialogComponent, {
        data: dialogInput,
      })
      .afterClosed();
  }

  public openUpdateFolderDialog(folderId: string): Observable<CaFolderWithHierarchy | null> {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'update',
      folderId: folderId,
    };

    return this.dialogService
      .openSmallDialog(CaFolderFormDialogComponent, {
        data: dialogInput,
      })
      .afterClosed();
  }

  public openDeleteFolderDialog(folderId: string): Observable<FlConfirmDialogResult<void>> {
    const input: FlConfirmDialogInput = {
      title: 'delete_folder',
      content: 'delete_folder_confirm',
      observable: this.folderService.delete(folderId),
      successMessage: 'folder_deleted',
    };

    return this.dialogService.openConfirmDialog(input).afterClosed();
  }

  public createConstellabDocument(folderId: string): Observable<CaConstellabDocument | null> {
    const input: CaDocumentNameFormDialogInput = {
      mode: 'create',
      parentFolderId: folderId,
    };

    return this.dialogService
      .openSmallDialog(CaDocumentNameFormDialogComponent, { data: input })
      .afterClosed();
  }

  public uploadDocument(folderId: string, fileEvent: File | File[]): void {
    const files = ClHelpService.convertObjectOrArrayToArray(fileEvent);

    for (const file of files) {
      const action: FlPortalAction = {
        type: this.uploadDocumentActionName,
        action: this.folderService.uploadDocument(file, folderId),
        text: {
          text: 'uploading_document',
          translateText: true,
          translateParam: { param: { name: file.name } },
        },
        additionalInformation: folderId,
      };

      this.actionService.addAction(action, false);
    }
  }

  public getUploadedDocumentActionResult(): Observable<{ folderId: string; document: CaHierarchyObject }> {
    return this.actionService.getResult$(this.uploadDocumentActionName).pipe(
      filter((action) => action.status === 'success'),
      map((action) => {
        return {
          folderId: action.additionalInformation,
          document: action.result,
        };
      })
    );
  }
}
