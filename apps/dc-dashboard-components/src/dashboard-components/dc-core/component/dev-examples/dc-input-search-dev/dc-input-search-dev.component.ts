import { Component, signal } from '@angular/core';
import { LiPaginatedResponse } from '@monorepo/lab-lib/li-core';

import {
  DcInputSearchRequest,
  DcInputSearchResult,
} from '../../../../dc-components/dc-input-search/dc-input-search.class';
import { DcInputSearchComponent } from '../../../../dc-components/dc-input-search/dc-input-search.component';

interface FakeItem extends DcInputSearchResult {
  label: string;
  category: string;
}

const FAKE_ITEMS: FakeItem[] = [
  { id: '1', label: 'Apple', category: 'fruit', display_text: 'Apple', object: null },
  { id: '2', label: 'Banana', category: 'fruit', display_text: 'Banana', object: null },
  { id: '3', label: 'Carrot', category: 'vegetable', display_text: 'Carrot', object: null },
  { id: '4', label: 'Date', category: 'fruit', display_text: 'Date', object: null },
  { id: '5', label: 'Eggplant', category: 'vegetable', display_text: 'Eggplant', object: null },
  { id: '6', label: 'Fig', category: 'fruit', display_text: 'Fig', object: null },
  { id: '7', label: 'Grape', category: 'fruit', display_text: 'Grape', object: null },
  { id: '8', label: 'Honeydew', category: 'fruit', display_text: 'Honeydew', object: null },
  { id: '9', label: 'Iceberg Lettuce', category: 'vegetable', display_text: 'Iceberg Lettuce', object: null },
  { id: '10', label: 'Jackfruit', category: 'fruit', display_text: 'Jackfruit', object: null },
  { id: '11', label: 'Kale', category: 'vegetable', display_text: 'Kale', object: null },
  { id: '12', label: 'Lemon', category: 'fruit', display_text: 'Lemon', object: null },
  { id: '13', label: 'Mango', category: 'fruit', display_text: 'Mango', object: null },
  { id: '14', label: 'Nectarine', category: 'fruit', display_text: 'Nectarine', object: null },
  { id: '15', label: 'Onion', category: 'vegetable', display_text: 'Onion', object: null },
];

@Component({
  selector: 'dc-input-search-dev',
  imports: [DcInputSearchComponent],
  templateUrl: './dc-input-search-dev.component.html',
  styleUrl: '../dc-dev-examples.scss',
})
export class DcInputSearchDevComponent {
  pageResult = signal<LiPaginatedResponse<any>>(undefined);

  selectedItem = signal<any>(FAKE_ITEMS[0]);

  onSearchRequest(request: DcInputSearchRequest): void {
    console.log('Search ', request);
    const searchText = request.search_text.toLowerCase();

    const filtered = searchText
      ? FAKE_ITEMS.filter((item) => item.label.toLowerCase().includes(searchText))
      : FAKE_ITEMS;

    const start = request.page * request.page_size;
    const pageItems = filtered.slice(start, start + request.page_size);

    this.pageResult.set({
      objects: pageItems,
      page: request.page,
      is_last_page: start + request.page_size >= filtered.length,
      number_of_items_per_page: request.page_size,
      total_number_of_items: filtered.length,
    });
  }

  onItemSelected(item: any): void {
    console.log('Item selected:', item);
  }
}
