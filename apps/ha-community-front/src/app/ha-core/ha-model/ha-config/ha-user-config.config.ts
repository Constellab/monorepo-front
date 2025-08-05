import { Injectable } from '@angular/core';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlUserConfig } from '@monorepo/front-core-lib/fl-user';
import { Observable } from 'rxjs';

import { HaUser } from '../ha-entities/ha-user';
import { HaEnvironmentHelper } from './ha-environment.helper';

@Injectable({
  providedIn: 'root',
})
export class HaUserConfig extends FlUserConfig {
  constructor() {
    super();
  }

  getUserPhotoUrl(photoUrl: string): string {
    return HaEnvironmentHelper.getConstellabApiUrl() + '/users/photo-v2/' + photoUrl;
  }

  getUserDetailRoute(): string {
    return null;
  }

  getUserById(): Observable<HaUser> {
    throw new Error('Method not implemented.');
  }

  getSearchByNamesDatasource(): FlDatasourcePaginated<HaUser, FlInputSearchFilter> {
    throw new Error('Method not implemented.');
  }

  getAuthenticatedUser(): HaUser {
    throw new Error('Method not implemented.');
  }
}
