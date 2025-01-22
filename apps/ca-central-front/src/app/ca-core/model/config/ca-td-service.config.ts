import { Injectable, inject } from '@angular/core';
import { TdTechnicalDocServiceConfig, TdTechnicalDocUrl, TdTypingName } from '@monorepo/technical-doc';
import { CoCommunityHelperService } from '@monorepo/community-lib';

/**
 * Class to configure the TdService
 */
@Injectable({
  providedIn: 'root',
})
export class CaTdServiceConfig extends TdTechnicalDocServiceConfig {
  private communityHelper = inject(CoCommunityHelperService);

  constructor() {
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
