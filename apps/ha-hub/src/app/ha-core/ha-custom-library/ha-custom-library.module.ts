import {NgModule} from '@angular/core';
import {
  FlArticleModule,
  FlAuthModule,
  FlCardModule,
  FlCoreComponentModule,
  FlCoreDirectiveModule,
  FlCorePipeModule,
  FlDateModule,
  FlDialogModule,
  FlFormModule,
  FlIconModule,
  FlInfiniteScrollModule,
  FlKeyValueModule,
  FlLoaderModule,
  FlMenuDynamicModule, FlPortalActionsModule,
  FlPortalModule,
  FlSectionModule,
  FlSnackBarModule,
  FlTextIconModule,
  FlThemeModule,
  FlTranslateModule,
  FlUserModule
} from '@monorepo/front-core-lib';
import {TdTechnicalDocModule} from '@monorepo/technical-doc';
import {RvResourceViewModule} from '@monorepo/resource-view';
import {TeTextEditorModule} from '@monorepo/text-editor';
import {LtLiveTaskModule} from '@monorepo/live-task';



@NgModule({
  exports: [
    FlCoreDirectiveModule,
    FlCorePipeModule,
    FlFormModule,
    FlPortalModule,
    FlLoaderModule,
    FlDialogModule,
    FlSnackBarModule,
    FlTranslateModule,
    FlSectionModule,
    FlAuthModule,
    FlMenuDynamicModule,
    FlIconModule,
    FlArticleModule,
    FlUserModule,
    FlTextIconModule,
    FlCoreComponentModule,
    FlCardModule,
    FlThemeModule,
    FlDateModule,
    FlKeyValueModule,
    FlInfiniteScrollModule,
    FlPortalActionsModule,

    //-------------------

    TdTechnicalDocModule,
    RvResourceViewModule,
    TeTextEditorModule,
    LtLiveTaskModule
  ]
})
export class HaCustomLibraryModule {

}
