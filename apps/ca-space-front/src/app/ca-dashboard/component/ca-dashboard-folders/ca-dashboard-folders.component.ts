import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { CaFolderActionService } from '../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { CaHierarchyObjectCardComponent } from '../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-card/ca-hierarchy-object-card.component';
import { CaFolder } from '../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectDatasource } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaIsSpaceUserDirective } from '../../../ca-core/module/ca-core-directive/ca-is-space-user/ca-is-space-user.directive';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
import { CaDashboardEmptyListComponent } from '../ca-dashboard-empty-list/ca-dashboard-empty-list.component';
import { CaDashboardListLayoutComponent } from '../ca-dashboard-list-layout/ca-dashboard-list-layout.component';

/**
 * Small list of folder in the dashboard
 */
@Component({
  selector: 'ca-dashboard-folders',
  templateUrl: './ca-dashboard-folders.component.html',
  styleUrls: ['./ca-dashboard-folders.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CaDashboardListLayoutComponent,
    CaHierarchyObjectCardComponent,
    CaDashboardEmptyListComponent,
    CaIsSpaceUserDirective,
    MatButtonModule,
    MatIcon,
    TranslatePipe,
  ],
})
export class CaDashboardFoldersComponent implements OnInit {
  private folderService = inject(CaFolderService);
  private folderActionService = inject(CaFolderActionService);
  private routerService = inject(CaRouterService);

  isSpaceUser = inject(CaAuthenticatedUserService).isCurrentSpaceUser();

  foldersDatasource: CaHierarchyObjectDatasource;

  myFoldersRoute: string = CaRouterService.getMyFoldersRoute();

  color = inject(FlThemeService).getCurrentThemeDetail().accent;

  ngOnInit(): void {
    this.getMyFolders();
  }

  openCreateFolderDialog(): void {
    this.folderActionService
      .openCreateRootFolderDialog()
      .subscribe((folder) => this.onCreateFolderDialogClosed(folder));
  }

  private getMyFolders(): void {
    this.foldersDatasource = this.folderService.getRootFoldersDatasource(
      CaDashboardListLayoutComponent.maxItems
    );
  }

  private onCreateFolderDialogClosed(folder?: CaFolder | null): void {
    if (folder) {
      this.routerService.navigateToFolderDetail(folder.id);
    }
  }
}
