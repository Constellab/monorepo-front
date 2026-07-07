import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectService } from '../../ca-core/service-api/ca-hierarchy-object.service';
import { CaResourceService } from '../../ca-core/service-api/ca-resource.service';
import { CaAppCardComponent } from '../ca-app-core/ca-app-card/ca-app-card.component';

@Component({
  selector: 'ca-my-apps-page',
  templateUrl: './ca-my-apps-page.component.html',
  styleUrls: ['./ca-my-apps-page.component.scss'],
  imports: [
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    CaAppCardComponent,
    FlInfiniteScrollModule,
    TranslatePipe,
  ],
})
export class CaMyAppsPageComponent implements OnInit {
  private hierarchyObjectService = inject(CaHierarchyObjectService);
  private resourceService = inject(CaResourceService);

  appsDatasource: CaHierarchyObjectDatasource;

  ngOnInit(): void {
    this.appsDatasource = this.hierarchyObjectService.getApplicationsDatasource();
  }

  getAppHref = (app: CaHierarchyObject): string => this.resourceService.getRedirectUrl(app.id);
}
