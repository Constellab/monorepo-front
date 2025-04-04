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
    throw new Error('Method not implemented.');
  }

  getCommunityFrontUrl(): string {
    throw new Error('Method not implemented.');
  }

  getCommunityAgentPageUrl(): string {
    throw new Error('Method not implemented.');
  }
}
