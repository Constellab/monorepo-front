import {Injectable} from '@angular/core';
import {CoConfig} from '@monorepo/community-lib';
import {HaEnvironmentHelper} from './ha-environment.helper';

@Injectable({
  providedIn: 'root'
})
export class HaCoServiceConfig extends CoConfig {

  getSpacePhotoUrl(filename: string): string {
    return HaEnvironmentHelper.getConstellabApiUrl() + '/spaces/photo/' + filename;
  }

  getCommunityFrontUrl(): string {
    return HaEnvironmentHelper.getCommunityFrontUrl();
  }

  getCommunityApiUrl(): string {
    return HaEnvironmentHelper.getApiUrl();
  }

}
