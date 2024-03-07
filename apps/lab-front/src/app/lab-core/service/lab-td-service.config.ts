import {Injectable} from '@angular/core';
import {TdServiceConfig, TdTechnicalDocUrl, TdTypingName} from '@monorepo/technical-doc';
import {LabRouterService} from './lab-router.service';
import {LabCommunityHelper} from '../utils/lab-community.helper';

/**
 * Class to configure the TdModule
 */
@Injectable({
  providedIn: 'root'
})
export class LabTdServiceConfig extends TdServiceConfig {
  getTechnicalDocUrl(parentVersion: string, typingName: TdTypingName): TdTechnicalDocUrl {
    return {
      url: LabRouterService.getTechnicalDocRoute(typingName.typingName),
      isAbsolute: false
    };
  }

  getCommunityIconBaseApiUrl(): string {
    return LabCommunityHelper.getIconBaseApiUrl();
  }


}
