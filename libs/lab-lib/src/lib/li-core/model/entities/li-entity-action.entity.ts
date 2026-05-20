/**
 * Models for the generic entity action plugin system.
 *
 * Mirrors the backend `entity_action_dto.py`. The action menu union matches the
 * front dynamic menu model `FlMenuDynamic`, except a button carries an
 * `action_name` (sent back to the backend) instead of an `onClick` callback.
 */

/** Lab entities that support the entity action plugin system. */
export type LiEntityActionType =
  | 'RESOURCE'
  | 'SCENARIO'
  | 'NOTE'
  | 'FORM'
  | 'SCENARIO_TEMPLATE'
  | 'NOTE_TEMPLATE'
  | 'FORM_TEMPLATE';

/** Matches the Angular ThemePalette used by the front dynamic menu. */
export type LiEntityActionColor = 'primary' | 'accent' | 'warn';

export interface LiEntityActionButton {
  type: 'button';
  /** Literal display text (no translation). */
  text: string;
  /**
   * Namespaced `<brick_name>.<plugin_name>.<action>`; sent back as-is to
   * `callEntityAction` to execute the action.
   */
  action_name: string;
  icon?: string;
  divider?: boolean;
  disabled?: boolean;
  color?: LiEntityActionColor;
  children?: LiEntityActionMenu[];
}

export interface LiEntityActionLink {
  type: 'link';
  text: string;
  link: string;
  icon?: string;
  divider?: boolean;
  color?: LiEntityActionColor;
}

export type LiEntityActionMenu = LiEntityActionButton | LiEntityActionLink;

/** Result returned after executing an action. */
export interface LiEntityActionResult {
  navigate_to?: string;
  navigate_query_params?: Record<string, string>;
  open_in_new_tab?: boolean;
  message?: string;
}
