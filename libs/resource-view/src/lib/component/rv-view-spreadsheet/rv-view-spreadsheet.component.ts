import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { SpSheetChartConfig, SpSpreadsheet, SpSpreadsheetPageLoader } from '@monorepo/spreadsheet';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';
import { RvResourceViewTable, rvTableToSpreadsheet } from '../../model/rv-table.class';

/**
 * Component to display a resource in a spreadsheet
 */
@Component({
  selector: 'rv-view-spreadsheet',
  templateUrl: './rv-view-spreadsheet.component.html',
  styleUrls: ['./rv-view-spreadsheet.component.scss'],
  standalone: false,
})
export class RvViewSpreadsheetComponent
  extends RvResourceViewDirective<RvResourceViewTable>
  implements OnInit
{
  @Input({ required: true }) view: RvResourceViewTable;

  spreadSheet: SpSpreadsheet;

  chartConfig?: SpSheetChartConfig[] = [];

  pagination?: SpSpreadsheetPageLoader;

  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    // ignore the table offset (fromRow and fromCol) because it doesn't work with local chart
    this.spreadSheet = rvTableToSpreadsheet(this.view, true);

    const spreadsheetConfig = this.moduleConfig.getSpreadsheetViewConfig();

    this.chartConfig = spreadsheetConfig.getChartConfig(this.resourceId, this.config, this.viewContainerRef);
    this.pagination = spreadsheetConfig.getPagination(this.view, this.resourceId, this.config);
  }
}
