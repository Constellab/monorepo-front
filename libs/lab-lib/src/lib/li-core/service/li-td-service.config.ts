import { inject,Injectable } from '@angular/core';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { TdTechnicalDocServiceConfig, TdTechnicalDocUrl, TdTypingName } from '@monorepo/technical-doc';

import { LiRouterService } from './li-router.service';

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
