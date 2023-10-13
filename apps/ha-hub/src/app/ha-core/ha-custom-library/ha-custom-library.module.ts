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
  FlMenuDynamicModule,
  FlPortalModule,
  FlSectionModule,
  FlSnackBarModule,
  FlTextEditorModule,
  FlTextIconModule,
  FlThemeModule,
  FlTranslateModule,
  FlUserModule
} from '@monorepo/front-core-lib';
import {TdTechnicalDocModule} from '@monorepo/technical-doc';
import {RvResourceViewModule} from '@monorepo/resource-view';

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
    FlTextEditorModule,
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

    //-------------------

    TdTechnicalDocModule,
    RvResourceViewModule
  ]
})
export class HaCustomLibraryModule {

}
