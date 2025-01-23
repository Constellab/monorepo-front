import { Component, inject, Input, OnInit } from '@angular/core';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LabScenarioService } from '../../../../entity-service/lab-scenario.service';
import { LabScenario, LabScenarioDatasource } from '../../../../model/entities/lab-scenario.entity';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import {
  LabScenarioTableComponent,
} from '../../../lab-scenario-core/component/lab-scenario-table/lab-scenario-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to list in a Table the scenarios that use a resource
 */
@Component({
  selector: 'lab-scenarios-using-resource',
  templateUrl: './lab-scenarios-using-resource.component.html',
  styleUrls: ['./lab-scenarios-using-resource.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInfiniteScrollModule,
    LabScenarioTableComponent,
    TranslatePipe,
  ],
})
export class LabScenariosUsingResourceComponent implements OnInit {
  private scenarioService = inject(LabScenarioService);

  @Input() resourceId: string;

  datasource: LabScenarioDatasource;

  columns: FlTableColumnStatic<LabScenario>[] = ['title', 'status'];

  ngOnInit(): void {
    this.getDatasource();
  }

  public getDatasource(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.scenarioService.getByInputResource(this.resourceId, page, pageSize),
      5
    );
  }
}
