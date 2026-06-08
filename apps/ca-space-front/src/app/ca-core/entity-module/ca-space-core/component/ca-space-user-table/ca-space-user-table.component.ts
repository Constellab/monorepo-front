import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSort, MatSortHeader } from '@angular/material/sort';
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
import { MatTooltip } from '@angular/material/tooltip';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaSpaceUser, CaSpaceUserDatasource } from '../../../../model/entities/space/ca-space-user.class';

/**
 * Table to list the users of a space
 */
@Component({
  selector: 'ca-space-user-table',
  templateUrl: './ca-space-user-table.component.html',
  styleUrls: ['./ca-space-user-table.component.scss'],
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
    FlUserModule,
    FlDateModule,
    FlTextIconModule,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaSpaceUserTableComponent {
  @Input({ required: true }) datasource: CaSpaceUserDatasource<any>;

  @Input() columns: FlTableColumnStatic<CaSpaceUser>[];

  @Output() removeUser: EventEmitter<CaSpaceUser> = new EventEmitter();

  @Output() activateUser: EventEmitter<CaSpaceUser> = new EventEmitter();

  @Output() deactivateUser: EventEmitter<CaSpaceUser> = new EventEmitter();

  @Output() updateRole: EventEmitter<CaSpaceUser> = new EventEmitter();

  onRemoveUser(user: CaSpaceUser): void {
    this.removeUser.emit(user);
  }

  onActivateUser(user: CaSpaceUser): void {
    this.activateUser.emit(user);
  }

  onDeactivateUser(user: CaSpaceUser): void {
    this.deactivateUser.emit(user);
  }

  onUpdateRole(user: CaSpaceUser): void {
    this.updateRole.emit(user);
  }
}
