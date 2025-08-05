import { inject, Injectable } from '@angular/core';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { TdTechnicalDocServiceConfig, TdTechnicalDocUrl, TdTypingName } from '@monorepo/technical-doc';

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
