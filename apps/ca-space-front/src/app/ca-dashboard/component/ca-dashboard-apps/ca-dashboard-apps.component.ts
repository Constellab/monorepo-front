import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { CaAppCardComponent } from '../../../ca-app/ca-app-core/ca-app-card/ca-app-card.component';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaIsSpaceUserDirective } from '../../../ca-core/module/ca-core-directive/ca-is-space-user/ca-is-space-user.directive';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { CaHierarchyObjectService } from '../../../ca-core/service-api/ca-hierarchy-object.service';
import { CaConstellabSuiteListDialogComponent } from '../ca-constellab-suite-list-dialog/ca-constellab-suite-list-dialog.component';
import { CaDashboardEmptyListComponent } from '../ca-dashboard-empty-list/ca-dashboard-empty-list.component';
import { CaDashboardListLayoutComponent } from '../ca-dashboard-list-layout/ca-dashboard-list-layout.component';

/**
 * Small list of applications in the dashboard
 */
@Component({
  selector: 'ca-dashboard-apps',
  templateUrl: './ca-dashboard-apps.component.html',
  styleUrls: ['./ca-dashboard-apps.component.scss'],
  imports: [
    CaDashboardListLayoutComponent,
    CaAppCardComponent,
    CaDashboardEmptyListComponent,
    CaIsSpaceUserDirective,
    MatButtonModule,
    MatIcon,
    TranslatePipe,
  ],
})
export class CaDashboardAppsComponent implements OnInit {
  private hierarchyObjectService = inject(CaHierarchyObjectService);
  private dialogService = inject(FlDialogService);

  isSpaceUser = inject(CaAuthenticatedUserService).isCurrentSpaceUser();

  appsDatasource: CaHierarchyObjectDatasource;

  myAppsRoute: string = CaRouterService.getMyAppsRoute();

  color = inject(FlThemeService).getCurrentThemeDetail().warn;

  ngOnInit(): void {
    this.getApplications();
  }

  private getApplications(): void {
    this.appsDatasource = new FlEntityPaginatedDatasource<CaHierarchyObject>(
      (page, size) => this.hierarchyObjectService.searchApplications(page, size),
      CaDashboardListLayoutComponent.maxItems
    );
  }

  openConstellabSuiteDialog(): void {
    this.dialogService.openMediumDialog(CaConstellabSuiteListDialogComponent);
  }

  // Apps open the light redirect page in a new tab, which fetches the access url and redirects to the app.
  getAppHref = (app: CaHierarchyObject): string => CaRouterService.getResourceRedirectRoute(app.id);
}
