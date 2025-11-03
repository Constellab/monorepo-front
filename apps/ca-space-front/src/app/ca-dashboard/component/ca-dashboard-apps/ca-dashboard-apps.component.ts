import { Component, inject, OnInit } from '@angular/core';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';

import { CaAppCardComponent } from '../../../ca-app/ca-app-core/ca-app-card/ca-app-card.component';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaHierarchyObjectService } from '../../../ca-core/service-api/ca-hierarchy-object.service';
import { CaDashboardListLayoutComponent } from '../ca-dashboard-list-layout/ca-dashboard-list-layout.component';

/**
 * Small list of applications in the dashboard
 */
@Component({
  selector: 'ca-dashboard-apps',
  templateUrl: './ca-dashboard-apps.component.html',
  styleUrls: ['./ca-dashboard-apps.component.scss'],
  imports: [CaDashboardListLayoutComponent, CaAppCardComponent],
})
export class CaDashboardAppsComponent implements OnInit {
  private hierarchyObjectService = inject(CaHierarchyObjectService);

  appsDatasource: CaHierarchyObjectDatasource;

  myAppsRoute: string = CaRouterService.getMyAppsRoute();

  ngOnInit(): void {
    this.getApplications();
  }

  private getApplications(): void {
    this.appsDatasource = new FlEntityPaginatedDatasource<CaHierarchyObject>(
      (page, size) => this.hierarchyObjectService.searchApplications(page, size),
      CaDashboardListLayoutComponent.maxItems
    );
  }
}
