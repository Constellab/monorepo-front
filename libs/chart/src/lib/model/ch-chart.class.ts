import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';

import { ChChartConfig } from './ch-chart-config.class';

export interface ChChartPortalConfig {
  chart: ChChartConfig;

  contextMenuItems?: FlMenuDynamic[];
}

export enum ChChartType {
  LINE = 'LINE',
  SCATTER_PLOT = 'SCATTER_PLOT',
  VULCANO_PLOT = 'VULCANO_PLOT',
  BAR_PLOT = 'BAR_PLOT',
  STACKED_PLOT = 'STACKED_PLOT',
  HISTOGRAM = 'HISTOGRAM',
  BOX_PLOT = 'BOX_PLOT',
  HEAT_MAP = 'HEAT_MAP',
  VENN_DIAGRAM = 'VENN_DIAGRAM',
}

export const chChartTypeIcons: Record<ChChartType, string> = {
  LINE: 'show_chart',
  SCATTER_PLOT: 'scatter_plot',
  VULCANO_PLOT: 'scatter_plot',
  BAR_PLOT: 'bar_chart',
  STACKED_PLOT: 'stacked_bar_chart',
  HISTOGRAM: 'bar_chart',
  BOX_PLOT: 'multiline_chart',
  HEAT_MAP: 'grid_on',
  VENN_DIAGRAM: 'join_full',
};
