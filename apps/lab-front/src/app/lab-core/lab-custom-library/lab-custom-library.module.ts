import {NgModule} from '@angular/core';
import {
  FlArticleModule,
  FlAuthModule,
  FlAutocompleteMultipleModule,
  FlCardModule,
  FlChartModule,
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
  FlIconModule,
  FlInfiniteScrollModule,
  FlInputFileModule,
  FlJsonEditorModule,
  FlKeyValueModule,
  FlLoaderModule,
  FlMenuDynamicModule,
  FlPortalActionsModule,
  FlPortalModule,
  FlResizeModule,
  FlSearchModule,
  FlSectionModule,
  FlSnackBarModule,
  FlSpreadsheetModule,
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
    FlSpreadsheetModule,
    FlChartModule,
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

    //  Other lib
    BnBioNetworkModule,
    RvResourceViewModule,
    TdTechnicalDocModule,
    PrProtocolModule,
  ]
})
export class LabCustomLibraryModule {
}
