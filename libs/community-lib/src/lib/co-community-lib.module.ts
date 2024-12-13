import { ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import {
  FlCardModule,
  FlColorModule,
  FlCoreDirectiveModule,
  FlCorePipeModule,
  FlDateModule,
  FlDialogModule,
  FlIconModule,
  FlInfiniteScrollModule,
  FlKeyValueModule,
  FlLoaderModule,
  FlSectionModule,
  FlTextIconModule,
  FlTranslateModule,
  FlTranslateService,
  FlUserModule,
} from '@monorepo/front-core-lib';
import { coCommunityLibI18n } from './co-community-lib.i18n';
import { CoAgentListItemComponent } from './component/co-agent-list-item/co-agent-list-item.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoAgentCreateDialogFormComponent } from './component/co-agent-create-dialog-form/co-agent-create-dialog-form.component';
import { CoCommunityListItemComponent } from './component/co-community-list-item/co-community-list-item.component';
import { CoCommunityListItemMainContentComponent } from './component/co-community-list-item-main-content/co-community-list-item-main-content.component';
import { CoVisibilityBadgeComponent } from './component/co-visibility-badge/co-visibility-badge.component';
import { MatIconModule } from '@angular/material/icon';
import { CoStoryListItemComponent } from './component/co-story-list-item/co-story-list-item.component';
import { MatChipsModule } from '@angular/material/chips';
import { CoBrickListItemComponent } from './component/co-brick-list-item/co-brick-list-item.component';
import { CoConfig } from './service/co-service-config.config';
import { CoUpdateTypeIconContainerComponent } from './component/co-update-type-icon-container/co-update-type-icon-container.component';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { CoUpdateTypeIconFormComponent } from './component/co-update-type-icon-dialog-form/co-update-type-icon-form.component';
import { CoCommunityIconSelectDialogComponent } from './component/co-community-icon-select-dialog/co-community-icon-select-dialog.component';
import { CoIconListComponent } from './component/co-icon-list/co-icon-list.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';

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
    FormsModule,
    FlCardModule,
    NgOptimizedImage,
    FlIconModule,
    TdTechnicalDocModule,
    MatTooltip,
    FlColorModule,
    MatDivider,
  ],
  declarations: [
    CoAgentListItemComponent,
    CoAgentCreateDialogFormComponent,
    CoCommunityListItemComponent,
    CoCommunityListItemMainContentComponent,
    CoVisibilityBadgeComponent,
    CoStoryListItemComponent,
    CoBrickListItemComponent,
    CoUpdateTypeIconContainerComponent,
    CoUpdateTypeIconFormComponent,
    CoCommunityIconSelectDialogComponent,
    CoIconListComponent,
  ],
  exports: [
    CoAgentListItemComponent,
    CoAgentCreateDialogFormComponent,
    CoCommunityListItemComponent,
    CoCommunityListItemMainContentComponent,
    CoVisibilityBadgeComponent,
    CoStoryListItemComponent,
    CoBrickListItemComponent,
    CoUpdateTypeIconContainerComponent,
    CoUpdateTypeIconFormComponent,
    CoIconListComponent,
  ],
})
export class CoCommunityLibModule {
  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation('CoCommunityLibModule', coCommunityLibI18n);
  }

  public static forRoot(apiServiceConfig: Type<CoConfig>): ModuleWithProviders<CoCommunityLibModule> {
    const providers: Provider[] = [{ provide: CoConfig, useClass: apiServiceConfig }];

    return {
      ngModule: CoCommunityLibModule,
      providers: providers,
    };
  }
}
