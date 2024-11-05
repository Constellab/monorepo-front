import { Injectable } from '@angular/core';
import { TdServiceConfig, TdTechnicalDocUrl, TdTypingName } from '@monorepo/technical-doc';
import { CoCommunityHelperService } from '@monorepo/community-lib';

/**
 * Class to configure the TdService
 */
@Injectable({
  providedIn: 'root',
})
export class CaTdServiceConfig extends TdServiceConfig {
  constructor(private communityHelper: CoCommunityHelperService) {
    super();
  }

  getTechnicalDocUrl(parentVersion: string, typingName: TdTypingName): TdTechnicalDocUrl {
    return {
      isAbsolute: true,
      url: this.communityHelper.getTechnicalDocUrl(typingName, parentVersion),
    };
  }

  getCommunityIconBaseApiUrl(): string {
    return this.communityHelper.getIconBaseApiUrl();
  }
}
