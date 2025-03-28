import { FlApiServiceConfig } from '@monorepo/front-core-lib/fl-api';
import { ClCoreJsonConvert, ClDeserializationRef, ClPage } from '@monorepo/core-lib';

/**
 * Format of the paginated result
 */
interface LiPaginatedResponse {
  objects: any[];
  page: number;
  prev_page: number;
  next_page: number;
  last_page: number;
  total_number_of_items: number;
  total_number_of_pages: number;
  number_of_items_per_page: number;
  is_first_page: boolean;
  is_last_page: boolean;
  total_is_approximate?: boolean;

  // API CALL TO COMMUNITY
  currentPage?: number;
  pageSize?: number;
  totalElements?: number;
  last?: boolean;
}

/**
 * Class to configure the FlApiService
 */
export abstract class LiApiServiceConfig extends FlApiServiceConfig {
  abstract getApiUrl(): string;

  deserializePage(json: LiPaginatedResponse, classReference: ClDeserializationRef): ClPage<any> {
    // if the result is paginated (we supposed the json is type of ClPage)
    if (json.objects != null && json.objects instanceof Array) {
      return ClPage.fromInterface({
        first: json.page === 0,
        last: json.is_last_page ?? json.last,
        currentPage: json.page ?? json.currentPage,
        pageSize: json.number_of_items_per_page ?? json.pageSize,
        totalElements: json.total_number_of_items ?? json.totalElements,
        objects: ClCoreJsonConvert.deserialize(json.objects, classReference),
        totalIsApproximate: json.total_is_approximate,
      });
    } else {
      console.error('Response object not paginated');
      throw 'Response object not paginated';
    }
  }

  getHeaders(): Record<string, string> {
    return {};
  }

  get pageQueryParam(): string {
    return 'page';
  }

  get pageSizeQueryParam(): string {
    return 'number_of_items_per_page';
  }
}
