import { Injectable } from '@angular/core';
import { ClCoreJsonConvert, ClDeserializationRef, ClPage, ClPageI } from '@monorepo/core-lib';
import { FlApiServiceConfig } from '@monorepo/front-core-lib/fl-api';

import { LmsEnvironmentHelper } from './lms-environmnet.helper';

/**
 * Class to configure the FlApiService
 */
@Injectable({
  providedIn: 'root',
})
export class LmsApiServiceConfig extends FlApiServiceConfig {
  deserializePage(json: any, classReference: ClDeserializationRef): ClPage<any> {
    // if the result is paginated (we supposed the json is type of ClPage)
    if (json.objects != null && json.objects instanceof Array) {
      json.objects = ClCoreJsonConvert.deserialize(json.objects, classReference);
      return ClPage.fromInterface(json as ClPageI<any>);
    } else {
      console.error('Response object not paginated');
      throw 'Response object not paginated';
    }
  }

  getApiUrl(): string {
    return LmsEnvironmentHelper.getApiUrl() + '/';
  }

  getHeaders(): Record<string, string> {
    return {};
  }

  get pageQueryParam(): string {
    return 'page';
  }

  get pageSizeQueryParam(): string {
    return 'size';
  }
}
