import { Injectable } from '@angular/core';
import { CoConfig } from '@monorepo/community-lib';
import { LmsEnvironmentHelper } from './lms-environmnet.helper';

@Injectable({
  providedIn: 'root',
})
export class LmsCoServiceConfig extends CoConfig {
  getSpacePhotoUrl(): string {
    return null;
  }

  getCommunityApiUrl(): string {
    return LmsEnvironmentHelper.getCommunityApiUrl();
  }

  getCommunityFrontUrl(): string {
    return LmsEnvironmentHelper.getCommunityFrontUrl();
  }
}
