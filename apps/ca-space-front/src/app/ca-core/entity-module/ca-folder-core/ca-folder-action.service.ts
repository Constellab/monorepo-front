import { inject, Injectable } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';

import { CaFolderService } from '../../service-api/ca-folder.service';
import { filter, mergeMap, Observable, of } from 'rxjs';
import {
  CaFolderFormDialogComponent,
  CaFolderFormDialogInput,
} from './component/ca-folder-form-dialog/ca-folder-form-dialog.component';
import { CaFolder, CaFolderWithHierarchy } from '../../model/entities/folder/ca-folder.class';
import {
  CaDocumentNameFormDialogComponent,
  CaDocumentNameFormDialogInput,
} from '../../../ca-folder/module/ca-document-core/component/ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import { CaConstellabDocument } from '../../model/entities/folder/ca-document.class';
import { ClHelpService } from '@monorepo/core-lib';
import { CaHierarchyObject } from '../../model/entities/folder/ca-hierarchy-object.class';
import { map } from 'rxjs/operators';
import {
  CaSelectFolderDialogComponent,
  CaSelectFolderDialogInput,
} from './component/ca-select-folder-dialog/ca-select-folder-dialog.component';
import { CaHierarchyObjectService } from '../../service-api/ca-hierarchy-object.service';
import { CaDocumentService } from '../../service-api/ca-document.service';

/**
 * Service to gather action on folder that can be done in multiple location from the UI
 */
@Injectable({
  providedIn: 'root',
})
export class CaFolderActionService {
  private folderService = inject(CaFolderService);
  private documentService = inject(CaDocumentService);
  private hierarchyObjectService = inject(CaHierarchyObjectService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  private uploadDocumentActionName = 'upload-document-action';
  private uploadFolderActionName = 'upload-folder-action';
  private moveFolderActionName = 'move-to-folder-action';

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
        action: this.documentService.uploadDocument(file, folderId),
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

  public uploadFolder(folderId: string, fileEvent: File | File[]): void {
    const files = ClHelpService.convertObjectOrArrayToArray(fileEvent);

    const action: FlPortalAction = {
      type: this.uploadFolderActionName,
      action: this.documentService.uploadFolder(files, folderId),
      text: {
        text: 'uploading_folder',
        translateText: true,
      },
      additionalInformation: folderId,
    };

    this.actionService.addAction(action, false);
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

  public getUploadedFolderActionResult(): Observable<{ parentFolderId: string }> {
    return this.actionService.getResult$(this.uploadFolderActionName).pipe(
      filter((action) => action.status === 'success'),
      map((action) => {
        return {
          parentFolderId: action.additionalInformation,
        };
      })
    );
  }

  public moveObjectToFolder(hierarchyObjectId: string): Observable<CaHierarchyObject | null> {
    const input: CaSelectFolderDialogInput = {
      title: { text: 'move_to_folder', translateText: true },
      mode: 'any',
      currentObjectId: hierarchyObjectId,
    };
    return this.dialogService
      .openMediumDialog(CaSelectFolderDialogComponent, {
        data: input,
        autoFocus: false,
      })
      .afterClosed()
      .pipe(mergeMap((folder) => this.onMoveObjectClosed(hierarchyObjectId, folder)));
  }

  private onMoveObjectClosed(
    hierarchyObjectId: string,
    folder?: CaFolder
  ): Observable<CaHierarchyObject | null> {
    if (folder) {
      return this.actionService
        .addAction({
          type: this.moveFolderActionName,
          action: this.hierarchyObjectService.moveToFolder(hierarchyObjectId, folder.id),
          text: { text: 'moving_to_folder', translateText: true },
        })
        .pipe(
          map((result) => {
            if (result.status === 'success') {
              return result.result;
            } else {
              throw new Error('Error while moving folder');
            }
          })
        );
    }
    return of(null);
  }
}
