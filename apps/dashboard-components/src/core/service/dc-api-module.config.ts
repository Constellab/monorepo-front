import { inject, Injectable } from '@angular/core';
import { DcMainState } from './dc-main.state';
import { LiApiServiceConfig } from '@monorepo/lab-lib/li-core';

/**
 * Class to configure the FlApiService
 */
@Injectable({
  providedIn: 'root',
})
export class DcApiServiceConfig extends LiApiServiceConfig {
  private mainState = inject(DcMainState);

  getApiUrl(): string {
    return this.mainState.getLabApiUrl();
  }
}
