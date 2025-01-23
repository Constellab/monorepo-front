import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { RouterLink } from '@angular/router';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LabTagListComponent } from '../../../lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LabViewConfigPreviewComponent } from '../lab-view-config-preview/lab-view-config-preview.component';
import { LabViewConfigFavoriteComponent } from '../lab-view-config-favorite/lab-view-config-favorite.component';
import { LabViewConfigActionsMenuComponent } from '../lab-view-config-actions-menu/lab-view-config-actions-menu.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';
import { LabGetEntityTagsPipe } from '../../../lab-tag-core/pipe/lab-get-entity-tags.pipe';

@Component({
  selector: 'lab-view-config-table',
  templateUrl: './lab-view-config-table.component.html',
  styleUrls: ['./lab-view-config-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    TdTechnicalDocModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LabTagListComponent,
    FlUserModule,
    LabViewConfigPreviewComponent,
    LabViewConfigFavoriteComponent,
    LabViewConfigActionsMenuComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    LabDetailRoutePipe,
    LabGetEntityTagsPipe,
  ],
})
export class LabViewConfigTableComponent {
  private routerService = inject(LabRouterService);

  @Input({ required: true }) datasource: FlArrayObs<LabViewConfig>;

  @Input() columns: FlTableColumnStatic<LabViewConfig>[] = ['title', 'resource', 'lastModifiedAt', 'preview'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() selectableRow: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Input() tagSelectable: boolean = true;

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  @Output() viewConfigSelected: EventEmitter<LabViewConfig> = new EventEmitter();

  rowClicked(viewConfig: LabViewConfig): void {
    if (this.selectableRow) {
      this.viewConfigSelected.next(viewConfig);
    }
  }

  onUpdate(viewConfig: LabViewConfig): void {
    this.datasource.updateItem(viewConfig);
  }

  navigateToViewConfigPage(viewConfig: LabViewConfig): void {
    this.routerService.navigateToViewConfig(viewConfig.resource.id, viewConfig.id);
  }
}
