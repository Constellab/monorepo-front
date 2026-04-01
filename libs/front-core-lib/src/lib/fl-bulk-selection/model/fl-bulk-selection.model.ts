import { ThemePalette } from '@angular/material/core';
import { FlAdvancedSearchInput } from '@monorepo/front-core-lib/fl-search';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

/**
 * Button configuration for a bulk action — inspired by FlMenuDynamicButton
 */
export interface FlBulkActionButton {
  /** Unique identifier for the action (e.g. 'tag', 'moveToTrash') */
  type: string;

  /** Label displayed as tooltip */
  text: FlTranslatableText;

  /** Material icon name */
  icon: string;

  /** Callback called when the action button is clicked */
  onClick: (context: FlBulkActionContext) => void;

  /** If true, the button is disabled */
  disabled?: boolean;

  /** Material theme color (e.g. 'warn') */
  color?: ThemePalette;
}

/**
 * Context passed to the onClick callback of a bulk action button
 */
export interface FlBulkActionContext {
  /** IDs of manually selected items */
  selectedIds: string[];

  /** True if "Select all" mode is active (back will use searchInput to target all results) */
  isAllSelected: boolean;

  /** Current search filters — used by the back in "select all" mode */
  searchInput?: FlAdvancedSearchInput;
}
