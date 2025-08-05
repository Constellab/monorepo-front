import { inject, Injectable } from '@angular/core';
import { FlDatasourcePaginated, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlUserConfig } from '@monorepo/front-core-lib/fl-user';
import { LiAuthenticatedUserService, LiUser, LiUserService } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { DcEnvironmentHelper } from '../dc-environment.helper';

@Injectable({
  providedIn: 'root',
})
export class DcUserConfig extends FlUserConfig {
  private userService = inject(LiUserService);
  private authenticatedUserService = inject(LiAuthenticatedUserService);

  getUserPhotoUrl(photo: string): string {
    return DcEnvironmentHelper.getSpaceApiUrl() + '/users/photo-v2/' + photo;
  }

  getUserDetailRoute(): string {
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
    return this.authenticatedUserService.getCurrentUser();
  }
}
