import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpSheetHeaderInfo } from '../../model/sp-sheet-headers.class';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';

/**
 * Portal to display information about a header (row or column)
 */
@Component({
  selector: 'sp-spreadsheet-header-info',
  templateUrl: './sp-spreadsheet-header-info.component.html',
  styleUrls: ['./sp-spreadsheet-header-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SpSpreadsheetHeaderInfoComponent {
  headerInfo: SpSheetHeaderInfo;

  constructor() {
    const headerInfo = inject<SpSheetHeaderInfo>(FL_PORTAL_DATA);

    this.headerInfo = headerInfo;
  }

  hasTitle(): boolean {
    return this.headerInfo.name != null && this.headerInfo.name.toString().length > 0;
  }
}
