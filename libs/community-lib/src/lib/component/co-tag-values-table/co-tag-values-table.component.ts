import { Component, input, OnInit, output } from '@angular/core';
import { FlDatasourcePaginated, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { CoTagValue } from '../../model/co-tag-value.class';
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
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { CoDeprecatedTagComponent } from '../co-deprecated-tag/co-deprecated-tag.component';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { CoTagCommunityIconComponent } from '../co-tag-community-icon/co-tag-community-icon.component';

@Component({
  selector: 'co-tag-values-table',
  imports: [
    MatTable,
    MatColumnDef,
    FlIconModule,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatIcon,
    MatHeaderCellDef,
    TranslatePipe,
    FlCorePipeModule,
    FlKeyValueModule,
    CoDeprecatedTagComponent,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    FlInfiniteScrollModule,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    CoTagCommunityIconComponent,
  ],
  templateUrl: './co-tag-values-table.component.html',
  styleUrl: './co-tag-values-table.component.scss',
})
export class CoTagValuesTableComponent implements OnInit {
  dataSource = input.required<FlDatasourcePaginated<CoTagValue, any>>();

  tagKey = input<string>('');
  hideEditButton = input<boolean>(false);
  hideDeleteButton = input<boolean>(false);
  showIsCommunityTagValue = input<boolean>(false);
  deleteButtonToolTip = input<string>('');

  columnsDef: FlTableColumnStatic<CoTagValue>[] = [
    'value',
    'shortDescription',
    'additionalInfos',
    'deprecated',
    'actions',
  ];

  editTagValue = output<CoTagValue>();
  deleteTagValue = output<CoTagValue>();

  ngOnInit(): void {
    if (this.showIsCommunityTagValue()) {
      this.columnsDef.unshift('isCommunityTagValue');
    }

    if (this.hideDeleteButton() && this.hideEditButton()) {
      this.columnsDef = this.columnsDef.filter((col) => col !== 'actions');
    }
  }

  emitEditTagValue(tagValue: CoTagValue): void {
    this.editTagValue.emit(tagValue);
  }

  emitDeleteTagValue(tagValue: CoTagValue): void {
    this.deleteTagValue.emit(tagValue);
  }
}
