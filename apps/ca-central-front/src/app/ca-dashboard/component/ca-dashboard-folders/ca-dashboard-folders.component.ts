import { Component, OnInit } from '@angular/core';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaFolder } from '../../../ca-core/model/entities/folder/ca-folder.class';
import { CaDashboardListLayoutComponent } from '../ca-dashboard-list-layout/ca-dashboard-list-layout.component';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  CaFolderFormDialogComponent,
  CaFolderFormDialogInput
} from '../../../ca-core/entity-module/ca-folder-core/component/ca-folder-form-dialog/ca-folder-form-dialog.component';
import { CaHierarchyObjectDatasource } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

/**
 * Small list of folder in the dashboard
 */
@Component({
  selector: 'ca-dashboard-folders',
  templateUrl: './ca-dashboard-folders.component.html',
  styleUrls: ['./ca-dashboard-folders.component.scss']
})
export class CaDashboardFoldersComponent implements OnInit {

  foldersDatasource: CaHierarchyObjectDatasource;

  myFoldersRoute: string = CaRouterService.getMyFoldersRoute();

  constructor(private folderService: CaFolderService,
              private dialogService: FlDialogService,
              private routerService: CaRouterService) {
  }

  ngOnInit(): void {
    this.getMyFolders();
  }

  private getMyFolders(): void {
    this.foldersDatasource = this.folderService.getMyFoldersDatasource(CaDashboardListLayoutComponent.maxItems);
  }

  openCreateFolderDialog(): void {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'create'
    };
    this.dialogService.openSmallDialog(CaFolderFormDialogComponent, { data: dialogInput }).afterClosed().subscribe(
      folder => this.onCreateFolderDialogClosed(folder)
    );
  }

  private onCreateFolderDialogClosed(folder?: CaFolder): void {
    if (folder) {
      this.routerService.navigateToFolderDetail(folder.id);
    }
  }
}
