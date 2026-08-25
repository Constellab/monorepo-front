import { FlEntity } from '@monorepo/front-core-lib/fl-core';

/**
 * Interface representing a saved search
 *
 * Does not extend FlEntity directly because the predefined searches carry a null id.
 */
export interface FlSavedSearch extends Omit<FlEntity, 'id'> {
  // null for the predefined searches, which are not persisted
  id: string | null;

  // name of the search form
  searchName: string;

  // label provided by the user
  label: string;

  // description provided by the user
  description?: string;

  // color provided by the user
  color: string;

  // if true, the search is triggered automatically
  default: boolean;

  // version of the search, must match the version of the form
  version: number;

  // object containing all the filters
  filtersCriteria: Record<string, any>;
}
