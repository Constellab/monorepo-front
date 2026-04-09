import { Injectable } from '@angular/core';
import { ClCoreJsonConvert, ClDeserializationRef, ClPage } from '@monorepo/core-lib';
import { FlApiServiceConfig } from '@monorepo/front-core-lib/fl-api';

import { HaEnvironmentHelper } from './ha-environment.helper';

/**
 * App-specific configuration for FlApiService (from front-core-lib).
 *
 * FlApiService is the shared HTTP wrapper used by all entity services. This config class
 * tells it how to build API URLs and how to deserialize paginated responses.
 * Provided via FlApiModule.forRoot(HaApiServiceConfig, HaApiErrorService) in ha-app.config.ts.
 */
@Injectable({
  providedIn: 'root',
})
export class HaApiServiceConfig extends FlApiServiceConfig {
  deserializePage(json: any, classReference: ClDeserializationRef): ClPage<any> {
    // if the result is paginated (we supposed the json is type of ClPage)
    if (json.objects != null && json.objects instanceof Array) {
      json.objects = ClCoreJsonConvert.deserialize(json.objects, classReference);
      return ClPage.fromInterface(json);
    } else {
      throw 'Response object not paginated';
    }
  }

  getApiUrl(): string {
    return HaEnvironmentHelper.getApiUrl() + '/';
  }

  getHeaders(): Record<string, string> {
    return undefined;
  }

  get pageQueryParam(): string {
    return 'page';
  }

  get pageSizeQueryParam(): string {
    return 'size';
  }
}
