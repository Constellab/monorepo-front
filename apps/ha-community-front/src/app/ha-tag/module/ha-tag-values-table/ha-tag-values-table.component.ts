import { Component, input, output } from '@angular/core';
import {
  HaTagValue,
  HaTagValueDatasourceFilters,
  HaTagValueDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-tag-value.class';
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
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';

@Component({
  selector: 'ha-tag-values-table',
  imports: [
    MatCell,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    TranslatePipe,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatIconButton,
    MatTooltip,
    MatIcon,
    FlSearchModule,
    FlCorePipeModule,
    FlKeyValueModule,
  ],
  templateUrl: './ha-tag-values-table.component.html',
  styleUrl: './ha-tag-values-table.component.scss',
})
export class HaTagValuesTableComponent {
  dataSource = input.required<HaTagValueDatasourcePaginated<HaTagValueDatasourceFilters>>();
  hideEditButton = input<boolean>(false);
  hideDeleteButton = input<boolean>(false);

  editTagValue = output<HaTagValue>();
  deleteTagValue = output<HaTagValue>();

  protected readonly JSON = JSON;
  columnsDef: FlTableColumnStatic<HaTagValue>[] = [
    'value',
    'shortDescription',
    'additionalInfos',
    'deprecated',
    'edit',
    'delete',
  ];

  emitEditTagValue(tagValue: HaTagValue): void {
    this.editTagValue.emit(tagValue);
  }

  emitDeleteTagValue(tagValue: HaTagValue): void {
    this.deleteTagValue.emit(tagValue);
  }
}
