import { inject, Injectable } from '@angular/core';
import { LiApiServiceConfig } from '@monorepo/lab-lib/li-core';
import { LabEnvironmentHelper } from './lab-environment.helper';
import { LabEnvStore } from './lab-env.store';

/**
 * Class to configure the FlApiService
 */
@Injectable({
  providedIn: 'root',
})
export class LabApiServiceConfig extends LiApiServiceConfig {
  private labEnvStore = inject(LabEnvStore);

  getApiUrl(): string {
    if (this.labEnvStore.isDev()) {
      return LabEnvironmentHelper.getDevCoreApiUrl();
    }

    return LabEnvironmentHelper.getCoreApiUrl();
  }
}
