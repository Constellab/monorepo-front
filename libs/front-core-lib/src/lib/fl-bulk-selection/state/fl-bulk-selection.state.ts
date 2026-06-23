import { computed, EventEmitter, Injectable, signal } from '@angular/core';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';

import { FlBulkActionButton, FlBulkActionContext } from '../model/fl-bulk-selection.model';

/**
 * Shared state for bulk selection, injected in the directive, portal, and toggle.
 * Provided at directive level so each directive instance gets its own state.
 */
@Injectable()
export class FlBulkSelectionState {
  // --- Signals ---
  readonly selectionMode = signal(false);
  readonly selectedIds = signal<Set<string>>(new Set());
  readonly selectedCount = computed(() => this.selectedIds().size);
  readonly isEntireSearchSelected = signal(false);

  /** When false, the "Select entire search" mode (targeting the whole search result set) is disabled */
  readonly allowSelectEntireSearch = signal(false);

  /** When true, the bulk selection is disabled: selection mode cannot be entered, toggle is disabled */
  readonly disabled = signal(false);

  // --- Configuration (set by the directive) ---
  actions: FlBulkActionButton[] = [];
  datasource: FlDatasourcePaginated<any, any>;

  /** Emitted when a bulk action is triggered */
  readonly bulkAction = new EventEmitter<FlBulkActionContext>();

  // --- Public API ---

  setSelectionMode(active: boolean): void {
    // Never allow entering selection mode while disabled
    if (active && this.disabled()) return;
    if (active === this.selectionMode()) return;
    this.selectionMode.set(active);

    // Leaving selection mode clears any pending selection so it does not persist
    // the next time selection mode is enabled.
    if (!active) {
      this.clearSelection();
    }
  }

  toggleItem(id: string): void {
    const current = new Set(this.selectedIds());

    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }

    this.selectedIds.set(current);

    if (this.isEntireSearchSelected()) {
      this.isEntireSearchSelected.set(false);
    }
  }

  selectEntireSearch(): void {
    if (!this.allowSelectEntireSearch()) return;
    this.isEntireSearchSelected.set(true);
    this.selectedIds.set(new Set());
  }

  /** Selects every item currently loaded in the datasource (the visible rows) */
  selectAllVisible(): void {
    const items = this.datasource?.array ?? [];
    const ids = items.map((item) => item?.id).filter((id): id is string => !!id);

    this.isEntireSearchSelected.set(false);
    this.selectedIds.set(new Set(ids));
  }

  deselectAll(): void {
    this.clearSelection();
  }

  clearSelection(): void {
    this.isEntireSearchSelected.set(false);
    this.selectedIds.set(new Set());
  }

  triggerAction(action: FlBulkActionButton): void {
    const context = this.buildContext();
    action.onClick(context);
    this.bulkAction.emit(context);
  }

  buildContext(): FlBulkActionContext {
    return {
      selectedIds: Array.from(this.selectedIds()),
      isEntireSearchSelected: this.isEntireSearchSelected(),
    };
  }

  isItemSelected(id: string): boolean {
    return this.isEntireSearchSelected() || this.selectedIds().has(id);
  }
}
