import { Injectable } from '@angular/core';
import { LiApiServiceConfig } from '@monorepo/lab-lib/li-core';
import { DcEnvironmentHelper } from '../dc-environment.helper';

/**
 * Class to configure the FlApiService
 */
@Injectable({
  providedIn: 'root',
})
export class DcApiServiceConfig extends LiApiServiceConfig {
  getApiUrl(): string {
    return DcEnvironmentHelper.getCoreApiUrl();
  }
}
