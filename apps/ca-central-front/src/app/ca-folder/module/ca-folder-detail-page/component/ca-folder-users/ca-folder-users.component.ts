import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {CaUser} from '../../../../../ca-core/model/entities/ca-user.class';
import {CaFolderDetailState} from '../../state/ca-folder-detail.state';

/**
 * Component to list the users that have access to a folder
 */
@Component({
  selector: 'ca-folder-users',
  templateUrl: './ca-folder-users.component.html',
  styleUrls: ['./ca-folder-users.component.scss']
})
export class CaFolderUsersComponent {

  @Input() folderId$: Observable<string>;

  users$: Observable<CaUser[]> = this.state.getUsers().connect();

  constructor(private state: CaFolderDetailState) {
  }

  filterByUsers(users: CaUser[]): void {
    this.state.filterChildren({users});
  }
}
