import { Injectable, inject } from '@angular/core';
import { TdTechnicalDocServiceConfig, TdTechnicalDocUrl, TdTypingName } from '@monorepo/technical-doc';
import { LabRouterService } from './lab-router.service';
import { CoCommunityHelperService } from '@monorepo/community-lib';

/**
 * Class to configure the TdModule
 */
@Injectable({
  providedIn: 'root',
})
export class LabTdServiceConfig extends TdTechnicalDocServiceConfig {
  private communityHelper = inject(CoCommunityHelperService);

  constructor() {
    super();
  }

  getTechnicalDocUrl(parentVersion: string, typingName: TdTypingName): TdTechnicalDocUrl {
    return {
      url: LabRouterService.getTechnicalDocRoute(typingName.typingName),
      isAbsolute: false,
    };
  }

  getCommunityIconBaseApiUrl(): string {
    return this.communityHelper.getIconBaseApiUrl();
  }
}
