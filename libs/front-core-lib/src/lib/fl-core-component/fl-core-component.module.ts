import { CommonModule, NgOptimizedImage } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlIconModule } from '../fl-svg-icon/fl-icon.module';
import { FlTextIconModule } from '../fl-text-icon/fl-text-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlChipComponent } from './component/fl-chip/fl-chip.component';
import { FlErrorTextComponent } from './component/fl-error-text/fl-error-text.component';
import { FlExternalLinkComponent } from './component/fl-external-link/fl-external-link.component';
import { FlFileTextIconComponent } from './component/fl-file-text-icon/fl-file-text-icon.component';
import { FlInfoBannerComponent } from './component/fl-info-banner/fl-info-banner.component';
import { FlLimitHeightComponent } from './component/fl-limit-height/fl-limit-height.component';
import { FlPasswordHiddenComponent } from './component/fl-password-hidden/fl-password-hidden.component';
import { FlPinUnpinButtonComponent } from './component/fl-pin-unpin-button/fl-pin-unpin-button.component';
import { FlPoweredByConstellabComponent } from './component/fl-powered-by-constellab/fl-powered-by-constellab.component';
import { FlSelectLanguageOptionsComponent } from './component/fl-select-language-options/fl-select-language-options.component';
import { FlSelectUserCategoryOptionComponent } from './component/fl-select-user-category-option/fl-select-user-category-option.component';
import { FL_CORE_COMPONENT_I18N } from './i18n/fl-core-component.i18n';

/**
 * Core modules containing components
 */
@NgModule({
  declarations: [
    FlLimitHeightComponent,
    FlChipComponent,
    FlSelectLanguageOptionsComponent,
    FlExternalLinkComponent,
    FlSelectUserCategoryOptionComponent,
    FlErrorTextComponent,
    FlPinUnpinButtonComponent,
    FlFileTextIconComponent,
    FlPasswordHiddenComponent,
    FlPoweredByConstellabComponent,
    FlInfoBannerComponent,
  ],
  exports: [
    FlLimitHeightComponent,
    FlChipComponent,
    FlSelectLanguageOptionsComponent,
    FlExternalLinkComponent,
    FlSelectUserCategoryOptionComponent,
    FlErrorTextComponent,
    FlPinUnpinButtonComponent,
    FlFileTextIconComponent,
    FlPasswordHiddenComponent,
    FlPoweredByConstellabComponent,
    FlInfoBannerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    FlLoaderModule,
    FlTranslateModule,
    FlCorePipeModule,
    FlCoreDirectiveModule,

    // Material
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    FlTextIconModule,
    FlIconModule,
    NgOptimizedImage,
  ],
})
export class FlCoreComponentModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlCoreComponentModule', FL_CORE_COMPONENT_I18N);
  }
}
