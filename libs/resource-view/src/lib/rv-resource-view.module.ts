import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BnBioNetworkModule } from '@monorepo/bio-network';
import { ChChartModule } from '@monorepo/chart';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlImageModule } from '@monorepo/front-core-lib/fl-image';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlMarkdownModule } from '@monorepo/front-core-lib/fl-markdown';
import { FlPlotlyModule } from '@monorepo/front-core-lib/fl-plotly';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlThemeModule } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { SpSpreadsheetModule } from '@monorepo/spreadsheet';
import { TeTextEditorModule } from '@monorepo/text-editor';

import { RvResourceViewComponent } from './component/rv-resource-view/rv-resource-view.component';
import { RvResourceViewDialogComponent } from './component/rv-resource-view-dialog/rv-resource-view-dialog.component';
import { RvRichTextResourceViewComponent } from './component/rv-rich-text-resource-view/rv-rich-text-resource-view.component';
import { RvTechnicalInfoButtonComponent } from './component/rv-technical-info-button/rv-technical-info-button.component';
import { RvTechnicalInfoDialogComponent } from './component/rv-technical-info-dialog/rv-technical-info-dialog.component';
import { RvViewAppComponent } from './component/rv-view-app/rv-view-app.component';
import { RvViewAudioComponent } from './component/rv-view-audio/rv-view-audio.component';
import { RvViewChart2dComponent } from './component/rv-view-chart-2d/rv-view-chart2d.component';
import { RvViewIframeComponent } from './component/rv-view-iframe/rv-view-iframe.component';
import { RvViewImageComponent } from './component/rv-view-image/rv-view-image.component';
import { RvViewJsonComponent } from './component/rv-view-json/rv-view-json.component';
import { RvViewMarkdownComponent } from './component/rv-view-markdown/rv-view-markdown.component';
import { RvViewMultiViewsComponent } from './component/rv-view-multi-views/rv-view-multi-views.component';
import { RvViewNetworkComponent } from './component/rv-view-network/rv-view-network.component';
import { RvViewPlotlyComponent } from './component/rv-view-plotly/rv-view-plotly.component';
import { RvViewSpreadsheetComponent } from './component/rv-view-spreadsheet/rv-view-spreadsheet.component';
import { RvViewTextComponent } from './component/rv-view-text/rv-view-text.component';
import { RV_RESOURCE_VIEW_I18N } from './rv-resource-view.i18n';

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
    RvViewAppComponent,
    RvViewPlotlyComponent,
    RvViewAudioComponent,
    RvViewMarkdownComponent,
    RvViewIframeComponent,
    RvResourceViewDialogComponent,
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
    RvViewAppComponent,
    RvViewPlotlyComponent,
    RvViewAudioComponent,
    RvViewMarkdownComponent,
    RvViewIframeComponent,
    RvResourceViewDialogComponent,
  ],
})
export class RvResourceViewModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('RvResourceViewModule', RV_RESOURCE_VIEW_I18N);
  }
}
