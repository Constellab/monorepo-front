import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { Subscription } from 'rxjs';

import { FlBulkSelectionPortalComponent } from '../component/fl-bulk-selection-portal/fl-bulk-selection-portal.component';
import { FlBulkActionButton } from '../model/fl-bulk-selection.model';
import { FlBulkSelectionState } from '../state/fl-bulk-selection.state';

const SELECTED_CLASS = 'fl-bulk-selected';

@Directive({
  selector: '[flBulkSelection]',
  standalone: false,
  exportAs: 'flBulkSelection',
  providers: [FlBulkSelectionState],
})
export class FlBulkSelectionDirective implements AfterViewInit, OnDestroy {
  /** Datasource connected to the table — used to access current page items */
  readonly datasource = input.required<FlDatasourcePaginated<any, any>>({
    alias: 'flBulkSelectionDatasource',
  });

  /** Bulk action buttons shown in the portal */
  readonly actions = input.required<FlBulkActionButton[]>({ alias: 'flBulkSelectionActions' });

  /** CSS selector for row elements within the host (default: 'mat-row') */
  readonly rowSelector = input<string>('mat-row', { alias: 'flBulkSelectionRowSelector' });

  /** When false, disables the "Select entire search" mode that targets the whole search result set */
  readonly allowSelectEntireSearch = input<boolean>(true, {
    alias: 'flBulkSelectionAllowSelectEntireSearch',
  });

  readonly state = inject(FlBulkSelectionState);

  private portalService = inject(FlPortalService);
  private el = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private overlayRef: FlOverlayRef | null = null;
  private clickListener: ((event: MouseEvent) => void) | null = null;
  private datasourceSub: Subscription | null = null;

  constructor() {
    // Sync actions and datasource to state
    effect(() => {
      this.state.actions = this.actions();
    });

    effect(() => {
      this.state.allowSelectEntireSearch.set(this.allowSelectEntireSearch());
    });

    effect(() => {
      const ds = this.datasource();
      this.state.datasource = ds;
      if (this.state.selectionMode()) {
        this.unsubscribeFromDatasource();
        this.subscribeToDatasource();
      }
    });

    // React to selection mode changes (from toggle, portal close, etc.)
    effect(() => {
      const active = this.state.selectionMode();
      if (active) {
        this.openPortal();
        this.subscribeToDatasource();
      } else {
        this.closePortal();
        this.unsubscribeFromDatasource();
        this.removeAllSelectedClasses();
      }
    });
  }

  ngAfterViewInit(): void {
    this.attachClickListener();
  }

  ngOnDestroy(): void {
    this.detachClickListener();
    this.closePortal();
    this.unsubscribeFromDatasource();
  }

  // --- Click interception ---

  private attachClickListener(): void {
    this.clickListener = (event: MouseEvent) => this.onHostClick(event);
    this.el.nativeElement.addEventListener('click', this.clickListener, true);
  }

  private detachClickListener(): void {
    if (this.clickListener) {
      this.el.nativeElement.removeEventListener('click', this.clickListener, true);
      this.clickListener = null;
    }
  }

  private onHostClick(event: MouseEvent): void {
    if (!this.state.selectionMode()) return;

    const target = event.target as HTMLElement;
    const rowSelector = this.rowSelector();
    const row = target.closest(rowSelector);
    if (!row) return;

    event.stopImmediatePropagation();
    event.preventDefault();

    const rows = Array.from(this.el.nativeElement.querySelectorAll(rowSelector));
    const index = rows.indexOf(row);
    if (index < 0) return;

    const items = this.datasource().array;
    if (index >= items.length) return;

    const item = items[index];
    const id: string = item?.id;
    if (!id) return;

    this.state.toggleItem(id);
    this.applyClassOnRow(row as HTMLElement, id);
  }

  private applyClassOnRow(row: HTMLElement, id: string): void {
    if (this.state.isItemSelected(id)) {
      row.classList.add(SELECTED_CLASS);
    } else {
      row.classList.remove(SELECTED_CLASS);
    }
  }

  // --- CSS class management ---

  private refreshRowClasses(): void {
    const rows = this.el.nativeElement.querySelectorAll(this.rowSelector());
    const items = this.datasource().array;

    rows.forEach((row: HTMLElement, index: number) => {
      if (index >= items.length) return;
      const id = items[index]?.id;
      if (id && this.state.isItemSelected(id)) {
        row.classList.add(SELECTED_CLASS);
      } else {
        row.classList.remove(SELECTED_CLASS);
      }
    });
  }

  private removeAllSelectedClasses(): void {
    const rows = this.el.nativeElement.querySelectorAll(this.rowSelector());
    rows.forEach((row: HTMLElement) => row.classList.remove(SELECTED_CLASS));
  }

  // --- Datasource subscription ---

  private subscribeToDatasource(): void {
    this.datasourceSub = this.datasource()
      .connect()
      .subscribe(() => {
        setTimeout(() => this.refreshRowClasses(), 0);
      });
  }

  private unsubscribeFromDatasource(): void {
    this.datasourceSub?.unsubscribe();
    this.datasourceSub = null;
  }

  // --- Portal ---

  private openPortal(): void {
    if (this.overlayRef) return;

    const config = this.portalService.configureAbsolutePortal(
      { bottom: '24px', centerHorizontally: '0' },
      { panelClass: 'fl-bulk-selection-overlay' }
    );

    this.overlayRef = this.portalService.createPortal(
      FlBulkSelectionPortalComponent,
      config,
      {},
      this.viewContainerRef
    );

    this.overlayRef.detachments().subscribe(() => {
      this.overlayRef = null;
      this.state.setSelectionMode(false);
    });
  }

  private closePortal(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
