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
  readonly isAllSelected = signal(false);

  // --- Configuration (set by the directive) ---
  actions: FlBulkActionButton[] = [];
  datasource: FlDatasourcePaginated<any, any>;

  /** Emitted when a bulk action is triggered */
  readonly bulkAction = new EventEmitter<FlBulkActionContext>();

  // --- Public API ---

  setSelectionMode(active: boolean): void {
    if (active === this.selectionMode()) return;
    this.selectionMode.set(active);
  }

  toggleItem(id: string): void {
    const current = new Set(this.selectedIds());

    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }

    this.selectedIds.set(current);

    if (this.isAllSelected()) {
      this.isAllSelected.set(false);
    }
  }

  selectAll(): void {
    this.isAllSelected.set(true);
    this.selectedIds.set(new Set());
  }

  deselectAll(): void {
    this.clearSelection();
  }

  clearSelection(): void {
    this.isAllSelected.set(false);
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
      isAllSelected: this.isAllSelected(),
      searchInput: this.datasource.buildRequestContext(),
    };
  }

  isItemSelected(id: string): boolean {
    return this.isAllSelected() || this.selectedIds().has(id);
  }
}
