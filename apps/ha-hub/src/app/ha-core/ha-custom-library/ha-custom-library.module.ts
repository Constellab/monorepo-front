import {NgModule} from '@angular/core';
import {
  FlArticleModule,
  FlAuthModule,
  FlCardModule, FlCodeEditorModule,
  FlCoreComponentModule,
  FlCoreDirectiveModule,
  FlCorePipeModule,
  FlDateModule,
  FlDialogModule,
  FlFormModule,
  FlIconModule, FlImageModule,
  FlInfiniteScrollModule, FlInputFileModule, FlInputSearchModule,
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
import {CoCommunityLibModule} from '@monorepo/community-lib';




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
    FlInputFileModule,
    FlInputSearchModule,
    FlCodeEditorModule,
    FlImageModule,

    //-------------------

    TdTechnicalDocModule,
    RvResourceViewModule,
    TeTextEditorModule,
    CoCommunityLibModule
  ]
})
export class HaCustomLibraryModule {

}
