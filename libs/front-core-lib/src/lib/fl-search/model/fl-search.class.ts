/**
 * Supported operation for the search criteria to search in a column
 */
import { FlSortCriteria } from '@monorepo/front-core-lib/fl-core';

export type FlSearchOperator = FlSearchOperatorSingle | FlSearchOperatorMultiple;

/**
 * Operator that supports single values
 */
export type FlSearchOperatorSingle =
  | 'EQ'
  | 'NEQ'
  | 'LT'
  | 'LE'
  | 'GT'
  | 'GE'
  | 'CONTAINS'
  | 'NULL'
  | 'NOT_NULL'
  | 'START_WITH'
  | 'END_WITH'
  | 'MATCH';

/**
 * Operations that supports multiple values
 */
export type FlSearchOperatorMultiple = 'IN' | 'NOT_IN' | 'BETWEEN';

/**
 * Criteria for an advance search. Its tell which column to filter with which operation (EQ, LE...)
 * and the value to check
 */
export type FlSearchCriteria<COLUMN = any> =
  | FlSearchCriteriaSingle<COLUMN>
  | FlSearchCriteriaMultiple<COLUMN>;

interface FlSearchCriteriaSingle<COLUMN = any> {
  /**
   * Name of the column. Support '.' to go deeply in objects
   */
  key: string;

  /**
   * Operation to filters the data
   */
  operator: FlSearchOperatorSingle;

  /**
   * Value or values used to compare
   */
  value: COLUMN;
}

interface FlSearchCriteriaMultiple<COLUMN = any> {
  /**
   * Name of the column. Support '.' to go deeply in objects
   */
  key: string;

  /**
   * Operation to filters the data
   */
  operator: FlSearchOperatorMultiple;

  /**
   * Value or values used to compare
   */
  value: COLUMN[];
}

/**
 * Object format for advanced search api calls
 */
export interface FlAdvancedSearchInput {
  filtersCriteria: FlSearchCriteria[];
  sortsCriteria: FlSortCriteria[] | null;
}
