import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChChartPortalService } from '@monorepo/chart';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SpSheetChartConfig } from '../../model/chart/sp-sheet-chart-config.class';
import { SpSheetHeader, SpSheetRow } from '../../model/sp-sheet-headers.class';
import { SpSpreadsheet } from '../../model/sp-spreadsheet.class';
import { SpSpreadsheetPageLoader } from '../../model/sp-spreadsheet-page.class';
import { SpSpreadsheetState } from '../../state/sp-spreadsheet.state';
import { SpSpreadsheetActionStore } from '../../state/sp-spreadsheet-action.store';
import { SpSpreadsheetActions } from '../../state/sp-spreadsheet-actions.state';
import { SpSpreadsheetChartState } from '../../state/sp-spreadsheet-chart.state';
import { SpSpreadsheetClipboardState } from '../../state/sp-spreadsheet-clipboard.state';
import { SpSpreadsheetContextMenu } from '../../state/sp-spreadsheet-context-menu.state';
import { SpSpreadsheetElementState } from '../../state/sp-spreadsheet-element.state';
import { SpSpreadsheetKeyboardManagerState } from '../../state/sp-spreadsheet-keyboard-manager.state';
import { SpSpreadsheetMouseManagerState } from '../../state/sp-spreadsheet-mouse-manager.state';
import { SpSpreadsheetPaginationState } from '../../state/sp-spreadsheet-pagination.state';
import { SpSpreadsheetScrollState } from '../../state/sp-spreadsheet-scroll.state';
import { SpSpreadsheetSelectionState } from '../../state/sp-spreadsheet-selection.state';

@Component({
  selector: 'sp-spreadsheet',
  templateUrl: './sp-spreadsheet.component.html',
  styleUrls: ['./sp-spreadsheet.component.scss'],
  providers: [
    SpSpreadsheetState,
    SpSpreadsheetElementState,
    SpSpreadsheetSelectionState,
    SpSpreadsheetContextMenu,
    SpSpreadsheetKeyboardManagerState,
    SpSpreadsheetMouseManagerState,
    SpSpreadsheetClipboardState,
    SpSpreadsheetActionStore,
    SpSpreadsheetActions,
    SpSpreadsheetChartState,
    SpSpreadsheetScrollState,
    SpSpreadsheetPaginationState,
    FlPortalService, // providers to access the state in portal
    ChChartPortalService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SpSpreadsheetComponent implements OnInit, OnDestroy {
  private state = inject(SpSpreadsheetState);
  private elementState = inject(SpSpreadsheetElementState);
  private selectionState = inject(SpSpreadsheetSelectionState);
  private keyboardState = inject(SpSpreadsheetKeyboardManagerState);
  private mouseState = inject(SpSpreadsheetMouseManagerState);
  private scrollState = inject(SpSpreadsheetScrollState);
  private paginationState = inject(SpSpreadsheetPaginationState);

  @Input() spreadsheet: SpSpreadsheet;

  @Input() readOnly: boolean = false;

  @Input() chartConfigs: SpSheetChartConfig[];

  @Input() pagination: SpSpreadsheetPageLoader;

  @ViewChild('tableContainer', { static: true }) tableContainer: ElementRef<HTMLElement>;
  @ViewChild('horizontalScroller', { static: true }) horizontalScroller: ElementRef<HTMLElement>;
  @ViewChild('scroller', { static: true }) scroller: ElementRef<HTMLElement>;
  @ViewChild('heightSimulator', { static: true }) heightSimulator: ElementRef<HTMLElement>;

  columns$: Observable<SpSheetHeader[]>;
  rows$: Observable<SpSheetRow[]>;

  ngOnInit(): void {
    this.state.init(this.spreadsheet, this.readOnly, this.chartConfigs);
    this.elementState.init(this.tableContainer.nativeElement);
    this.selectionState.init();
    this.keyboardState.init();
    this.mouseState.init();
    this.paginationState.init(this.pagination);
    this.scrollState.init(
      this.tableContainer.nativeElement,
      this.scroller.nativeElement,
      this.heightSimulator.nativeElement,
      this.horizontalScroller.nativeElement
    );

    this.columns$ = this.state.getCurrentSheetColumns$().pipe(
      // add the first column corresponding to the row header
      map((columns) => [{ index: -1, name: '', tags: {} }, ...columns])
    );
    this.rows$ = this.scrollState.getRowsToDisplay$();
  }

  ngOnDestroy(): void {
    this.scrollState.clear();
  }
}
