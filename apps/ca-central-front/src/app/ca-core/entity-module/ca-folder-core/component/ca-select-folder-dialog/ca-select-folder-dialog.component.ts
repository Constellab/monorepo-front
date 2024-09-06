import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlTableColumnStatic, FlTranslatableText } from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaProjectService } from '../../../../service-api/ca-project.service';
import { CaAuthenticatedUserService } from '../../../../service-api/ca-authenticated-user.service';
import { ClHelpService } from '@monorepo/core-lib';
import { CaFolder, CaFolderDatasource, CaFolderObjectType } from '../../../../model/entities/project/ca-folder.class';
import { CaFolderSearchFields } from '../../model/ca-folder-search.class';
import { CaFolderTableEvent } from '../ca-folder-table/ca-folder-table.component';

export interface CaSelectFolderDialogInput {
  /**
   * Mode for the folder selection
   * root: only root folder can be selected
   * any: any project can be selected
   */
  mode: 'root' | 'any';

  title: FlTranslatableText;

  // use to initialize the dialog with a folder
  currentObjectId?: string;
}

@Component({
  selector: 'ca-select-folder-dialog',
  templateUrl: './ca-select-folder-dialog.component.html',
  styleUrl: './ca-select-folder-dialog.component.scss'
})
export class CaSelectFolderDialogComponent implements OnInit, OnDestroy {

  foldersDatasource: CaFolderDatasource;

  columns: FlTableColumnStatic<CaFolder>[] = ['name', 'user', 'lastModifiedAt'];

  // contains the list of parent folder for the breadcrumbs
  parentFolders: CaFolder[] = null;
  selectedFolder: CaFolder;

  dialogInput: CaSelectFolderDialogInput = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<CaSelectFolderDialogComponent>,
              private projectService: CaProjectService,
              private authenticatedUserService: CaAuthenticatedUserService) {
  }

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
    this.projectService.getObjectProjectAncestors(currentObjectId).subscribe(
      ancestors => this.initParentFolders(ancestors)
    );
  }

  private initParentFolders(ancestors: CaFolder[]): void {
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
      this.foldersDatasource = this.projectService.getProjectByCurrentSpaceDatasource();
    } else {
      this.foldersDatasource = this.projectService.getMyFoldersDatasource();
    }
    this.parentFolders = [];
  }

  moveToRoot(): void {
    // to prevent reload when init is recall
    if (ClHelpService.isEmptyArray(this.parentFolders)) return;
    this.initRoots();
    this.selectedFolder = null;
  }

  onFolderEvent(event: CaFolderTableEvent): void {
    switch (event.action) {
      case 'click':
        this.selectFolder(event.folder);
        break;
      case 'dblClick':
        this.folderDblClicked(event.folder);
        break;
    }
  }

  private selectFolder(folder: CaFolder): void {
    this.selectedFolder = folder;
  }

  private folderDblClicked(folder: CaFolder): void {
    if (this.isRootMode()) {
      this.selectFolder(folder);
      this.close();
    } else {
      this.openFolder(folder);
    }
  }

  openFolder(folder: CaFolder): void {
    if (!this.isRootMode()) {
      this.getChildren(folder.id);
      this.parentFolders.push(folder);
    }

    this.selectedFolder = folder;
  }

  selectParentFolder(parentFolder: CaFolder): void {
    // if the last parent is selected, do nothing it is already selected
    if (this.parentFolders[this.parentFolders.length - 1].id === parentFolder.id) {
      return;
    }

    this.getChildren(parentFolder.id);
    // update the list of parent
    const index = this.parentFolders.findIndex(p => p.id === parentFolder.id);
    this.parentFolders = this.parentFolders.slice(0, index + 1);
    this.selectedFolder = parentFolder;

  }

  private getChildren(folderId: string): void {
    if (this.foldersDatasource) {
      this.foldersDatasource.clear();
    }

    // get only folder children
    const filters = new CaFolderSearchFields();
    filters.objectType = CaFolderObjectType.FOLDER;
    this.foldersDatasource = this.projectService.searchChildrenDatasource(folderId, filters);
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
