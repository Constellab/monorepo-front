import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {CaUser} from '../../../../../ca-core/model/entities/ca-user.class';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';

/**
 * Component to list the users that have access to a project
 */
@Component({
  selector: 'ca-project-users',
  templateUrl: './ca-project-users.component.html',
  styleUrls: ['./ca-project-users.component.scss']
})
export class CaProjectUsersComponent {

  @Input() projectId$: Observable<string>;

  users$: Observable<CaUser[]> = this.state.getUsers().connect();

  constructor(private state: CaProjectDetailState) {
  }

  selectedUserChange(users: CaUser[]): void {
    this.state.filterByUsers(users);
  }

}
