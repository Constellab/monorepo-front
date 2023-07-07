import {NgModule} from '@angular/core';
import {
  FlArticleModule,
  FlAuthModule,
  FlAutocompleteMultipleModule,
  FlCardModule,
  FlColorModule,
  FlCoreComponentModule,
  FlCoreDirectiveModule,
  FlCorePipeModule,
  FlDateModule,
  FlDialogModule,
  FlDragModule,
  FlDrawerModule,
  FlDynamicFieldModule,
  FlExpansionMenuModule,
  FlFormInputsManagerModule,
  FlFormModule,
  FlHorizontalNavBarModule,
  FlIconModule,
  FlInfiniteScrollModule,
  FlInputFileModule,
  FlInputSearchModule,
  FlJsonEditorModule,
  FlKeyValueModule,
  FlLoaderModule,
  FlMenuDynamicModule,
  FlPortalActionsModule,
  FlPortalModule, FlRadioButtonBigModule,
  FlResizeModule,
  FlSearchModule,
  FlSectionModule,
  FlSnackBarModule,
  FlStatusModule,
  FlTagModule,
  FlTextEditorModule,
  FlTextIconModule,
  FlThemeModule,
  FlTranslateModule,
  FlUserModule
} from '@monorepo/front-core-lib';
import {RvResourceViewModule} from '@monorepo/resource-view';
import {TdTechnicalDocModule} from '@monorepo/technical-doc';
import {PrProtocolModule} from '@monorepo/protocol';
import {BnBioNetworkModule} from '@monorepo/bio-network';
import {SpSpreadsheetModule} from '@monorepo/spreadsheet';
import {ChChartModule} from '@monorepo/chart';

/**
 * Regrouped all the needed import for this app from library
 *
 * All the module should be in export
 */
@NgModule({
  exports: [
    FlCoreDirectiveModule,
    FlCorePipeModule,
    FlCoreComponentModule,

    FlTranslateModule,
    FlDialogModule,
    FlSnackBarModule,
    FlPortalModule,
    FlIconModule,
    FlSectionModule,
    FlCardModule,
    FlTextIconModule,
    FlStatusModule,
    FlInfiniteScrollModule,
    FlLoaderModule,
    FlJsonEditorModule,
    FlDynamicFieldModule,
    FlFormModule,
    FlInputFileModule,
    FlPortalActionsModule,
    FlDateModule,
    FlAuthModule,
    FlDrawerModule,
    FlTagModule,
    FlTextEditorModule,
    FlFormInputsManagerModule,
    FlSearchModule,
    FlArticleModule,
    FlKeyValueModule,
    FlResizeModule,
    FlColorModule,
    FlExpansionMenuModule,
    FlDragModule,
    FlMenuDynamicModule,
    FlAutocompleteMultipleModule,
    FlThemeModule,
    FlUserModule,
    FlInputSearchModule,
    FlHorizontalNavBarModule,
    FlRadioButtonBigModule,

    //  Other lib
    BnBioNetworkModule,
    RvResourceViewModule,
    TdTechnicalDocModule,
    PrProtocolModule,
    SpSpreadsheetModule,
    ChChartModule,
  ]
})
export class LabCustomLibraryModule {
}
