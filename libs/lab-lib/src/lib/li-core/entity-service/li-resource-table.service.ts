import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Injectable, inject } from '@angular/core';
import { LiResourceService } from './li-resource.service';
import { LiResourceView } from '../model/entities/resource/li-resource-view.entity';
import { Observable } from 'rxjs';
import { RvResourceViewTable } from '@monorepo/resource-view';
import { TdParamSpecsValues } from '@monorepo/technical-doc';

export type LiTableChartType =
  | 'line-plot-2d'
  | 'scatter-plot-2d'
  | 'vulcano-plot'
  | 'bar-plot'
  | 'stack-bar-plot'
  | 'histogram'
  | 'box-plot'
  | 'heatmap'
  | 'venn-diagram';

/**
 * Service to call methods on table resource
 */
@Injectable({
  providedIn: 'root',
})
export class LiResourceTableService {
  private apiService = inject(FlApiService);
  private resourceService = inject(LiResourceService);

  private readonly route: string = 'resource-table';

  private static readonly tableViewFromRowParam = 'from_row';
  private static readonly tableViewNbOfRowsPerPageParam = 'number_of_rows_per_page';
  private static readonly tableDefaultPageSize: number = 100;

  /**
   * Method used by the Table view to call a Chart view on it
   */
  public callChartOnTable(
    resourceId: string,
    tableViewMethodName: string,
    tableViewConfig: TdParamSpecsValues,
    chartType: LiTableChartType,
    chartConfig: TdParamSpecsValues
  ): Observable<LiResourceView> {
    const data = {
      table_view_name: tableViewMethodName,
      table_config_values: tableViewConfig,
      chart_type: chartType,
      chart_config_values: chartConfig,
    };

    return this.apiService.post(`${this.route}/${resourceId}/call-chart`, data, LiResourceView);
  }

  /**
   *
   * @param id
   * @param viewMethodName
   * @param config
   * @param fromRow the first row to load (including)
   */
  public callNextPage(
    id: string,
    viewMethodName: string,
    config: TdParamSpecsValues,
    fromRow: number
  ): Observable<RvResourceViewTable> {
    const viewConfig = LiResourceTableService.getViewConfigNextPage(config, fromRow);

    return this.resourceService.callResourceViewData(
      id,
      viewMethodName,
      viewConfig
    ) as Observable<RvResourceViewTable>;
  }

  /**
   *
   * @param id
   * @param viewMethodName
   * @param config
   * @param toRow the last row to load (excluding)
   */
  public callPreviousPage(
    id: string,
    viewMethodName: string,
    config: TdParamSpecsValues,
    toRow: number
  ): Observable<RvResourceViewTable> {
    // merge config with pagination config
    // add 1 to the fromRow because communication are made using 1-based index
    const viewConfig = LiResourceTableService.getViewConfigPreviousPage(config, toRow);

    return this.resourceService.callResourceViewData(
      id,
      viewMethodName,
      viewConfig
    ) as Observable<RvResourceViewTable>;
  }

  public static getViewConfigNextPage(viewConfig: TdParamSpecsValues, fromRow: number): TdParamSpecsValues {
    // merge config with pagination config,
    // add 1 to the fromRow because communication are made using 1-based index
    return Object.assign({}, viewConfig, { [this.tableViewFromRowParam]: fromRow + 1 });
  }

  public static getViewConfigPreviousPage(viewConfig: TdParamSpecsValues, toRow: number): TdParamSpecsValues {
    let pageSize = viewConfig[this.tableViewNbOfRowsPerPageParam] ?? this.tableDefaultPageSize;
    let fromRow = toRow - pageSize;

    // if the page size is bigger than the remaining rows to load, reduce
    // the page size, and load rows from 0
    if (fromRow < 0) {
      pageSize += fromRow;
      fromRow = 0;
    }

    // merge config with pagination config
    // add 1 to the fromRow because communication are made using 1-based index
    return Object.assign({}, viewConfig, {
      [this.tableViewFromRowParam]: fromRow + 1,
      [this.tableViewNbOfRowsPerPageParam]: pageSize,
    });
  }
}
