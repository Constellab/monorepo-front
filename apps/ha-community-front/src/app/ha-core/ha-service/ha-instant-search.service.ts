import { inject,Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { IndexWidget, Widget } from 'instantsearch.js';
import InstantSearch from 'instantsearch.js/es/lib/InstantSearch';
import history from 'instantsearch.js/es/lib/routers/history';

import { HA_ENVIRONMENT } from '../../../environments/ha-environment';

@Injectable({
  providedIn: 'root',
})
export class HaInstantSearchService {
  public instantSearchInstance: InstantSearch;

  constructor() {
    const router = inject(Router);

    const searchClient = algoliasearch(
      HA_ENVIRONMENT.settings.algoliaAppId,
      HA_ENVIRONMENT.settings.algoliaSearchKey
    );
    this.instantSearchInstance = new InstantSearch({
      searchClient,
      indexName: HA_ENVIRONMENT.settings.algoliaIndexName,
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

  stop(): void {
    this.instantSearchInstance.dispose();
  }

  addWidgets(widgets: Array<IndexWidget | Widget>): void {
    this.instantSearchInstance.addWidgets(widgets);
  }

  removeWidgets(widgets: Array<IndexWidget | Widget>): void {
    this.instantSearchInstance.removeWidgets(widgets);
  }
}
