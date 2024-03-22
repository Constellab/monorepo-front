import {NgModule} from '@angular/core';
import {
  FlArticleModule,
  FlAuthModule,
  FlAutocompleteMultipleModule,
  FlCardModule,
  FlCodeEditorModule,
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
  FlPortalModule,
  FlRadioButtonBigModule,
  FlResizeModule,
  FlSearchModule,
  FlSectionModule,
  FlSnackBarModule,
  FlStatusModule,
  FlTagModule,
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
import {TeTextEditorModule} from '@monorepo/text-editor';
import {CoCommunityLibModule} from '@monorepo/community-lib';

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
    FlCodeEditorModule,

    //  Other lib
    BnBioNetworkModule,
    RvResourceViewModule,
    TdTechnicalDocModule,
    PrProtocolModule,
    SpSpreadsheetModule,
    ChChartModule,
    TeTextEditorModule,
    CoCommunityLibModule
  ]
})
export class LabCustomLibraryModule {
}
