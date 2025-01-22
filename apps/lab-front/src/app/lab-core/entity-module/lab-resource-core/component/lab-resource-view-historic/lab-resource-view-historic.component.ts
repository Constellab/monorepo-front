import { Component, inject, Input, OnInit } from '@angular/core';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import {
  LabViewConfig,
  LabViewConfigDatasource,
} from '../../../../model/entities/resource/lab-view-config.entity';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlInfiniteScrollModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { LabViewConfigTableComponent } from '../../../lab-view-config-core/component/lab-view-config-table/lab-view-config-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Show historic of views for a resource
 */
@Component({
  selector: 'lab-resource-view-historic',
  templateUrl: './lab-resource-view-historic.component.html',
  styleUrls: ['./lab-resource-view-historic.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlInfiniteScrollModule,
    LabViewConfigTableComponent,
    TranslatePipe,
  ],
})
export class LabResourceViewHistoricComponent implements OnInit {
  private viewConfigService = inject(LabViewConfigService);
  private state = inject(LabResourceDetailState);

  @Input() resourceId: string;

  datasource: LabViewConfigDatasource;

  columns: FlTableColumnStatic<LabViewConfig>[] = ['title', 'lastModifiedAt', 'isFavorite'];

  ngOnInit(): void {
    this.getByResourceDatasource();
  }

  private getByResourceDatasource(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.viewConfigService.getByResource(this.resourceId, false, page, pageSize),
      10
    );
  }

  onViewConfigSelect(viewConfig: LabViewConfig): void {
    this.state.addViewFromConfig(viewConfig.id, viewConfig.title);
  }
}
