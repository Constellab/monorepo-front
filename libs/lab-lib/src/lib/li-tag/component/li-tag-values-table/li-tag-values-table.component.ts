import { Component, inject } from '@angular/core';
import { LiTagDetailState } from '../../state/li-tag-detail.state';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LiTagValueModel } from '@monorepo/lab-lib/li-core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { CoDeprecatedTagComponent } from '@monorepo/community-lib';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

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
