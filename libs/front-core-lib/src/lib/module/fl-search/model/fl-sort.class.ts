/**
 * Direction for sorting element
 */
export type FlSortDirection = 'ASC' | 'DESC';

/**
 * Describe how to manage null data when sorting
 */
export type FlSortNullManagement = 'FIRST' | 'LAST';

/**
 * Criteria describing how to sort a set of data
 */
export interface FlSortCriteria {
  /**
   * Name of the column. Support '.' to go deeply in objects
   */
  key: string;

  /**
   * Sort direction
   */
  direction: FlSortDirection;

  /**
   * Null management
   */
  nullManagement: FlSortNullManagement;
}
