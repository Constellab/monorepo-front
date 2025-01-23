import { Injectable, NgZone, Renderer2, inject } from '@angular/core';
import { SpSpreadsheetState } from './sp-spreadsheet.state';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, startWith } from 'rxjs/operators';
import { ClHelpService, ClSubscriptionHandler } from '@monorepo/core-lib';
import { SpSpreadsheetSelectionState } from './sp-spreadsheet-selection.state';
import { SpSheetRow } from '../model/sp-sheet-headers.class';
import { SpSpreadsheetElementState } from './sp-spreadsheet-element.state';
import { SpSheetSingleSelection } from '../model/selection/sp-sheet-single-selection.class';
import { SpSpreadsheetPaginationState } from './sp-spreadsheet-pagination.state';
import { FlHtmlHelper } from '@monorepo/front-core-lib/fl-core';
import { FlRendererListenerObs } from '@monorepo/front-core-lib/fl-core';
import { flRxjsEnterNgZone } from '@monorepo/front-core-lib/fl-core';

export interface Interval {
  from: number;
  to: number;
}

/**
 * State to handle scroll of spreadsheet
 *
 * It is supposed to replace the CDK view port
 * IT is not ready yet
 */
@Injectable()
export class SpSpreadsheetScrollState {
  private renderer = inject(Renderer2);
  private state = inject(SpSpreadsheetState);
  private ngZone = inject(NgZone);
  private selectionState = inject(SpSpreadsheetSelectionState);
  private elementState = inject(SpSpreadsheetElementState);
  private paginationState = inject(SpSpreadsheetPaginationState);

  private rowsToDisplay$: BehaviorSubject<SpSheetRow[]> = new BehaviorSubject(null);

  // parent of the heightSimulator that scroll
  private tableContainer: HTMLElement;
  private verticalScroller: HTMLElement;
  // html element that simulates the complete spreadsheet height
  private heightSimulator: HTMLElement;
  private horizontalScroller: HTMLElement;

  // height of a cell in px
  private readonly cellHeight: number = 24;

  private wheelListener: () => void;
  // private wheelListener: () => void;
  private scrollListener: FlRendererListenerObs;
  private windowsResizeListener: FlRendererListenerObs;

  private subscriptions: ClSubscriptionHandler = new ClSubscriptionHandler();

  public init(
    tableContainer: HTMLElement,
    scroller: HTMLElement,
    heightSimulator: HTMLElement,
    horizontalScroller: HTMLElement
  ): void {
    this.tableContainer = tableContainer;
    this.verticalScroller = scroller;
    this.heightSimulator = heightSimulator;
    this.horizontalScroller = horizontalScroller;
    this.listenToScroll();

    // listen to the selection event to scroll to last selection rows if not visible
    this.selectionState
      .getSelection$()
      // don't scroll on empty or columns selection
      .pipe(filter((selection) => selection != null))
      .subscribe((selection) => this.scrollToCell(selection));
  }

  private listenToScroll(): void {
    this.clearSubscription();

    this.ngZone.runOutsideAngular(() => {
      // listen to wheel event on spreadsheet to trigger a scroll event on scroller
      this.wheelListener = this.renderer.listen(this.tableContainer, 'wheel', (event: WheelEvent) =>
        this.onWheelEvent(event)
      );

      this.scrollListener = new FlRendererListenerObs(this.renderer, this.verticalScroller, 'scroll');
      this.windowsResizeListener = new FlRendererListenerObs(this.renderer, 'window', 'resize');

      this.subscriptions.add(
        combineLatest([
          this.state.getCurrentSheetRows$(),
          this.scrollListener.onEvent$().pipe(startWith('')),
          this.windowsResizeListener.onEvent$().pipe(startWith(''), debounceTime(100)),
        ]).subscribe(([rows]) => this.refreshRowsToDisplay(rows))
      );
    });
  }

  private onWheelEvent(event: WheelEvent): void {
    // if we reached the bottom of the vertical scroller.
    // we load the next page and don't override the scroll logic
    // # Use round to
    if (
      Math.round(this.verticalScroller.scrollTop + 0.5) >=
        this.verticalScroller.scrollHeight - this.verticalScroller.offsetHeight &&
      event.deltaY > 0
    ) {
      this.paginationState.callNextPage();
      return;
    }

    // if we reached the top of the vertical scroller.
    // we load the previous page and don't override the scroll logic
    if (Math.trunc(this.verticalScroller.scrollTop) <= 0 && event.deltaY < 0) {
      this.paginationState.callPreviousPage();
      return;
    }

    ClHelpService.stopEventPropagation(event);
    this.triggerScrollY(event.deltaY);
    this.triggerScrollX(event.deltaX);
  }

  private triggerScrollY(y: number): void {
    this.verticalScroller.scrollBy(0, y);
  }

  private triggerScrollX(x: number): void {
    this.horizontalScroller.scrollBy(x, 0);
  }

  /**
   * Function that recalculate the scroller height and then return the row to display
   * @param rows
   * @private
   */
  private refreshRowsToDisplay(rows: SpSheetRow[]): void {
    // refresh scroller height
    this.recalculateScrollerHeight(rows.length);

    // calculate the fist and last row to display
    const scrollerHeight: number = this.verticalScroller.offsetHeight;
    const numberOfCell: number = Math.trunc(scrollerHeight / this.cellHeight);

    const scrollTop: number = this.verticalScroller.scrollTop;
    const firstCell: number = Math.trunc(scrollTop / this.cellHeight);
    const lastCell: number = firstCell + numberOfCell;
    const subRows: SpSheetRow[] = rows.slice(firstCell, lastCell);

    this.rowsToDisplay$.next(subRows);
  }

  /**
   * Reset the size of the height simulator for the scroll
   * @param rowCount
   * @private
   */
  private recalculateScrollerHeight(rowCount: number): void {
    // define the height of the spreadsheet
    // + 4 is to include to header row and the last row
    // and a little more to be sure the last line is always visible
    // because horizontal scroll bar can hide it
    this.renderer.setStyle(this.heightSimulator, 'height', this.cellHeight * (rowCount + 4) + 'px');
  }

  public getRowsToDisplay$(): Observable<SpSheetRow[]> {
    return this.rowsToDisplay$.asObservable().pipe(
      filter((cells) => cells != null),
      flRxjsEnterNgZone(this.ngZone)
    );
  }

  public scrollOnePage(direction: 'up' | 'down'): void {
    const factor: number = direction === 'up' ? -1 : 1;

    this.triggerScrollY(this.tableContainer.offsetHeight * factor);
  }

  public scrollToCell(selection: SpSheetSingleSelection): void {
    const columnId = selection.endColumn;
    const rowId = selection.endRow;

    if (selection.type === 'rows') {
      this.scrollToRow(rowId);
    } else if (selection.type === 'columns') {
      this.scrollToColumn(columnId);
    } else {
      this.scrollToColumn(columnId);
      this.scrollToRow(rowId);
    }
  }

  // scroll to the rowId if it's not visible
  public scrollToRow(rowId: number): void {
    // if the rows is already visible
    if (this.rowIsVisible(rowId)) {
      return;
    }

    const interval: Interval = this.getVisibleInterval();
    // if we have to scroll to the top
    if (rowId < interval.from) {
      this.triggerScrollY(-this.cellHeight * (interval.from - rowId));
    }
    // if we have to scroll to the bottom
    else {
      this.triggerScrollY(this.cellHeight * (rowId - interval.to));
    }
  }

  public scrollToColumn(columnId: number): void {
    const element = this.elementState.getColumnHeaderCellElement(columnId);
    if (element) {
      FlHtmlHelper.scrollBodyToElementIfNotVisible(element);
    }
  }

  public rowIsVisible(rowId: number): boolean {
    const interval: Interval = this.getVisibleInterval();

    // if the rows is already visible
    return rowId >= interval.from && rowId <= interval.to;
  }

  // clear the subscription
  private clearSubscription(): void {
    // clear previous listener if exists
    if (this.wheelListener) {
      this.wheelListener();
    }
    this.scrollListener?.complete();
    this.windowsResizeListener?.complete();
    this.subscriptions.unsubscribe();
  }

  public clear(): void {
    this.rowsToDisplay$?.complete();
    this.clearSubscription();
  }

  private get rowsToDisplay(): SpSheetRow[] {
    return this.rowsToDisplay$.value;
  }

  private getVisibleInterval(): Interval {
    const rows: SpSheetRow[] = this.rowsToDisplay;

    return {
      from: rows[0].index,
      // we consider the last row as not visible because it is often cut
      // so we do a - 1
      to: rows[rows.length - 1].index - 1,
    };
  }
}
