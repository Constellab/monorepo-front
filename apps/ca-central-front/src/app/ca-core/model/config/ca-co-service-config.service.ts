import {Injectable} from '@angular/core';
import {CoConfig} from '@monorepo/community-lib';
import {CaEnvironmentHelper} from '../../utils/ca-environment.helper';

@Injectable({
  providedIn: 'root'
})
export class CaCoServiceConfig extends CoConfig {

  getSpacePhotoUrl(filename: string): string {
    return CaEnvironmentHelper.getApiUrl() + '/spaces/photo/' + filename;
  }

  getCommunityApiUrl(): string {
    return CaEnvironmentHelper.getCommunityApiUrl();
  }

  getCommunityFrontUrl(): string {
    return CaEnvironmentHelper.getCommunityFrontUrl();
  }

}
