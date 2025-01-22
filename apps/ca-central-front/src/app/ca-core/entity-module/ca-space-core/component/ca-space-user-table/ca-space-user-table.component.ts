import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CaSpaceUser, CaSpaceUserDatasource } from '../../../../model/entities/space/ca-space-user.class';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
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
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

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
