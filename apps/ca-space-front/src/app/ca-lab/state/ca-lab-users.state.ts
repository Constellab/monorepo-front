import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaUser } from '../../ca-core/model/entities/ca-user.class';
import { CaLabUser, CaLabUserDatasource } from '../../ca-core/model/entities/lab/ca-lab-user.class';
import { CaLabService } from '../../ca-core/service-api/ca-lab.service';
import { CaLabDatasourceState } from './ca-lab-datasource.state';

/**
 * Holds the lab users for a single lab, loaded once, so both the dashboard accordion
 * header (a preview via ca-user-list-inline) and its expanded content (the full table)
 * read from the same datasource without fetching twice.
 */
@Injectable()
export class CaLabUsersState extends CaLabDatasourceState<CaLabUser, CaLabUserDatasource> {
  private labService = inject(CaLabService);

  protected createDatasource(labId: string): CaLabUserDatasource {
    return new CaLabUserDatasource(this.labService.getLabUsers(labId));
  }

  /** The lab members as plain users, for the inline preview. */
  getUsers$(): Observable<CaUser[]> {
    return this.datasource.connect().pipe(map((labUsers) => labUsers.map((labUser) => labUser.user)));
  }
}
