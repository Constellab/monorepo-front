import { Injectable, inject } from '@angular/core';
import { SpCellCoord } from '../model/sp-cell-coord.class';
import {
  columnIdAttributeName,
  SpCell,
  FlHeaderCellType,
  headerIndexAttributeName,
  headerTypeAttributeName,
  rowIdAttributeName,
} from '../model/sp-cell.class';
import { SpSpreadsheetState } from './sp-spreadsheet.state';
import { FlHtmlHelper } from '@monorepo/front-core-lib';

export type SpSheetMouseEventCell = CellEvent | HeaderCellEvent;

interface CellEvent {
  type: 'cell';
  coord: SpCellCoord;
  cell: SpCell;
  element: HTMLElement;
}

interface HeaderCellEvent {
  type: 'header';
  headerType: FlHeaderCellType;
  index: number;
  element: HTMLElement;
}

/**
 * State for dom manipulation of the cells
 */
@Injectable()
export class SpSpreadsheetElementState {
  private state = inject(SpSpreadsheetState);

  private tableContainer: HTMLElement;

  public init(tableContainer: HTMLElement): void {
    this.tableContainer = tableContainer;
  }

  /**
   * Retrieve the header cell element from the column id
   * @param columnId
   */
  public getColumnHeaderCellElement(columnId: number): HTMLElement {
    return this.tableContainer.querySelector(
      `[${headerTypeAttributeName}="column"][${headerIndexAttributeName}="${columnId}"]`
    );
  }

  public getCellFromHTMLElement(element: HTMLElement): SpSheetMouseEventCell | null {
    // search if this is a cell
    let cellElement = FlHtmlHelper.getParent(element, { tagName: 'SP-SPREADSHEET-CELL' });
    if (cellElement) {
      return this.getNormalCellFromHTMLElement(cellElement);
    }

    // search if this is a header cell
    cellElement = FlHtmlHelper.getParent(element, { tagName: 'SP-SPREADSHEET-HEADER-CELL' });
    if (cellElement) {
      return this.getHeaderCellFromHTMLElement(cellElement);
    }

    return null;
  }

  // returns cell based on a html element : SP-SPREADSHEET-CELL
  private getNormalCellFromHTMLElement(element: HTMLElement): CellEvent {
    const row: number = parseInt(element.getAttribute(rowIdAttributeName));
    const column: number = parseInt(element.getAttribute(columnIdAttributeName));

    return {
      type: 'cell',
      cell: this.state.currentSheet.getCell(row, column),
      coord: {
        row: row,
        column: column,
      },
      element: element,
    };
  }

  // returns header cell info based on a html element : SP-SPREADSHEET-HEADER-CELL
  private getHeaderCellFromHTMLElement(element: HTMLElement): HeaderCellEvent {
    const index: number = parseInt(element.getAttribute(headerIndexAttributeName));
    const type: FlHeaderCellType = element.getAttribute(headerTypeAttributeName) as FlHeaderCellType;

    return {
      type: 'header',
      headerType: type,
      index: index,
      element: element,
    };
  }
}
