import { CommonModule, NgOptimizedImage } from '@angular/common';
import { inject, ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

import { coCommunityLibI18n } from './co-community-lib.i18n';
import { CoAgentCreateDialogFormComponent } from './component/co-agent-create-dialog-form/co-agent-create-dialog-form.component';
import { CoAgentListItemComponent } from './component/co-agent-list-item/co-agent-list-item.component';
import { CoBrickListItemComponent } from './component/co-brick-list-item/co-brick-list-item.component';
import { CoCommunityIconSelectDialogComponent } from './component/co-community-icon-select-dialog/co-community-icon-select-dialog.component';
import { CoCommunityListItemComponent } from './component/co-community-list-item/co-community-list-item.component';
import { CoCommunityListItemMainContentComponent } from './component/co-community-list-item-main-content/co-community-list-item-main-content.component';
import { CoIconListComponent } from './component/co-icon-list/co-icon-list.component';
import { CoStoryListItemComponent } from './component/co-story-list-item/co-story-list-item.component';
import { CoUpdateTypeIconContainerComponent } from './component/co-update-type-icon-container/co-update-type-icon-container.component';
import { CoUpdateTypeIconFormComponent } from './component/co-update-type-icon-dialog-form/co-update-type-icon-form.component';
import { CoVisibilityBadgeComponent } from './component/co-visibility-badge/co-visibility-badge.component';
import { CoConfig } from './service/co-service-config.config';

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
  constructor() {
    const translateService = inject(FlTranslateService);

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
