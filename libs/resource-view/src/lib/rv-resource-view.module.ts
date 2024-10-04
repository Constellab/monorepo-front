import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RvResourceViewComponent } from './component/rv-resource-view/rv-resource-view.component';
import { RvViewJsonComponent } from './component/rv-view-json/rv-view-json.component';
import {
  FlCoreComponentModule,
  FlDialogModule,
  FlIconModule,
  FlImageModule,
  FlJsonEditorModule,
  FlKeyValueModule,
  FlLoaderModule,
  FlPlotlyModule,
  FlThemeModule,
  FlTranslateModule,
  FlTranslateService
} from '@monorepo/front-core-lib';
import { rvResourceViewI18n } from './rv-resource-view.i18n';
import { RvViewChart2dComponent } from './component/rv-view-chart-2d/rv-view-chart2d.component';
import { RvViewMultiViewsComponent } from './component/rv-view-multi-views/rv-view-multi-views.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { RvViewNetworkComponent } from './component/rv-view-network/rv-view-network.component';
import { RV_MODULE_CONFIG, RvResourceViewModuleConfig } from './model/rv-resource-view-module.config';
import { RvViewTextComponent } from './component/rv-view-text/rv-view-text.component';
import { RvViewSpreadsheetComponent } from './component/rv-view-spreadsheet/rv-view-spreadsheet.component';
import {
  RvTechnicalInfoButtonComponent
} from './component/rv-technical-info-button/rv-technical-info-button.component';
import {
  RvTechnicalInfoDialogComponent
} from './component/rv-technical-info-dialog/rv-technical-info-dialog.component';
import {
  RvRichTextResourceViewComponent
} from './component/rv-rich-text-resource-view/rv-rich-text-resource-view.component';
import { MatIconModule } from '@angular/material/icon';

import { RvViewImageComponent } from './component/rv-view-image/rv-view-image.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BnBioNetworkModule } from '@monorepo/bio-network';
import { RvViewHtmlComponent } from './component/rv-view-html/rv-view-html.component';
import { ChChartModule } from '@monorepo/chart';
import { SpSpreadsheetModule } from '@monorepo/spreadsheet';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { RvViewStreamlitComponent } from './component/rv-view-streamlit/rv-view-streamlit.component';
import { RvViewPlotlyComponent } from './component/rv-view-plotly/rv-view-plotly.component';
import { RvViewAudioComponent } from './component/rv-view-audio/rv-view-audio.component';

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
    RvViewStreamlitComponent,
    RvViewPlotlyComponent,
    RvViewAudioComponent,
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
    RvViewStreamlitComponent,
    RvViewPlotlyComponent,
    RvViewAudioComponent,
  ],
})
export class RvResourceViewModule {
  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation(
      'RvResourceViewModule',
      rvResourceViewI18n
    );
  }

  /**
   * Method to configure the svg icon registrations
   * @param config
   */
  public static forRoot(
    config: RvResourceViewModuleConfig
  ): ModuleWithProviders<RvResourceViewModule> {
    return {
      ngModule: RvResourceViewModule,
      providers: [{provide: RV_MODULE_CONFIG, useValue: config}],
    };
  }
}
