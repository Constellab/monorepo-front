import { inject, Injectable } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { filter, mergeMap, Observable, of } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';

import {
  CaDocumentNameFormDialogComponent,
  CaDocumentNameFormDialogInput,
} from '../../../ca-folder/module/ca-document-core/component/ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import {
  CaConstellabDocument,
  CaDocumentUploadOverrideMode,
} from '../../model/entities/folder/ca-document.class';
import { CaFolder, CaFolderWithHierarchy } from '../../model/entities/folder/ca-folder.class';
import { CaHierarchyObject } from '../../model/entities/folder/ca-hierarchy-object.class';
import { CaDocumentService } from '../../service-api/ca-document.service';
import { CaFolderService } from '../../service-api/ca-folder.service';
import { CaHierarchyObjectService } from '../../service-api/ca-hierarchy-object.service';
import {
  CaFolderFormDialogComponent,
  CaFolderFormDialogInput,
} from './component/ca-folder-form-dialog/ca-folder-form-dialog.component';
import {
  CaFolderUploadFileErrorDialogInput,
  CaFolderUploadFileErrorDialogOutput,
  CaFolderUploadFileOverrideDialogComponent,
} from './component/ca-folder-upload-file-override-dialog/ca-folder-upload-file-override-dialog.component';
import {
  CaSelectFolderDialogComponent,
  CaSelectFolderDialogInput,
} from './component/ca-select-folder-dialog/ca-select-folder-dialog.component';

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

  /**
   * Upload files to the folder. First it checks if there are files with the same name in the folder.
   * If there are, it opens a dialog to ask the user what to do.
   * After that, it uploads the files using the selected override mode.
   * @param folderId
   * @param fileEvent
   */
  public uploadDocument(folderId: string, fileEvent: File | File[]): void {
    const files = ClHelpService.convertObjectOrArrayToArray(fileEvent);

    const fileNames = files.map((file) => file.name);

    // observable that contains the override mode to use for the upload
    // it checks if there are files with the same name in the folder
    // if there are, it opens a dialog to ask the user what to do
    // of there are no files with the same name, it returns ERROR mode
    const getOverrideMode$: Observable<CaDocumentUploadOverrideMode> = this.documentService
      .checkDocumentsExistsInFolder(folderId, { names: fileNames })
      .pipe(
        switchMap((response) => {
          // if there are some file with the same name, we ask the user what to do
          if (response.folderHasFileWithSameName) {
            return this.openUploadFileOverrideDialog(fileNames);
          } else {
            // otherwise we upload the file using ERROR mode for override
            return of(CaDocumentUploadOverrideMode.ERROR);
          }
        }),
        // use the share so the check and dialog is only done once
        // then the upload is done 1 time per file
        share()
      );

    // generate an action for each file to upload
    for (const file of files) {
      const action: FlPortalAction = {
        type: this.uploadDocumentActionName,
        action: getOverrideMode$.pipe(
          switchMap((overrideMode) => this.documentService.uploadDocument(file, folderId, overrideMode))
        ),
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

  private openUploadFileOverrideDialog(fileNames: string[]): Observable<CaDocumentUploadOverrideMode> {
    const input: CaFolderUploadFileErrorDialogInput = {
      fileNames: fileNames,
    };
    return this.dialogService
      .openSmallDialog(CaFolderUploadFileOverrideDialogComponent, { data: input })
      .afterClosed()
      .pipe(
        map((result: CaFolderUploadFileErrorDialogOutput) => {
          if (result == null) {
            throw new Error('User cancelled the upload');
          }
          return result;
        })
      );
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
