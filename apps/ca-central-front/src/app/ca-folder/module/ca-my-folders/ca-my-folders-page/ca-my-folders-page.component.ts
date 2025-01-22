import { Component, OnInit, inject } from '@angular/core';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { CaFolderWithHierarchy } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectDatasource } from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderActionService } from '../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';

@Component({
  selector: 'ca-my-folders-page',
  templateUrl: './ca-my-folders-page.component.html',
  styleUrls: ['./ca-my-folders-page.component.scss'],
  standalone: false,
})
export class CaMyFoldersPageComponent implements OnInit {
  private folderService = inject(CaFolderService);
  private folderActionService = inject(CaFolderActionService);

  folderDatasource: CaHierarchyObjectDatasource;

  ngOnInit(): void {
    this.folderDatasource = this.folderService.getMyFoldersDatasource();
  }

  openCreateFolderDialog(): void {
    this.folderActionService
      .openCreateRootFolderDialog()
      .subscribe((folders) => this.onCreateFolderClosed(folders));
  }

  private onCreateFolderClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      // add the folder at the beginning of the array
      // and refresh the array
      this.folderDatasource.addItem(folder.hierarchyRepresentation, () => true);
    }
  }
}
