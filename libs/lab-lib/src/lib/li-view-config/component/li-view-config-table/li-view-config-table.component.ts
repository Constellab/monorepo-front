import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiDetailRoutePipe, LiViewConfig } from '@monorepo/lab-lib/li-core';
import { LiGetEntityTagsPipe, LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiViewConfigActionsMenuComponent } from '../li-view-config-actions-menu/li-view-config-actions-menu.component';
import { LiViewConfigFavoriteComponent } from '../li-view-config-favorite/li-view-config-favorite.component';
import { LiViewConfigPreviewComponent } from '../li-view-config-preview/li-view-config-preview.component';

@Component({
  selector: 'li-view-config-table',
  templateUrl: './li-view-config-table.component.html',
  styleUrls: ['./li-view-config-table.component.scss'],
  imports: [
    MatTable,
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
    LiTagListComponent,
    FlUserModule,
    LiViewConfigPreviewComponent,
    LiViewConfigFavoriteComponent,
    LiViewConfigActionsMenuComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    LiDetailRoutePipe,
    LiGetEntityTagsPipe,
  ],
})
export class LiViewConfigTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LiViewConfig>;

  @Input() columns: FlTableColumnStatic<LiViewConfig>[] = ['title', 'resource', 'lastModifiedAt', 'preview'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() selectableRow: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  @Output() viewConfigSelected: EventEmitter<LiViewConfig> = new EventEmitter();

  rowClicked(viewConfig: LiViewConfig): void {
    if (this.selectableRow) {
      this.viewConfigSelected.next(viewConfig);
    }
  }

  onUpdate(viewConfig: LiViewConfig): void {
    this.datasource.updateItem(viewConfig);
  }
}
