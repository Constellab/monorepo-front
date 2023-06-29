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

    //-------------------

    TdTechnicalDocModule
  ]
})
export class HaCustomLibraryModule {

}
