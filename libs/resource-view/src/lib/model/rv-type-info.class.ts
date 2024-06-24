import { RvResourceViewType } from './rv-resource-view.class';
import { ComponentType } from '@angular/cdk/overlay';
import { RvViewJsonComponent } from '../component/rv-view-json/rv-view-json.component';
import { RvViewChart2dComponent } from '../component/rv-view-chart-2d/rv-view-chart2d.component';
import { RvViewMultiViewsComponent } from '../component/rv-view-multi-views/rv-view-multi-views.component';
import { RvResourceViewDirective } from './rv-resource-view.directive';
import { RvViewNetworkComponent } from '../component/rv-view-network/rv-view-network.component';
import { RvViewSpreadsheetComponent } from '../component/rv-view-spreadsheet/rv-view-spreadsheet.component';
import { RvViewTextComponent } from '../component/rv-view-text/rv-view-text.component';
import { RvViewImageComponent } from '../component/rv-view-image/rv-view-image.component';
import { RvViewHtmlComponent } from '../component/rv-view-html/rv-view-html.component';
import { RvViewStreamlitComponent } from '../component/rv-view-streamlit/rv-view-streamlit.component';
import { RvViewPlotlyComponent } from '../component/rv-view-plotly/rv-view-plotly.component';

// Information of the view type
export interface RvResourceViewTypeInfo {
  viewComponent: ComponentType<RvResourceViewDirective> |
    // Lazy load the component
    {
      load: () => Promise<ComponentType<RvResourceViewDirective>>;
    };
}


/**
 * List of default views supported by the resource view library
 */
export const rvDefaultViewTypeInfos: Record<RvResourceViewType, RvResourceViewTypeInfo> = {
  'json-view': {
    viewComponent: RvViewJsonComponent,
  },
  'text-view': {
    viewComponent: RvViewTextComponent,
  },
  'html-view': {
    viewComponent: RvViewHtmlComponent,
  },
  'table-view': {
    viewComponent: RvViewSpreadsheetComponent,
  },
  'tabular-view': {
    viewComponent: RvViewSpreadsheetComponent,
  },
  'dataset-view': {
    viewComponent: RvViewSpreadsheetComponent,
  },
  'network-view': {
    viewComponent: RvViewNetworkComponent,
  },
  'image-view': {
    viewComponent: RvViewImageComponent,
  },
  'scatter-plot-2d-view': {
    viewComponent: RvViewChart2dComponent,
  },
  'line-plot-2d-view': {
    viewComponent: RvViewChart2dComponent,
  },
  'vulcano-plot-view': {
    viewComponent: RvViewChart2dComponent,
  },
  'bar-plot-view': {
    viewComponent: RvViewChart2dComponent,
  },
  'stacked-bar-plot-view': {
    viewComponent: RvViewChart2dComponent,
  },
  'histogram-view': {
    viewComponent: RvViewChart2dComponent,
  },
  'box-plot-view': {
    viewComponent: RvViewChart2dComponent,
  },
  'multi-view': {
    viewComponent: RvViewMultiViewsComponent,
  },
  'venn-diagram-view': {
    viewComponent: RvViewChart2dComponent,
  },
  'heatmap-view': {
    viewComponent: RvViewChart2dComponent,
  },
  'plotly-view': {
    viewComponent: RvViewPlotlyComponent,
  },
  'streamlit-view': {
    viewComponent: RvViewStreamlitComponent,
  }
};

