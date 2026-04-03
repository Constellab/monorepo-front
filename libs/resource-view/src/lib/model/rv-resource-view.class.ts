import { FlPlotlyData } from '@monorepo/front-core-lib/fl-plotly';

import { RvResourceViewBasicPlot2d } from './rv-basic-plot-2d.class';
import { RvResourceViewBoxPlot } from './rv-box-plot.class';
import { RvResourceViewHeatMap } from './rv-heat-map.class';
import { RvResourceViewHistogram } from './rv-histogram.class';
import { RvResourceViewTable } from './rv-table.class';
import { RvTechnicalInfo } from './rv-technical-info.class';
import { RvResourceVennDiagram } from './rv-venn-diagram.class';
import { RvResourceViewVulcanoPlot } from './rv-vulcano-plot.class';

// list of available view type
export type RvResourceViewType =
  | 'json-view'
  | 'text-view'
  | 'table-view'
  | 'dataset-view'
  | 'tabular-view'
  | 'network-view'
  | 'image-view'
  | 'scatter-plot-2d-view'
  | 'line-plot-2d-view'
  | 'vulcano-plot-view'
  | 'bar-plot-view'
  | 'stacked-bar-plot-view'
  | 'histogram-view'
  | 'box-plot-view'
  | 'multi-view'
  | 'venn-diagram-view'
  | 'heatmap-view'
  | 'iframe-view'
  | 'markdown-view'
  | 'plotly-view'
  | 'app-view'
  | 'audio-view';

export interface RvResourceViewBase {
  type: RvResourceViewType | string;
  data: any;
  title?: string;
  technical_info?: RvTechnicalInfo[];
}

export interface RvResourceViewJson extends RvResourceViewBase {
  type: 'json-view';
  data: Record<string, any>;
}

export interface RvResourceViewText extends RvResourceViewBase {
  type: 'text-view';
  data: {
    text: string;
    is_first_page: boolean;
    is_last_page: boolean;
    next_page: any;
    previous_page: any;
    page_param_name: string;
  };
}

export interface RvResourceViewNetwork extends RvResourceViewBase {
  type: 'network-view';
  data: any;
}

export interface RvResourceViewImage extends RvResourceViewBase {
  type: 'image-view';
  data: {
    src: string;
  };
}

export interface RvResourceViewIframe extends RvResourceViewBase {
  type: 'iframe-view';
  data: {
    src: string;
  };
}

export interface RvResourceViewMarkdown extends RvResourceViewBase {
  type: 'markdown-view';
  data: {
    markdown: string;
  };
}

export interface RvResourceViewMulti extends RvResourceViewBase {
  type: 'multi-view';
  data: RvResourceViewMultiData;
}

export interface RvResourceViewMultiData {
  nb_of_columns: number;
  views: {
    colspan: number;
    rowspan: number;
    view: RvResourceView;
  }[];
}

export interface RvResourceViewPlotly extends RvResourceViewBase {
  type: 'plotly-view';
  data: FlPlotlyData;
}

export interface RvResourceViewApp extends RvResourceViewBase {
  type: 'app-view';
  data: {
    app_id: string;
    app_url: { host_url: string; params: Record<string, string> };
    get_status_route: string; // route to get the app status
    status: 'RUNNING' | 'STOPPED' | 'STARTING';
    status_text?: string;
  };
}

export interface RvResourceViewAudio extends RvResourceViewBase {
  type: 'audio-view';
  data: {
    base_64_audio: string;
    mime_type: string;
  };
}

//////////////////////////// TYPE THAT GROUP ALL VIEW TYPES /////////////////////////////
export type RvResourceView =
  | RvResourceViewJson
  | RvResourceViewMulti
  | RvViewChartType
  | RvResourceViewImage
  | RvResourceViewNetwork
  | RvResourceViewText
  | RvResourceViewTable
  | RvResourceViewMarkdown
  | RvResourceViewPlotly
  | RvResourceViewApp
  | RvResourceViewAudio;

export type RvViewChartType =
  | RvResourceViewBasicPlot2d
  | RvResourceViewBoxPlot
  | RvResourceViewHeatMap
  | RvResourceViewHistogram
  | RvResourceVennDiagram
  | RvResourceViewVulcanoPlot;
