import { inject, Injectable } from '@angular/core';
import { FlDatasourcePaginated, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlUserConfig } from '@monorepo/front-core-lib/fl-user';
import { LiAuthenticatedUserService, LiUser, LiUserService } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LabEnvironmentHelper } from './lab-environment.helper';

@Injectable({
  providedIn: 'root',
})
export class LabUserConfig extends FlUserConfig {
  private userService = inject(LiUserService);
  private authenticatedUserService = inject(LiAuthenticatedUserService);

  constructor() {
    super();
  }

  getUserPhotoUrl(photo: string): string {
    return LabEnvironmentHelper.getSpaceApiUrl() + '/users/photo-v2/' + photo;
  }

  getUserDetailRoute(): string | null {
    // disabled user detail route
    return null;
  }

  getUserById(userId: string): Observable<LiUser> {
    return this.userService.getUserById(userId);
  }

  getSearchByNamesDatasource(): FlDatasourcePaginated<LiUser, FlInputSearchFilter> {
    return this.userService.searchByNameDatasource();
  }

  getAuthenticatedUser(): LiUser {
    const user = this.authenticatedUserService.getCurrentUser();
    if (user == null) {
      throw new Error('No authenticated user available');
    }
    return user;
  }
}
