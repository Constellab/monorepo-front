import {Component, Input, OnInit} from '@angular/core';
import {FlDatasourcePaginated} from '../../../../model/datasource/fl-datasource-paginated.class';

/**
 * Layout component to wrap a table in an infinite scroll container with loader
 */
@Component({
  selector: 'fl-infinite-table-container',
  templateUrl: './fl-infinite-table-container.component.html',
  styleUrls: ['./fl-infinite-table-container.component.scss']
})
export class FlInfiniteTableContainerComponent implements OnInit {

  @Input() datasource: FlDatasourcePaginated<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

  loadMoreResults(): void {
    this.datasource.getNextPage();
  }
}
