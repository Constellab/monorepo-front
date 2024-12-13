import { Injectable } from '@angular/core';
import { FlDatasourcePaginated, FlInputSearchFilter, FlUser, FlUserConfig } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LmsUserConfig extends FlUserConfig {
  getUserPhotoUrl(): string {
    return null;
  }

  getUserDetailRoute(): string {
    return null;
  }

  getUserById(): Observable<FlUser> {
    return null;
  }

  getSearchByNamesDatasource(): FlDatasourcePaginated<FlUser, FlInputSearchFilter> {
    return null;
  }

  getAuthenticatedUser(): FlUser {
    return null;
  }
}
