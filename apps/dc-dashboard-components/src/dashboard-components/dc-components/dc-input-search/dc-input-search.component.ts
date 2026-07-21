import { booleanAttribute, ChangeDetectionStrategy,Component, computed, effect, input, numberAttribute, output } from '@angular/core';
import { ClPage } from '@monorepo/core-lib';
import {
  FlExternalDatasourcePaginated,
  FlExternalPageRequest,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiApiServiceConfig, LiPaginatedResponse } from '@monorepo/lab-lib/li-core';

import { DcInputSearchObject, DcInputSearchRequest, DcInputSearchResult } from './dc-input-search.class';

@Component({
  selector: 'dc-input-search',
  imports: [FlInputSearchModule, FlUserModule],
  templateUrl: './dc-input-search.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dc-input-search.component.scss',
})
export class DcInputSearchComponent {
  /**
   * Input: the parent provides a ClPageI<any> page result
   * after handling the search request emitted by searchRequest output.
   * When this input changes, the datasource is updated to show the new results.
   */
  pageResult = input<LiPaginatedResponse<DcInputSearchResult>>();

  selectedItem = input<DcInputSearchResult>(null);

  placeholder = input('Select an item');

  required = input(false, { transform: booleanAttribute });

  minInputSearchLength = input(2, { transform: numberAttribute });

  initSearchOnFocus = input(false, { transform: booleanAttribute });

  pageSize = input(20, { transform: numberAttribute });

  disabled = input(false, { transform: booleanAttribute });

  /**
   * Output: emitted when the datasource needs a page of data.
   * The parent should handle this request and update the pageResult input.
   */
  searchRequest = output<DcInputSearchRequest>();

  /**
   * Output: emitted when the user selects an item from the results.
   */
  itemSelected = output<DcInputSearchResult | null>();

  selectedItemObject = computed(() => {
    const selected = this.selectedItem();
    return selected ? new DcInputSearchObject(selected) : null;
  });

  /**
   * The external paginated datasource.
   * When a page is requested, it emits through searchRequest output.
   * When pageResult input changes, the result is fed back via receivePage().
   */
  datasource = computed(
    () =>
      new FlExternalDatasourcePaginated<DcInputSearchObject, FlInputSearchFilter>(
        (request: FlExternalPageRequest<FlInputSearchFilter>) => {
          this.searchRequest.emit({
            search_text: request.data.filtersCriteria?.searchText ?? '',
            page: request.page,
            page_size: request.pageSize,
          });
        },
        this.pageSize()
      )
  );

  constructor() {
    // Wire pageResult input → datasource.receivePage()
    effect(() => {
      const result = this.pageResult();
      if (result) {
        const page = LiApiServiceConfig.buildClPageFromResponse(result);
        const mappedResult: ClPage<DcInputSearchObject> = page.map(
          (object) => new DcInputSearchObject(object)
        );
        console.log('Receiving page result:', mappedResult);
        this.datasource().receivePage(mappedResult);
      }
    });
  }

  onSelectItem(item: DcInputSearchObject): void {
    if (item) {
      this.itemSelected.emit(item.object);
    } else {
      this.itemSelected.emit(null);
    }
  }
}
