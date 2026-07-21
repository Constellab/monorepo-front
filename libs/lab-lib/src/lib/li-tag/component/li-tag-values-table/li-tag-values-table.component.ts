import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import { CoDeprecatedTagComponent } from '@monorepo/community-lib';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiTagValueModel } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiTagDetailState } from '../../state/li-tag-detail.state';

@Component({
  selector: 'li-tag-values-table',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    TranslatePipe,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatIcon,
    FlIconModule,
    FlCorePipeModule,
    FlKeyValueModule,
    CoDeprecatedTagComponent,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './li-tag-values-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './li-tag-values-table.component.scss',
})
export class LiTagValuesTableComponent {
  private state = inject(LiTagDetailState);

  dataSource = this.state.values$;

  columnsDef: FlTableColumnStatic<LiTagValueModel>[] = [
    'isCommunityTagValue',
    'value',
    'shortDescription',
    'additionalInfos',
    'deprecated',
    'actions',
  ];

  openEditTagValue(tagValue: LiTagValueModel): void {
    console.log(tagValue);
  }

  openDeleteTagValue(tagValue: LiTagValueModel): void {
    console.log(tagValue);
  }
}
