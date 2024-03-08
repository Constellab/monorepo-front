import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {SpSheetHeaderInfo} from '../../model/sp-sheet-headers.class';
import {FL_PORTAL_DATA} from '@monorepo/front-core-lib';

/**
 * Portal to display information about a header (row or column)
 */
@Component({
  selector: 'sp-spreadsheet-header-info',
  templateUrl: './sp-spreadsheet-header-info.component.html',
  styleUrls: ['./sp-spreadsheet-header-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpSpreadsheetHeaderInfoComponent  {

  headerInfo: SpSheetHeaderInfo;

  constructor(@Inject(FL_PORTAL_DATA) headerInfo: SpSheetHeaderInfo) {
    this.headerInfo = headerInfo;
  }

  hasTitle(): boolean {
    return this.headerInfo.name != null && this.headerInfo.name.toString().length > 0;
  }
}
