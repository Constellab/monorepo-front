import { Injectable, OnDestroy } from '@angular/core';
import {
  SpSheetChartSelectionComponent
} from '../component/sp-sheet-chart-selection/sp-sheet-chart-selection.component';
import { SpSpreadsheetSelectionState } from './sp-spreadsheet-selection.state';
import {
  SpSheetChartSelectionForm,
  SpSheetChartSelectionResult,
  SpSpreadsheetChartSelectionInput
} from '../model/chart/sp-sheet-chart-selection-form.class';
import { SpSpreadsheetState } from './sp-spreadsheet.state';
import { Observable, Subscription } from 'rxjs';
import {
  FlMenuDynamic,
  FlOverlayRef,
  FlPortalActionResult,
  FlPortalActionsService,
  FlPortalConfig,
  FlPortalService,
  FlSnackBarService
} from '@monorepo/front-core-lib';


interface SelectionWithOverlay {
  selection: SpSheetChartSelectionForm;
  overlayRef: FlOverlayRef;
}

@Injectable()
export class SpSpreadsheetChartState implements OnDestroy {

  private overlayRef: FlOverlayRef;

  // store all the current overlay ref and the corresponding selection
  private currentSelections: Map<symbol, SelectionWithOverlay> = new Map();

  private chartActionName = 'spreadsheet-chart-create';

  private subscription: Subscription;

  constructor(private state: SpSpreadsheetState,
              private portalService: FlPortalService,
              private selectionState: SpSpreadsheetSelectionState,
              private snackBarService: FlSnackBarService,
              private actionService: FlPortalActionsService) {

    // listen to chart creation actions
    this.subscription = this.actionService.getResult$(this.chartActionName).subscribe(
      (action: FlPortalActionResult<FlOverlayRef>) => {
        if (action.status === 'success') {
          this.registerPortalOverlay(action.result, action.additionalInformation);
        }
      });
  }

  public openChartSelectionPortal(selection?: SpSheetChartSelectionForm): void {
    // if the overlay is already open, do nothing
    if (this.overlayRef != null) {
      return;
    }

    const portalConfig: FlPortalConfig = this.portalService.configureAbsolutePortal(
      { centerHorizontally: '0', top: '0' },
      {
        disposeOnNavigation: true
      });

    let data: SpSpreadsheetChartSelectionInput;
    // if we are in update mode
    if (selection != null) {
      data = {
        mode: 'update',
        selection: selection
      };
    } else {
      data = {
        mode: 'create',
        currentSelection: this.selectionState.currentSelection
      };
    }

    this.overlayRef = this.portalService.createPortal(SpSheetChartSelectionComponent, portalConfig, data);

    this.overlayRef.detachments().subscribe(
      (chartSelection) => this.generateChart(chartSelection, selection?.id ?? null)
    );
  }


  /**
   * Generate the chart config from select and open portal afterward
   * @param result
   * @param fromSelectionId if provided and result.mode === 'update', the chart corresponding to the selection is deleted
   * @private
   */
  private generateChart(result ?: SpSheetChartSelectionResult, fromSelectionId?: symbol): void {
    this.overlayRef = null;

    if (!result) return;

    // if this is an update mode, we close the previous selection overlay
    if (result.mode === 'update' && fromSelectionId != null) {
      this.closeChartOverlay(fromSelectionId);
    }

    // generate chart
    try {

      const chartConfig = this.state.getChartConfig(result.formValue.chartType);

      const chartOverlay = chartConfig.generateChart(
        result.formValue.series, {
          sheet: this.state.currentSheet,
          additionalFields: result.formValue.additionalFields,
          contextMenuItems: this.getContextMenuItem(result.formValue.id),
          updateSelection: () => this.openUpdateChartSelectionPortal(result.formValue.id)
        });

      if (chartOverlay instanceof Observable) {
        // call the action service to register the chart creation
        this.actionService.addAction({
          type: this.chartActionName,
          action: chartOverlay,
          text: { text: 'spSpreadsheet.creating_chart', translateText: true },
          additionalInformation: result.formValue
        }, true);
      } else {
        this.registerPortalOverlay(chartOverlay, result.formValue);
      }
    } catch (e) {
      this.snackBarService.openErrorMessage({ text: 'Error while generating chart', translateText: false });
      throw e;
    }
  }

  /**
   * Open the chart portal after chart selection
   * @private
   */
  private registerPortalOverlay(overlay: FlOverlayRef, formSelection: SpSheetChartSelectionForm): void {
    // add the selection to the current
    this.currentSelections.set(formSelection.id, {
      overlayRef: overlay,
      selection: formSelection
    });

    // clear selection on chart close
    overlay.detachments().subscribe(
      () => this.clearSelection(formSelection.id)
    );
  }

  /**
   * Open the chart selection portal in update mode
   * @param selectionId
   * @private
   */
  private openUpdateChartSelectionPortal(selectionId: symbol): void {
    const selection: SelectionWithOverlay = this.currentSelections.get(selectionId);
    if (selection) {
      this.openChartSelectionPortal(selection.selection);
    }
  }


  private closeChartOverlay(selectionId: symbol): void {
    this.currentSelections.get(selectionId)?.overlayRef.dispose();
  }

  private clearSelection(selectionId: symbol): void {
    this.currentSelections.delete(selectionId);
  }

  private closeAllOverlay(): void {
    for (const key of this.currentSelections.keys()) {
      this.closeChartOverlay(key);
    }
  }

  /**
   * return the context menu item for the chart container
   */
  private getContextMenuItem(selectionId: symbol): FlMenuDynamic[] {
    const menu: FlMenuDynamic[] = [];

    // button to edit the chart and reopen data selection
    menu.push({
      type: 'button',
      text: { text: 'spSpreadsheet.chart_update', translateText: true },
      icon: 'edit',
      onClick: () => this.openUpdateChartSelectionPortal(selectionId)
    });

    // button to close all overlay
    menu.push({
      type: 'button',
      text: { text: 'spSpreadsheet.chart_close_all', translateText: true },
      icon: 'clear',
      onClick: () => this.closeAllOverlay()
    });

    return menu;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
