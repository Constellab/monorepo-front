import { Injectable } from '@angular/core';
import { DcAuthenticationInfo, DcLabInfo } from '../model/dc-main.class';

/**
 * Class to store the main state of the dc components
 */
@Injectable({
  providedIn: 'root',
})
export class DcMainState {
  private labInfo: DcLabInfo;

  public setLabInfo(labInfo: DcLabInfo): void {
    this.labInfo = labInfo;
  }

  public getLabInfo(): DcLabInfo {
    if (!this.labInfo) {
      throw new Error('Auth info not initialized');
    }
    return this.labInfo;
  }

  public getUserAuthenticationInfo(): DcAuthenticationInfo {
    const labInfo = this.getLabInfo();
    return labInfo.authentication_info;
  }

  public getLabApiUrl(): string {
    const labInfo = this.getLabInfo();
    return labInfo.lab_api_url;
  }
}
