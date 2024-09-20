import {Injectable} from '@angular/core';
import {LabEnvironmentHelper} from '../../utils/lab-environment.helper';
import { FlDatasourcePaginated, FlInputSearchFilter, FlUserConfig } from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {LabUser} from '../entities/lab-user.entity';
import {LabUserService} from '../../entity-service/lab-user.service';
import {LabAuthenticatedUserService} from '../../service/lab-authenticated-user.service';

@Injectable({
  providedIn: 'root'
})
export class LabUserConfig extends FlUserConfig {

  constructor(private userService: LabUserService,
              private authenticatedUserService: LabAuthenticatedUserService) {
    super();
  }

  getUserPhotoUrl(photo: string): string {
    return LabEnvironmentHelper.getSpaceApiUrl() + '/users/photo-v2/' + photo;
  }

  getUserDetailRoute(): string {
    // disabled user detail route
    return null;
  }

  getUserById(userId: string): Observable<LabUser> {
    return this.userService.getUserById(userId);
  }

  getSearchByNamesDatasource(): FlDatasourcePaginated<LabUser, FlInputSearchFilter> {
    return this.userService.searchByNameDatasource();
  }

  getAuthenticatedUser(): LabUser {
    return this.authenticatedUserService.getCurrentUser();
  }

}
