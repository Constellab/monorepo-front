import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SpSheetSingleSelection } from '../../model/selection/sp-sheet-single-selection.class';
import { SpSpreadsheetSelectionState } from '../../state/sp-spreadsheet-selection.state';
import { SpSpreadsheetSelectionListenerManagerService } from '../../state/sp-spreadsheet-selection-listener-manager.service';

/**
 * Component to listen to selection on spreadsheet
 */
@Component({
  selector: 'sp-spreadsheet-selection-listener',
  templateUrl: './sp-spreadsheet-selection-listener.component.html',
  styleUrls: ['./sp-spreadsheet-selection-listener.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SpSpreadsheetSelectionListenerComponent implements OnInit, OnDestroy {
  private selectionState = inject(SpSpreadsheetSelectionState);
  private groupManager = inject(SpSpreadsheetSelectionListenerManagerService);

  /**
   * Assign a group to this listener
   * When two components are in the same group they can't be activated at the same time. An activation
   * deactivate other components (like radio button)
   */
  @Input() group: string;

  @Output() selectionChange: EventEmitter<SpSheetSingleSelection | null> = new EventEmitter();

  selected: boolean = false;

  private subscription: Subscription | null;
  private groupSubscription: Subscription;

  private readonly id: symbol;

  constructor() {
    this.id = Symbol();
  }

  ngOnInit(): void {
    if (this.group) {
      this.subscribeToGroup();
    }
  }

  private subscribeToGroup(): void {
    this.groupSubscription = this.groupManager
      .subscribeToSelection(this.group)
      .pipe(
        // ignore the emission of this component instance
        // ignore if this component is not selected
        filter((id) => this.id !== id && this.selected)
      )
      .subscribe(() => this.disableSelection());
  }

  get color(): ThemePalette | null {
    return this.selected ? 'primary' : null;
  }

  toggleSelected(): void {
    if (!this.selected) {
      this.enableSelection();
    } else {
      this.disableSelection();
    }
  }

  private disableSelection(): void {
    this.selected = false;
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  private enableSelection(): void {
    this.selected = true;
    this.subscription = this.selectionState
      .getSelection$()
      .subscribe((selection) => this.onNewSelection(selection));

    // if the group exists, warn it that this selection is selected
    if (this.group) {
      this.groupManager.emitSelection(this.group, this.id);
    }
  }

  private onNewSelection(selection: SpSheetSingleSelection | null): void {
    this.selectionChange.next(selection);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.groupSubscription?.unsubscribe();
    if (this.group) {
      this.groupManager.unregisterListener(this.group);
    }
  }
}
