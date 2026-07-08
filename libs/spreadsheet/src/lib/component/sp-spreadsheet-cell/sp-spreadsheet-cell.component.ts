import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlKeyboardHelper } from '@monorepo/front-core-lib/fl-core';
import { FlKeyboardKey } from '@monorepo/front-core-lib/fl-core';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalConnectedPosition } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import { SpCellsRange } from '../../model/selection/sp-cells-range.class';
import {
  SpCellWithCoord,
  SpSheetSingleSelection,
} from '../../model/selection/sp-sheet-single-selection.class';
import {
  SP_COLUMN_ID_ATTRIBUTE_NAME,
  SP_ROW_ID_ATTRIBUTE_NAME,
  SpCell,
  SpCellEditChange,
} from '../../model/sp-cell.class';
import { SpCellCoord } from '../../model/sp-cell-coord.class';
import { SpSpreadsheetState } from '../../state/sp-spreadsheet.state';
import { SpSpreadsheetActions } from '../../state/sp-spreadsheet-actions.state';
import { SpSpreadsheetSelectionState } from '../../state/sp-spreadsheet-selection.state';
import { SpSpreadsheetCellInfoComponent } from '../sp-spreadsheet-cell-info/sp-spreadsheet-cell-info.component';

@Component({
  selector: 'sp-spreadsheet-cell',
  templateUrl: './sp-spreadsheet-cell.component.html',
  styleUrls: ['./sp-spreadsheet-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SpSpreadsheetCellComponent implements OnInit, OnDestroy {
  private renderer = inject(Renderer2);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private state = inject(SpSpreadsheetState);
  private selectionState = inject(SpSpreadsheetSelectionState);
  private actionState = inject(SpSpreadsheetActions);
  private cdr = inject(ChangeDetectorRef);
  private portalService = inject(FlPortalService);

  // use to check change detection
  // todo to remove
  private static id: number = 0;
  private id: number;

  @Input() cell: SpCell;

  // theses attributes are used to retrieve the cell coords from html element
  @HostBinding('attr.' + SP_COLUMN_ID_ATTRIBUTE_NAME)
  @Input()
  column: number;

  @HostBinding('attr.' + SP_ROW_ID_ATTRIBUTE_NAME)
  @Input()
  row: number;

  @ViewChild('input') input: ElementRef<HTMLElement>;

  cellValue: any;
  inputValue: any;
  cellValueIsObject: boolean;

  edit: boolean = false;

  private selected: boolean = false;

  private selectedBorderClasses: string[] = [];

  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  private overlayRef: FlOverlayRef;

  constructor() {
    this.id = SpSpreadsheetCellComponent.id++;
  }

  ngOnInit(): void {
    this.cellValueIsObject = this.cell.valueIsObject();
    this.subscribeToValue();
    this.subscribeToEdit();
    this.subscribeToSelection();
  }

  /////////////////////////////// VALUE ///////////////////////////////

  private subscribeToValue(): void {
    this.subscription.add(this.cell.value$.subscribe((value) => this.onNewValue(value)));
  }

  private onNewValue(value: any): void {
    this.cellValue = value;
    // use detect change because this code is run outside angular zone
    this.cdr.detectChanges();
  }

  /////////////////////////////// SELECTION ///////////////////////////////

  private subscribeToSelection(): void {
    this.subscription.add(
      this.selectionState.getSelection$().subscribe((selection) => this.onSelectionChange(selection))
    );
  }

  private onSelectionChange(selection: SpSheetSingleSelection): void {
    // check if the current cell is selected
    if (selection && selection.coordIsSelected({ row: this.row, column: this.column })) {
      this.selectCell(selection.getRange());
    } else {
      this.unSelectCell();
    }
  }

  private selectCell(range: SpCellsRange): void {
    if (!this.selected) {
      this.renderer.addClass(this.elementRef.nativeElement, 'cell-selected');
      this.selected = true;
    }
    // remove previous border classes
    this.removeClasses(this.selectedBorderClasses);

    // add new border classes
    this.selectedBorderClasses = this.getBorderClassesForSelectedRange(range);
    this.addClasses(this.selectedBorderClasses);

    this.cdr.markForCheck();
  }

  private unSelectCell(): void {
    if (this.selected) {
      this.selected = false;
      this.renderer.removeClass(this.elementRef.nativeElement, 'cell-selected');

      // clear border classes
      this.removeClasses(this.selectedBorderClasses);
      this.selectedBorderClasses = [];
      this.cdr.detectChanges();
    }
  }

  /////////////////////////////// EDIT ///////////////////////////////

  private subscribeToEdit(): void {
    this.subscription.add(this.cell.edit$.subscribe((edit) => this.onEditChange(edit)));
  }

  private onEditChange(editEvent: SpCellEditChange): void {
    if (editEvent.edit) {
      this.enableEditMode(editEvent.value);
    } else {
      this.disableEditMode();
    }
    // use detect change because this code is run outside angular zone
    this.cdr.detectChanges();
  }

  private enableEditMode(value?: string): void {
    if (!this.edit) {
      const cellValue: any = this.cell.value;
      this.edit = true;

      if (value != null && (typeof this.cell.value === 'number' || typeof this.cell.value === 'string')) {
        this.inputValue = cellValue + value;
      } else {
        this.inputValue = cellValue;
      }

      setTimeout(() => {
        this.focusInput();
      });
    }
  }

  private disableEditMode(): void {
    this.edit = false;
  }

  onInputKeyup(event: KeyboardEvent): void {
    if (event.key === FlKeyboardKey.ESCAPE) {
      this.cancelEditMode();
    } else if (event.key === FlKeyboardKey.ENTER || FlKeyboardHelper.keyIsArrow(event.key)) {
      this.saveValueAndDisableEdit();
    }
  }

  cancelEditMode(): void {
    this.cell.setEdit(false);
  }

  // save the input value to the cell and close edit mode
  saveValueAndDisableEdit(): void {
    this.actionState.updateCellValue(this.inputValue, this.coord);
    this.cell.setEdit(false);
  }

  private focusInput(): void {
    this.input?.nativeElement.focus();
  }

  get cellWithCoord(): SpCellWithCoord {
    return {
      cell: this.cell,
      coord: this.coord,
    };
  }

  get coord(): SpCellCoord {
    return {
      column: this.column,
      row: this.row,
    };
  }

  // return the list of border classes to apply based on selected range
  private getBorderClassesForSelectedRange(range: SpCellsRange): string[] {
    const classes: string[] = [];
    if (range.from.row === this.row) {
      classes.push('selected-border-top');
    }
    if (range.to.row === this.row) {
      classes.push('selected-border-bottom');
    }
    if (range.from.column === this.column) {
      classes.push('selected-border-left');
    }
    if (range.to.column === this.column) {
      classes.push('selected-border-right');
    }

    return classes;
  }

  private addClasses(classes: string[]): void {
    for (const className of classes) {
      this.renderer.addClass(this.elementRef.nativeElement, className);
    }
  }

  private removeClasses(classes: string[]): void {
    for (const className of classes) {
      this.renderer.removeClass(this.elementRef.nativeElement, className);
    }
  }

  openCellValueIsNewSheet(): void {
    this.state.openCellInNewSheet(this.cell);
  }

  /////////////////////////////// CELL INFO ///////////////////////////////
  openInfoPortal(): void {
    const positions: FlPortalConnectedPosition[] = ['right', 'left', 'top', 'bottom'];

    const config = this.portalService.configureRelativePortal(this.elementRef.nativeElement, positions, {
      disposeOnNavigation: true,
      disposeOnOutsideClick: true,
    });

    this.overlayRef = this.portalService.createPortal(
      SpSpreadsheetCellInfoComponent,
      config,
      this.cellWithCoord
    );
  }

  closePortal(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
