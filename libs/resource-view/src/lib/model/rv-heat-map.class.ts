import { ChChart3dDatum, ChChartConfig, ChChartHeatMap, ChChartHeatMapDataContainer } from '@monorepo/chart';
import { ClHelpService, ClNumberHelper } from '@monorepo/core-lib';

import { RvResourceViewBase } from './rv-resource-view.class';

export interface RvResourceViewHeatMap extends RvResourceViewBase {
  type: 'heatmap-view';
  data: RvResourceViewHeatMapData;
}

export interface RvResourceViewHeatMapData {
  table: any[][];
  rows: RvResourceViewHeaderMapHeader[];
  columns: RvResourceViewHeaderMapHeader[];
  x_label: string; // name of the x-axis
  y_label: string; // name of the y-axis
}

export interface RvResourceViewHeaderMapHeader {
  name: string;
  tags: Record<string, string>;
}

/**
 * Convert the heat map view to a ChChart object
 * @param view
 */
export function rvHeatMapToChart(view: RvResourceViewHeatMap): ChChartConfig {
  const viewData = ClHelpService.transpose2dArray(view.data.table);
  const chartData: ChChart3dDatum[][] = [];

  for (let column = 0; column < viewData.length; column++) {
    const columnInfo: RvResourceViewHeaderMapHeader = view.data.columns
      ? view.data.columns[column]
      : { name: column.toString(), tags: {} };
    // convert all the column data into a 3d datum, where x = columnIndex, y = index of value and z = value as number
    const data: ChChart3dDatum[] = [];

    for (let row = 0; row < viewData[column].length; row++) {
      const rowInfo: RvResourceViewHeaderMapHeader = view.data.rows
        ? view.data.rows[row]
        : { name: row.toString(), tags: {} };
      const value = ClNumberHelper.fromString(viewData[column][row], null);
      const datum = new ChChart3dDatum(column, row, value);
      datum.tags = Object.assign({}, columnInfo.tags, rowInfo.tags);

      data.push(datum);
    }
    chartData.push(data);
  }

  const dataContainer = new ChChartHeatMapDataContainer(chartData);

  if (!ClHelpService.isNullOrEmpty(view.data.columns)) {
    dataContainer.setXTickLabels(view.data.columns.map((column) => column.name));
  }

  if (!ClHelpService.isNullOrEmpty(view.data.rows)) {
    dataContainer.setYTickLabels(view.data.rows.map((row) => row.name));
  }

  // set the labels
  if (view.data.x_label) {
    dataContainer.axisXLabel = view.data.x_label;
  }
  if (view.data.y_label) {
    dataContainer.axisYLabel = view.data.y_label;
  }

  return new ChChartHeatMap(dataContainer);
}
