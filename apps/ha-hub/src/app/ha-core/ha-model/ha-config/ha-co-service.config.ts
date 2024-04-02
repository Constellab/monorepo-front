import {Injectable} from '@angular/core';
import {CoServiceConfig} from '@monorepo/community-lib';
import {HaEnvironmentHelper} from './ha-environment.helper';

@Injectable({
  providedIn: 'root'
})
export class HaCoServiceConfig extends CoServiceConfig {

  getSpacePhotoUrl(filename: string): string {
    return HaEnvironmentHelper.getConstellabApiUrl() + '/spaces/photo/' + filename;
  }

}
