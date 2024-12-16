import { Injectable } from '@angular/core';
import InstantSearch from 'instantsearch.js/es/lib/InstantSearch';
import history from 'instantsearch.js/es/lib/routers/history';
import { Router } from '@angular/router';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { IndexWidget, Widget } from 'instantsearch.js';

const searchClient = algoliasearch('S233I3C24Z', '8fd4e2048efc6363ff0dca169b6522af');

@Injectable({
  providedIn: 'root',
})
export class HaInstantSearchService {
  public instantSearchInstance: InstantSearch;

  constructor(router: Router) {
    this.instantSearchInstance = new InstantSearch({
      searchClient,
      indexName: 'Community Preprod',
      future: { preserveSharedStateOnUnmount: true },
      routing: {
        router: history({
          getLocation: () => {
            if (typeof window === 'undefined') {
              // no other way to get this in constructor
              return new URL(
                router['location']._locationStrategy._platformLocation.href
              ) as unknown as Location;
            }
            return window.location;
          },
          cleanUrlOnDispose: false,
        }),
      },
    });
  }

  start(): void {
    this.instantSearchInstance.start();
  }

  addWidgets(widgets: Array<IndexWidget | Widget>): void {
    this.instantSearchInstance.addWidgets(widgets);
  }

  removeWidgets(widgets: Array<IndexWidget | Widget>): void {
    this.instantSearchInstance.removeWidgets(widgets);
  }
}
