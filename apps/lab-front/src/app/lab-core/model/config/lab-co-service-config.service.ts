import { Injectable } from '@angular/core';
import { CoConfig } from '@monorepo/community-lib';
import { LabEnvironmentHelper } from '../../utils/lab-environment.helper';

@Injectable({
  providedIn: 'root',
})
export class LabCoServiceConfig extends CoConfig {
  getSpacePhotoUrl(filename: string): string {
    return LabEnvironmentHelper.getSpaceApiUrl() + '/spaces/photo/' + filename;
  }

  getCommunityApiUrl(): string {
    return LabEnvironmentHelper.getCommunityApiUrl();
  }

  getCommunityFrontUrl(): string {
    return LabEnvironmentHelper.getCommunityFrontUrl();
  }

  getCommunityAgentPageUrl(agentId: string): string {
    return LabEnvironmentHelper.getCommunityFrontUrl() + '/agents/' + agentId;
  }
}
