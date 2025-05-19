import { Component, input, output } from '@angular/core';
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
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CoTagKeyAdditionalInfoSpec, CoTagKeyEditAdditionalInfoSpec } from '@monorepo/community-lib';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'ha-tag-additional-info-specs-table',
  imports: [
    MatTable,
    TranslatePipe,
    MatIcon,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatIconButton,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTooltip,
  ],
  templateUrl: './ha-tag-additional-info-specs-table.component.html',
  styleUrl: './ha-tag-additional-info-specs-table.component.scss',
  host: { ngSkipHydration: 'true' },
})
export class HaTagAdditionalInfoSpecsTableComponent {
  dataSource = input.required<CoTagKeyEditAdditionalInfoSpec[]>();

  openEditInfoSpecDialog = output<CoTagKeyEditAdditionalInfoSpec>();
  deleteInfoSpec = output<string>();

  displayedColumns = ['name', 'optional', 'actions'];

  emitOpenEditInfoSpecDialog(name: string, infoSpec: CoTagKeyAdditionalInfoSpec): void {
    this.openEditInfoSpecDialog.emit({
      name: name,
      optional: infoSpec.optional,
    });
  }

  emitDeleteInfoSpec(name: string): void {
    this.deleteInfoSpec.emit(name);
  }
}
