import { Component, inject,Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiViewConfig, LiViewConfigDatasource, LiViewConfigService } from '@monorepo/lab-lib/li-core';
import { LiViewConfigTableComponent } from '@monorepo/lab-lib/li-view-config';
import { TranslatePipe } from '@ngx-translate/core';

import { LiResourceDetailState } from '../../state/li-resource-detail.state';

/**
 * Show historic of views for a resource
 */
@Component({
  selector: 'li-resource-view-historic',
  templateUrl: './li-resource-view-historic.component.html',
  styleUrls: ['./li-resource-view-historic.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlInfiniteScrollModule,
    LiViewConfigTableComponent,
    TranslatePipe,
  ],
})
export class LiResourceViewHistoricComponent implements OnInit {
  private viewConfigService = inject(LiViewConfigService);
  private state = inject(LiResourceDetailState);

  @Input() resourceId: string;

  datasource: LiViewConfigDatasource;

  columns: FlTableColumnStatic<LiViewConfig>[] = ['title', 'lastModifiedAt', 'isFavorite'];

  ngOnInit(): void {
    this.getByResourceDatasource();
  }

  private getByResourceDatasource(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.viewConfigService.getByResource(this.resourceId, false, page, pageSize),
      10
    );
  }

  onViewConfigSelect(viewConfig: LiViewConfig): void {
    this.state.addViewFromConfig(viewConfig.id, viewConfig.title);
  }
}
