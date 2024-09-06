import {Component, Input} from '@angular/core';
import {FlDatasourcePaginated} from '../../../../model/datasource/fl-datasource-paginated.class';

/**
 * Layout component to wrap a table in an infinite scroll container with loader
 */
@Component({
  selector: 'fl-infinite-table-container',
  templateUrl: './fl-infinite-table-container.component.html',
  styleUrls: ['./fl-infinite-table-container.component.scss']
})
export class FlInfiniteTableContainerComponent {

  @Input({required: true}) datasource: FlDatasourcePaginated<any>;

  /**
   * Text translated show if the datasource is empty.
   * Set empty string to hide the text
   */
  @Input() textNoResult: string = 'no_result';

  /**
   * Text translated showed if the last page is loaded and there is no more result
   * Set empty string to hide the text
   */
  @Input() textNoMoreResult: string = 'no_more_result';

  loadMoreResults(): void {
    this.datasource.getNextPage();
  }
}
