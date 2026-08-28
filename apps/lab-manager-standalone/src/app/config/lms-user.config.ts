import { Injectable } from '@angular/core';
import { FlDatasourcePaginated, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlUser, FlUserConfig } from '@monorepo/front-core-lib/fl-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LmsUserConfig extends FlUserConfig {
  getUserPhotoUrl(): string {
    throw new Error(`Error: getUserPhotoUrl() not implemented in LmsUserConfig`);
  }

  getUserDetailRoute(): string {
    throw new Error(`Error: getUserDetailRoute() not implemented in LmsUserConfig`);
  }

  getUserById(): Observable<FlUser> {
    throw new Error(`Error: getUserById() not implemented in LmsUserConfig`);
  }

  getSearchByNamesDatasource(): FlDatasourcePaginated<FlUser, FlInputSearchFilter> {
    throw new Error(`Error: getSearchByNamesDatasource() not implemented in LmsUserConfig`);
  }

  getAuthenticatedUser(): FlUser {
    throw new Error(`Error: getAuthenticatedUser() not implemented in LmsUserConfig`);
  }
}
