import {ModuleWithProviders, NgModule, Provider, Type} from '@angular/core';
import {
  FlCardModule,
  FlCoreDirectiveModule,
  FlCorePipeModule,
  FlDateModule,
  FlDialogModule,
  FlInfiniteScrollModule,
  FlKeyValueModule,
  FlLoaderModule,
  FlSectionModule,
  FlTextIconModule,
  FlTranslateModule,
  FlTranslateService,
  FlUserModule,
} from '@monorepo/front-core-lib';
import {coCommunityLibI18n} from './co-community-lib.i18n';
import {CoLiveTaskListItemComponent} from './component/co-live-task-list-item/co-live-task-list-item.component';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  CoLiveTaskCreateDialogFormComponent
} from './component/co-live-task-create-dialog-form/co-live-task-create-dialog-form.component';
import {CoCommunityListItemComponent} from './component/co-community-list-item/co-community-list-item.component';
import {
  CoCommunityListItemMainContentComponent
} from './component/co-community-list-item-main-content/co-community-list-item-main-content.component';
import {CoVisibilityBadgeComponent} from './component/co-visibility-badge/co-visibility-badge.component';
import {MatIconModule} from '@angular/material/icon';
import {CoStoryListItemComponent} from './component/co-story-list-item/co-story-list-item.component';
import {MatChipsModule} from '@angular/material/chips';
import {CoBrickListItemComponent} from './component/co-brick-list-item/co-brick-list-item.component';
import {TeTextEditorModule} from '@monorepo/text-editor';
import {CoServiceConfig} from './service/co-service-config.config';

@NgModule({
    imports: [
        CommonModule,
        FlDateModule,
        FlKeyValueModule,
        FlTranslateModule,
        FlUserModule,
        MatButtonModule,
        FlCoreDirectiveModule,
        FlCorePipeModule,
        FlDialogModule,
        FlLoaderModule,
        MatDialogActions,
        MatDialogContent,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        ReactiveFormsModule,
        FlSectionModule,
        FlTextIconModule,
        MatIconModule,
        MatChipsModule,
        FlInfiniteScrollModule,
        TeTextEditorModule,
        FormsModule,
        FlCardModule,
        NgOptimizedImage
    ],
  declarations: [
    CoLiveTaskListItemComponent,
    CoLiveTaskCreateDialogFormComponent,
    CoCommunityListItemComponent,
    CoCommunityListItemMainContentComponent,
    CoVisibilityBadgeComponent,
    CoStoryListItemComponent,
    CoBrickListItemComponent
  ],
  exports: [
    CoLiveTaskListItemComponent,
    CoLiveTaskCreateDialogFormComponent,
    CoCommunityListItemComponent,
    CoCommunityListItemMainContentComponent,
    CoVisibilityBadgeComponent,
    CoStoryListItemComponent,
    CoBrickListItemComponent
  ],
})
export class CoCommunityLibModule {
  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation('CoCommunityLibModule', coCommunityLibI18n);
  }

  public static forRoot(apiServiceConfig: Type<CoServiceConfig>): ModuleWithProviders<CoCommunityLibModule> {

    const providers: Provider[] = [
      {provide: CoServiceConfig, useClass: apiServiceConfig}
    ];

    return {
      ngModule: CoCommunityLibModule,
      providers: providers
    };
  }
}
