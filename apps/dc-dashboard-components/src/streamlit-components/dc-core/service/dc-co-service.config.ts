import { Injectable } from '@angular/core';
import { CoConfig } from '@monorepo/community-lib';
import { DcEnvironmentHelper } from '../dc-environment.helper';

@Injectable({
  providedIn: 'root',
})
export class DcCoServiceConfig extends CoConfig {
  getSpacePhotoUrl(filename: string): string {
    return DcEnvironmentHelper.getSpaceApiUrl() + '/spaces/photo/' + filename;
  }

  getCommunityApiUrl(): string {
    return DcEnvironmentHelper.getCommunityApiUrl();
  }

  getCommunityFrontUrl(): string {
    return DcEnvironmentHelper.getCommunityFrontUrl();
  }
}
