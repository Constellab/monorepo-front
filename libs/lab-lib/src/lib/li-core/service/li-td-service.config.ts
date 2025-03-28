import { CoCommunityHelperService } from '@monorepo/community-lib';
import { Injectable, inject } from '@angular/core';
import { LiRouterService } from './li-router.service';
import { TdTechnicalDocServiceConfig, TdTechnicalDocUrl, TdTypingName } from '@monorepo/technical-doc';

/**
 * Class to configure the TdModule
 */
@Injectable({
  providedIn: 'root',
})
export class LiTdServiceConfig extends TdTechnicalDocServiceConfig {
  private communityHelper = inject(CoCommunityHelperService);

  constructor() {
    super();
  }

  getTechnicalDocUrl(parentVersion: string, typingName: TdTypingName): TdTechnicalDocUrl {
    return {
      url: LiRouterService.getTechnicalDocRoute(typingName.typingName),
      isAbsolute: false,
    };
  }

  getCommunityIconBaseApiUrl(): string {
    return this.communityHelper.getIconBaseApiUrl();
  }
}
