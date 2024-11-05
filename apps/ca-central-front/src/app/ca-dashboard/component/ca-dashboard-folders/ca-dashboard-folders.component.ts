import { Component, OnInit } from '@angular/core';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaFolder } from '../../../ca-core/model/entities/folder/ca-folder.class';
import { CaDashboardListLayoutComponent } from '../ca-dashboard-list-layout/ca-dashboard-list-layout.component';
import { CaHierarchyObjectDatasource } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderActionService } from '../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';

/**
 * Small list of folder in the dashboard
 */
@Component({
  selector: 'ca-dashboard-folders',
  templateUrl: './ca-dashboard-folders.component.html',
  styleUrls: ['./ca-dashboard-folders.component.scss'],
})
export class CaDashboardFoldersComponent implements OnInit {
  foldersDatasource: CaHierarchyObjectDatasource;

  myFoldersRoute: string = CaRouterService.getMyFoldersRoute();

  constructor(
    private folderService: CaFolderService,
    private folderActionService: CaFolderActionService,
    private routerService: CaRouterService
  ) {}

  ngOnInit(): void {
    this.getMyFolders();
  }

  openCreateFolderDialog(): void {
    this.folderActionService
      .openCreateRootFolderDialog()
      .subscribe((folder) => this.onCreateFolderDialogClosed(folder));
  }

  private getMyFolders(): void {
    this.foldersDatasource = this.folderService.getMyFoldersDatasource(
      CaDashboardListLayoutComponent.maxItems
    );
  }

  private onCreateFolderDialogClosed(folder?: CaFolder): void {
    if (folder) {
      this.routerService.navigateToFolderDetail(folder.id);
    }
  }
}
