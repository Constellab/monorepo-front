import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Injector, Input, Output } from '@angular/core';
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
import { CoTagCommunityIconComponent } from '@monorepo/community-lib';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiDetailRoutePipe, LiTagKeyModel } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-tag-table',
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCell,
    MatSortHeader,
    MatHeaderCellDef,
    TranslatePipe,
    MatCell,
    MatCellDef,
    FlTagModule,
    AsyncPipe,
    LiDetailRoutePipe,
    RouterLink,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatIcon,
    FlTextIconModule,
    FlIconModule,
    CoTagCommunityIconComponent,
  ],
  templateUrl: './li-tag-table.component.html',
  styleUrl: './li-tag-table.component.scss',
})
export class LiTagTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LiTagKeyModel>;

  @Input() columns: FlTableColumnStatic<LiTagKeyModel>[] = [
    'key',
    'label',
    'valueFormat',
    // 'isPropagable',
    // 'deprecated',
    // 'isCommunityTag',
  ];

  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() tagSelected: EventEmitter<LiTagKeyModel> = new EventEmitter();

  private injector = inject(Injector);

  rowClicked(tag: LiTagKeyModel): void {
    if (this.rowSelectable) {
      this.tagSelected.next(tag);
    }
  }
}
