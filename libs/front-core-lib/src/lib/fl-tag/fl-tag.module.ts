import { inject, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlTagInputComponent } from './component/fl-tag-input/fl-tag-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flTagI18n } from './fl-tag.i18n';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlTagService } from './fl-tag.class';
import { FlTagComponent } from './component/fl-tag/fl-tag.component';
import { FlDialogModule } from '../fl-dialog/fl-dialog.module';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlTagListComponent } from './component/fl-tag-list/fl-tag-list.component';
import { FlTagsSelectColorsComponent } from './component/fl-tags-select-colors/fl-tags-select-colors.component';
import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';

import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlColorModule } from '../fl-color/fl-color.module';
import { FlTagColorPipe } from './pipe/fl-tag-color.pipe';
import { MatRippleModule } from '@angular/material/core';
import { FlTagsToListPipe } from './pipe/fl-tags-to-list.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlTagValueToStringPipe } from './pipe/fl-tag-value-to-string.pipe';
import { FlAddTagInputComponent } from './component/fl-add-tag-input/fl-add-tag-input.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';

@NgModule({
  declarations: [
    FlTagInputComponent,
    FlTagComponent,
    FlTagListComponent,
    FlTagsSelectColorsComponent,
    FlTagColorPipe,
    FlTagsToListPipe,
    FlTagValueToStringPipe,
    FlAddTagInputComponent,
  ],
  exports: [
    FlTagInputComponent,
    FlTagComponent,
    FlTagListComponent,
    FlTagsSelectColorsComponent,
    FlTagColorPipe,
    FlTagsToListPipe,
    FlTagValueToStringPipe,
    FlAddTagInputComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    MatCheckboxModule,

    FlTranslateModule,
    FlDialogModule,
    FlLoaderModule,
    FlCoreDirectiveModule,
    FlCorePipeModule,
    FlCoreComponentModule,
    FlColorModule,
    FlInfiniteScrollModule,
  ],
})
export class FlTagModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlTagModule', flTagI18n);
  }

  /**
   * Use this method in your root module to provide a tag service globally
   * Otherwise it is possible to provide the service when using the fl-add-tag-input component
   * @param tagService
   */
  public static forRoot(tagService: Type<FlTagService>): ModuleWithProviders<FlTagModule> {
    return {
      ngModule: FlTagModule,
      providers: [
        {
          provide: FlTagService,
          useClass: tagService,
        },
      ],
    };
  }
}
