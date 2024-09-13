import { Component, OnInit } from '@angular/core';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { CaFolderWithHierarchy } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CaHierarchyObjectDatasource } from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import {
  CaFolderFormDialogComponent,
  CaFolderFormDialogInput
} from '../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-form-dialog/ca-folder-form-dialog.component';

@Component({
  selector: 'ca-my-folders-page',
  templateUrl: './ca-my-folders-page.component.html',
  styleUrls: ['./ca-my-folders-page.component.scss']
})
export class CaMyFoldersPageComponent implements OnInit {

  folderDatasource: CaHierarchyObjectDatasource;

  constructor(private folderService: CaFolderService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.folderDatasource = this.folderService.getMyFoldersDatasource();
  }

  openCreateFolderDialog(): void {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'create'
    };
    this.dialogService.openSmallDialog(CaFolderFormDialogComponent, { data: dialogInput }).afterClosed().subscribe(
      folders => this.onCreateFolderClosed(folders)
    );
  }

  private onCreateFolderClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      // add the folder at the beginning of the array
      // and refresh the array
      this.folderDatasource.addItem(folder.hierarchyRepresentation, () => true);
    }
  }

}
