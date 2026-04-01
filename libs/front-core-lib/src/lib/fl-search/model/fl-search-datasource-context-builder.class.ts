import { FlDatasourceContextBuilder, FlDatasourceGetPageData } from '@monorepo/front-core-lib/fl-core';

import { FlAdvancedSearchInput } from './fl-search.class';
import {
  FlSearchConverter,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from './fl-search-converter.class';

/**
 * Abstract builder that converts datasource page data to FlAdvancedSearchInput
 * using filter and sort converters provided by subclasses.
 */
export abstract class FlSearchDatasourceContextBuilder<T = any> extends FlDatasourceContextBuilder {
  abstract getFilterConverter(): FlSearchFilterCriteriaConverter<T>;
  abstract getSortConverter(): FlSearchSortCriteriaConverter;

  build(data: FlDatasourceGetPageData): FlAdvancedSearchInput {
    return FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      this.getFilterConverter(),
      this.getSortConverter()
    );
  }
}
