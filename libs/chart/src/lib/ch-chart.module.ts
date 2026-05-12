import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlMenuDynamicModule } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { ChChartComponent } from './component/ch-chart/ch-chart.component';
import { ChChartBinDataPortalComponent } from './component/ch-chart-data-portal/ch-chart-bin-data-portal/ch-chart-bin-data-portal.component';
import { ChChartBoxPlotDataPortalComponent } from './component/ch-chart-data-portal/ch-chart-box-plot-data-portal/ch-chart-box-plot-data-portal.component';
import { ChChartDataWithSeriePortalComponent } from './component/ch-chart-data-portal/ch-chart-data-with-serie-portal/ch-chart-data-with-serie-portal.component';
import { ChChartHeatMapDataPortalComponent } from './component/ch-chart-data-portal/ch-chart-heat-map-data-portal/ch-chart-heat-map-data-portal.component';
import { ChChartStackedBarDataPortalComponent } from './component/ch-chart-data-portal/ch-chart-stacked-bar-data-portal/ch-chart-stacked-bar-data-portal.component';
import { ChChartValueComponent } from './component/ch-chart-data-portal/ch-chart-value/ch-chart-value.component';
import { ChChartVennDataPortalComponent } from './component/ch-chart-data-portal/ch-chart-venn-data-portal/ch-chart-venn-data-portal.component';
import { ChChartPortalComponent } from './component/ch-chart-portal/ch-chart-portal.component';
import { ChChartLegendHeatMapComponent } from './component/ch-chart-right-section/ch-chart-legend-heat-map/ch-chart-legend-heat-map.component';
import { ChChartLegendMultiSeriesComponent } from './component/ch-chart-right-section/ch-chart-legend-multi-series/ch-chart-legend-multi-series.component';
import { ChChartLegendSeriesWithTagsComponent } from './component/ch-chart-right-section/ch-chart-legend-series-with-tags/ch-chart-legend-series-with-tags.component';
import { ChChartSerieInlineComponent } from './component/ch-chart-serie-inline/ch-chart-serie-inline.component';
import { ChChartTypeSelectOptionsComponent } from './component/ch-chart-type-select-options/ch-chart-type-select-options.component';
import { CH_CHART_I18N } from './i18n/ch-chart.i18n';
import { ChChartColorFunctionPipe } from './pipe/ch-chart-color-function.pipe';
import { ChChartScalePipe } from './pipe/ch-chart-scale.pipe';
import { ChChartValueFormatterPipe } from './pipe/ch-chart-value-formatter.pipe';
import { ChChartPortalService } from './service/ch-chart-portal.service';

/**
 * Main module exporting all the chart modules
 */
@NgModule({
  declarations: [
    // Component
    ChChartComponent,
    ChChartPortalComponent,
    ChChartTypeSelectOptionsComponent,
    ChChartDataWithSeriePortalComponent,
    ChChartBoxPlotDataPortalComponent,
    ChChartSerieInlineComponent,
    ChChartBinDataPortalComponent,
    ChChartHeatMapDataPortalComponent,

    // Pipe
    ChChartScalePipe,

    ChChartVennDataPortalComponent,
    ChChartStackedBarDataPortalComponent,
    ChChartLegendMultiSeriesComponent,
    ChChartLegendHeatMapComponent,
    ChChartLegendSeriesWithTagsComponent,
    ChChartColorFunctionPipe,
    ChChartValueComponent,
    ChChartValueFormatterPipe,
  ],
  exports: [
    // Component
    ChChartComponent,
    ChChartPortalComponent,
    ChChartTypeSelectOptionsComponent,

    // Pipe
    ChChartScalePipe,
  ],
  imports: [
    CommonModule,

    FlPortalModule,
    FlIconModule,
    FlTranslateModule,
    FlMenuDynamicModule,
    FlCoreDirectiveModule,
    FlResizeModule,
    FlCorePipeModule,
    FlKeyValueModule,
    FlTagModule,

    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  providers: [ChChartPortalService],
})
export class ChChartModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('ChChartModule', CH_CHART_I18N);
  }
}
