import {Injectable} from '@angular/core';
import {SpSpreadsheetSelectionState} from './sp-spreadsheet-selection.state';
import {SpSpreadsheetActions} from './sp-spreadsheet-actions.state';
import {SpSpreadsheetChartState} from './sp-spreadsheet-chart.state';
import {SpSpreadsheetClipboardState} from './sp-spreadsheet-clipboard.state';
import {SpSpreadsheetState} from './sp-spreadsheet.state';
import {FlMenuDynamic, FlMenuDynamicService, FlPortalService} from '@monorepo/front-core-lib';


/**
 * State to handle context menu
 */
@Injectable()
export class SpSpreadsheetContextMenu {

  constructor(private state: SpSpreadsheetState,
              private selectionState: SpSpreadsheetSelectionState,
              private portalService: FlPortalService,
              private action: SpSpreadsheetActions,
              private chartState: SpSpreadsheetChartState,
              private clipboardState: SpSpreadsheetClipboardState,
              private menuDynamicService: FlMenuDynamicService) {
  }

  public openCellContextMenu(mouseEvent: MouseEvent): void {
    this.menuDynamicService.openDynamicMenuFromMouseEvent(this.getCellConfig(), mouseEvent);
  }

  public openHeaderColumnContextMenu(mouseEvent: MouseEvent): void {
    this.menuDynamicService.openDynamicMenuFromMouseEvent(this.getConfigForHeaderColumn(), mouseEvent);
  }

  public openHeaderRowContextMenu(mouseEvent: MouseEvent): void {
    this.menuDynamicService.openDynamicMenuFromMouseEvent(this.getConfigForHeaderRow(), mouseEvent);
  }

  /**
   * Get config for the header column based on a selection
   */
  public getConfigForHeaderColumn(): FlMenuDynamic[] {
    const readOnly = this.state.readOnly;
    const menu = this.getCopyPasteConfig(readOnly);

    if (!readOnly) {
      menu.push(  // button to create a row
        // button to create a column
        {
          type: 'button',
          text: {text: 'spSpreadsheet.add', translateText: true},
          icon: 'add',
          onClick: () => this.action.addColumn()
        },
        // button to delete columns
        {
          type: 'button',
          text: {text: 'spSpreadsheet.delete', translateText: true},
          icon: 'delete',
          onClick: () => this.action.deleteColumns()
        }
      );
    }

    menu.push(this.getCreateChartConfig());
    return menu;
  }

  /**
   * Get config for the header row based on a selection
   */
  public getConfigForHeaderRow(): FlMenuDynamic[] {
    const readOnly = this.state.readOnly;
    const menu = this.getCopyPasteConfig(readOnly);

    if (!readOnly) {
      menu.push(  // button to create a row
        {
          type: 'button',
          text: {text: 'spSpreadsheet.add', translateText: true},
          icon: 'add',
          onClick: () => this.action.addRow(),
          divider: true,
        },
        // button to delete rows
        {
          type: 'button',
          text: {text: 'spSpreadsheet.delete', translateText: true},
          icon: 'delete',
          onClick: () => this.action.deleteRows()
        });
    }

    menu.push(this.getCreateChartConfig());

    return menu;
  }

  /**
   * Get config for the header row based on a selection
   */
  private getCellConfig(): FlMenuDynamic[] {
    const menu = this.getCopyPasteConfig(this.state.readOnly);

    menu.push(this.getCreateChartConfig());


    return menu;
  }

  private getCreateChartConfig(): FlMenuDynamic {
    return {
      type: 'button',
      text: {text: 'spSpreadsheet.create_chart', translateText: true},
      icon: 'addchart',
      onClick: () => this.chartState.openChartSelectionPortal(),
      divider: true
    };
  }

  private getCopyPasteConfig(readOnly: boolean): FlMenuDynamic[] {
    const menu: FlMenuDynamic[] = [{
      type: 'button',
      text: {text: 'spSpreadsheet.copy', translateText: true},
      icon: 'content_copy',
      onClick: () => this.clipboardState.copyCurrentSelectionToClipboard(),
    }];

    if (!readOnly) {
      menu.push({
        type: 'button',
        text: {text: 'spSpreadsheet.paste', translateText: true},
        icon: 'content_paste',
        onClick: () => this.clipboardState.pasteClipboardValueToSelection()
      });
    }

    return menu;
  }


}
