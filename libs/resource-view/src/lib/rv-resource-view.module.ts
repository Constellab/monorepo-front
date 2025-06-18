import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlImageModule } from '@monorepo/front-core-lib/fl-image';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlPlotlyModule } from '@monorepo/front-core-lib/fl-plotly';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlThemeModule } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { RvResourceViewComponent } from './component/rv-resource-view/rv-resource-view.component';
import { RvViewJsonComponent } from './component/rv-view-json/rv-view-json.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { RvRichTextResourceViewComponent } from './component/rv-rich-text-resource-view/rv-rich-text-resource-view.component';
import { RvTechnicalInfoButtonComponent } from './component/rv-technical-info-button/rv-technical-info-button.component';
import { RvTechnicalInfoDialogComponent } from './component/rv-technical-info-dialog/rv-technical-info-dialog.component';
import { RvViewChart2dComponent } from './component/rv-view-chart-2d/rv-view-chart2d.component';
import { RvViewMultiViewsComponent } from './component/rv-view-multi-views/rv-view-multi-views.component';
import { RvViewNetworkComponent } from './component/rv-view-network/rv-view-network.component';
import { RvViewSpreadsheetComponent } from './component/rv-view-spreadsheet/rv-view-spreadsheet.component';
import { RvViewTextComponent } from './component/rv-view-text/rv-view-text.component';
import { rvResourceViewI18n } from './rv-resource-view.i18n';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BnBioNetworkModule } from '@monorepo/bio-network';
import { ChChartModule } from '@monorepo/chart';
import { FlMarkdownModule } from '@monorepo/front-core-lib/fl-markdown';
import { SpSpreadsheetModule } from '@monorepo/spreadsheet';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { RvViewAudioComponent } from './component/rv-view-audio/rv-view-audio.component';
import { RvViewHtmlComponent } from './component/rv-view-html/rv-view-html.component';
import { RvViewIframeComponent } from './component/rv-view-iframe/rv-view-iframe.component';
import { RvViewImageComponent } from './component/rv-view-image/rv-view-image.component';
import { RvViewMarkdownComponent } from './component/rv-view-markdown/rv-view-markdown.component';
import { RvViewPlotlyComponent } from './component/rv-view-plotly/rv-view-plotly.component';
import { RvViewAppComponent } from './component/rv-view-app/rv-view-app.component';

/**
 * When imported a RV_MODULE_CONFIG must be provided, which is an instance of RvResourceViewModuleConfig.
 * Ex : { provide: RV_MODULE_CONFIG, useClass: RvResourceViewModuleBasicConfig }
 */
@NgModule({
  imports: [
    CommonModule,

    MatGridListModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,

    FlJsonEditorModule,
    FlCoreComponentModule,
    FlTranslateModule,
    FlDialogModule,
    FlKeyValueModule,
    FlLoaderModule,
    FlImageModule,
    FlThemeModule,
    FlIconModule,
    FlPlotlyModule,
    FlInfiniteScrollModule,
    FlMarkdownModule,

    TeTextEditorModule, // for the te-title-caption component
    BnBioNetworkModule,
    ChChartModule,
    SpSpreadsheetModule,
  ],
  declarations: [
    RvResourceViewComponent,
    RvViewJsonComponent,
    RvViewChart2dComponent,
    RvViewMultiViewsComponent,
    RvViewNetworkComponent,
    RvViewTextComponent,
    RvViewSpreadsheetComponent,
    RvTechnicalInfoButtonComponent,
    RvTechnicalInfoDialogComponent,
    RvRichTextResourceViewComponent,
    RvViewImageComponent,
    RvViewHtmlComponent,
    RvViewAppComponent,
    RvViewPlotlyComponent,
    RvViewAudioComponent,
    RvViewMarkdownComponent,
    RvViewIframeComponent,
  ],
  exports: [
    RvResourceViewComponent,
    RvViewJsonComponent,
    RvViewChart2dComponent,
    RvViewMultiViewsComponent,
    RvViewNetworkComponent,
    RvViewTextComponent,
    RvViewSpreadsheetComponent,
    RvTechnicalInfoButtonComponent,
    RvTechnicalInfoDialogComponent,
    RvRichTextResourceViewComponent,
    RvViewImageComponent,
    RvViewHtmlComponent,
    RvViewAppComponent,
    RvViewPlotlyComponent,
    RvViewAudioComponent,
    RvViewMarkdownComponent,
    RvViewIframeComponent,
  ],
})
export class RvResourceViewModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('RvResourceViewModule', rvResourceViewI18n);
  }
}
