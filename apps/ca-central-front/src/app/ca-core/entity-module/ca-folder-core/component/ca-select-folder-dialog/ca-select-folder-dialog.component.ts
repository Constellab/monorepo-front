import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlTableColumnStatic, FlTranslatableText } from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaAuthenticatedUserService } from '../../../../service-api/ca-authenticated-user.service';
import { ClHelpService } from '@monorepo/core-lib';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
  CaHierarchyObjectType,
} from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectSearchFields } from '../../../ca-hierarchy-object-core/model/ca-hierarchy-object-search.class';
import {
  CaHierarchyObjectTableEvent,
  CaHierarchyObjectTableComponent,
} from '../../../ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlInfiniteScrollModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlTranslateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-translate/fl-translate.module';

export interface CaSelectFolderDialogInput {
  /**
   * Mode for the folder selection
   * root: only root folder can be selected
   * any: any folder can be selected
   */
  mode: 'root' | 'any';

  title: FlTranslatableText;

  // use to initialize the dialog with a folder
  currentObjectId?: string;
}

@Component({
  selector: 'ca-select-folder-dialog',
  templateUrl: './ca-select-folder-dialog.component.html',
  styleUrl: './ca-select-folder-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlInfiniteScrollModule,
    CaHierarchyObjectTableComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslatePipe,
    FlTranslateModule,
  ],
})
export class CaSelectFolderDialogComponent implements OnInit, OnDestroy {
  private dialogRef = inject<MatDialogRef<CaSelectFolderDialogComponent>>(MatDialogRef);
  private folderService = inject(CaFolderService);
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  foldersDatasource: CaHierarchyObjectDatasource;

  columns: FlTableColumnStatic<CaHierarchyObject>[] = ['name', 'user', 'lastModifiedAt'];

  // contains the list of parent folder for the breadcrumbs
  parentFolders: CaHierarchyObject[] = null;
  selectedFolder: CaHierarchyObject;

  dialogInput: CaSelectFolderDialogInput = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    // for any mode, we add a custom template column to add a button to zoom to folder
    if (!this.isRootMode()) {
      this.columns.push('customAction');
    }

    if (this.dialogInput.currentObjectId) {
      this.initForFolder(this.dialogInput.currentObjectId);
    } else {
      this.initRoots();
    }
  }

  private initForFolder(currentObjectId: string): void {
    this.folderService
      .getObjectFolderAncestors(currentObjectId)
      .subscribe((ancestors) => this.initParentFolders(ancestors));
  }

  private initParentFolders(ancestors: CaHierarchyObject[]): void {
    if (ancestors.length === 0) {
      this.initRoots();
      return;
    }

    this.selectedFolder = ancestors.shift();

    if (this.selectedFolder.isRoot()) {
      this.initRoots();
    } else {
      this.getChildren(this.selectedFolder.parentId);
      this.parentFolders = ancestors.reverse();
    }
  }

  initRoots(): void {
    if (this.authenticatedUserService.isCurrentSpaceAdmin()) {
      this.foldersDatasource = this.folderService.getFolderByCurrentSpaceDatasource();
    } else {
      this.foldersDatasource = this.folderService.getMyFoldersDatasource();
    }
    this.parentFolders = [];
  }

  moveToRoot(): void {
    // to prevent reload when init is recall
    if (ClHelpService.isEmptyArray(this.parentFolders)) return;
    this.initRoots();
    this.selectedFolder = null;
  }

  onFolderEvent(event: CaHierarchyObjectTableEvent): void {
    switch (event.action) {
      case 'click':
        this.selectFolder(event.hierarchyObject);
        break;
      case 'dblClick':
        this.folderDblClicked(event.hierarchyObject);
        break;
    }
  }

  private selectFolder(folder: CaHierarchyObject): void {
    this.selectedFolder = folder;
  }

  private folderDblClicked(folder: CaHierarchyObject): void {
    if (this.isRootMode()) {
      this.selectFolder(folder);
      this.close();
    } else {
      this.openFolder(folder);
    }
  }

  openFolder(folder: CaHierarchyObject): void {
    if (!this.isRootMode()) {
      this.getChildren(folder.id);
      this.parentFolders.push(folder);
    }

    this.selectedFolder = folder;
  }

  selectParentFolder(parentFolder: CaHierarchyObject): void {
    // if the last parent is selected, do nothing it is already selected
    if (this.parentFolders[this.parentFolders.length - 1].id === parentFolder.id) {
      return;
    }

    this.getChildren(parentFolder.id);
    // update the list of parent
    const index = this.parentFolders.findIndex((p) => p.id === parentFolder.id);
    this.parentFolders = this.parentFolders.slice(0, index + 1);
    this.selectedFolder = parentFolder;
  }

  private getChildren(folderId: string): void {
    if (this.foldersDatasource) {
      this.foldersDatasource.clear();
    }

    // get only folder children
    const filters = new CaHierarchyObjectSearchFields();
    filters.objectType = CaHierarchyObjectType.FOLDER;
    this.foldersDatasource = this.folderService.searchChildrenDatasource(folderId, filters);
  }

  close(): void {
    this.dialogRef.close(this.selectedFolder);
  }

  isRootMode(): boolean {
    return this.dialogInput.mode === 'root';
  }

  ngOnDestroy(): void {
    this.foldersDatasource?.disconnect();
  }
}
