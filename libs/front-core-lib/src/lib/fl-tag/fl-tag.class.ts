import { ClPageI } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

export type FlTagValue = string | boolean | number | DateTime;

/**
 * Simple tag with key value
 */
export interface FlTag {
  key: string;
  label?: string;
  value?: FlTagValue;
  isCommunityTagKey?: boolean;
}

export class FlTagDatasource<T extends FlTag = FlTag> extends FlArrayObs<T> {
  protected equals(a: T, b: T): boolean {
    return a.key === b.key && a.value === b.value;
  }
}

/**
 * Simple tag object with a color
 */
export interface FlTagWithColor {
  key: string;
  value: FlTagValue;
  color: string;
}

/**
 * Event triggered when a tag is selected
 */
export interface FlTagSelectedEvent {
  tag: FlTag;
  event: MouseEvent;
}

/**
 * Used for search
 */
export interface FlTagKeySearchResult<T = any> {
  type: 'key';
  content: string;
  // contains the DB entity with full object
  entity?: T;
}

/**
 * Used for search
 */
export interface FlTagValueSearchResult<T = any> {
  type: 'value';
  content: FlTagValue;
  // contains the DB entity with full object
  entity?: T;
}

/**
 * Used for search
 */
export type FlTagSearchResult<T = any> = FlTagKeySearchResult<T> | FlTagValueSearchResult<T>;

export interface FlTagSearchFilter {
  key: string;
  value?: string;
}

export abstract class FlTagService {
  public abstract searchTag(
    filters: Partial<FlTagSearchFilter>,
    page: number,
    pageSize: number
  ): Observable<ClPageI<FlTagSearchResult>>;

  public abstract searchCommunityTag(
    filters: Partial<FlTagSearchFilter>,
    page: number,
    pageSize: number
  ): Observable<ClPageI<FlTagSearchResult>>;
}
