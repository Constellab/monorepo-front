import { FlEntity } from '@monorepo/front-core-lib/fl-core';

export interface DcInputSearchResult extends FlEntity {
  display_text: string;
  object: any;
}

export class DcInputSearchObject implements FlEntity {
  id: string;

  constructor(public object: DcInputSearchResult) {
    this.id = object.id;
  }

  /**
   * Define the ToString so the auto-complete can show the correct text
   */
  toString(): string {
    return this.object.display_text;
  }
}

export interface DcInputSearchRequest {
  search_text: string;
  page: number;
  page_size: number;
}
