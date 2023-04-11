import {Injectable} from '@angular/core';
import {FlDatasourcePaginated, FlUserConfig} from '@monorepo/front-core-lib';
import {HaConstellabHelper} from './ha-constellab.helper';
import {HaUser} from '../ha-entities/ha-user';
import {Observable} from 'rxjs';
import {HaAuthenticatedUserService} from '../../ha-service/ha-authenticated-user.service';

@Injectable({
  providedIn: 'root'
})
export class HaUserConfig extends FlUserConfig {

  constructor(private userService: HaAuthenticatedUserService) {
    super();
  }

  getUserPhotoUrl(userId: string): string {
    return this.userService.getUserPhotoUrl(userId);
  }

  getUserDetailRoute(userId: string): string {
    return null;
  }

  getUserById(userId: string): Observable<HaUser> {
    throw new Error('Method not implemented.');
  }

  getSearchByNamesDatasource(): FlDatasourcePaginated<HaUser> {
    throw new Error('Method not implemented.');
  }

  getAuthenticatedUser(): HaUser {
    throw new Error('Method not implemented.');
  }
}
