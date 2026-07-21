import { ChangeDetectionStrategy,Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiScenario, LiScenarioDatasource, LiScenarioService } from '@monorepo/lab-lib/li-core';
import { LiScenarioTableComponent } from '@monorepo/lab-lib/li-scenario';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to list in a Table the scenarios that use a resource
 */
@Component({
  selector: 'li-scenarios-using-resource',
  templateUrl: './li-scenarios-using-resource.component.html',
  styleUrls: ['./li-scenarios-using-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInfiniteScrollModule,
    LiScenarioTableComponent,
    TranslatePipe,
  ],
})
export class LiScenariosUsingResourceComponent implements OnInit {
  private scenarioService = inject(LiScenarioService);

  @Input() resourceId: string;

  datasource: LiScenarioDatasource;

  columns: FlTableColumnStatic<LiScenario>[] = ['title', 'status'];

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
