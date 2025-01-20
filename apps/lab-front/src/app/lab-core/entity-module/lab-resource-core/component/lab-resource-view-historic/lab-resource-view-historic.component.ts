import { Component, Input, OnInit } from '@angular/core';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import {
  LabViewConfig,
  LabViewConfigDatasource,
} from '../../../../model/entities/resource/lab-view-config.entity';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';

/**
 * Show historic of views for a resource
 */
@Component({
    selector: 'lab-resource-view-historic',
    templateUrl: './lab-resource-view-historic.component.html',
    styleUrls: ['./lab-resource-view-historic.component.scss'],
    standalone: false
})
export class LabResourceViewHistoricComponent implements OnInit {
  @Input() resourceId: string;

  datasource: LabViewConfigDatasource;

  columns: FlTableColumnStatic<LabViewConfig>[] = ['title', 'lastModifiedAt', 'isFavorite'];

  constructor(
    private viewConfigService: LabViewConfigService,
    private state: LabResourceDetailState
  ) {}

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
