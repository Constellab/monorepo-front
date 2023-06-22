import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CaSpaceUser, CaSpaceUserDatasource} from '../../../../model/entities/space/ca-space-user.class';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';

/**
 * Table to list the users of a space
 */
@Component({
  selector: 'ca-space-user-table',
  templateUrl: './ca-space-user-table.component.html',
  styleUrls: ['./ca-space-user-table.component.scss']
})
export class CaSpaceUserTableComponent {

  @Input() datasource: CaSpaceUserDatasource;

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
