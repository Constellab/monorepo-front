import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlLimitHeightComponent } from './component/fl-limit-height/fl-limit-height.component';
import {
  FlNewWebsiteVersionComponent,
} from './component/fl-new-website-version/fl-new-website-version.component';
import { FlChipComponent } from './component/fl-chip/fl-chip.component';
import { MatIconModule } from '@angular/material/icon';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import {
  FlSelectLanguageOptionsComponent,
} from './component/fl-select-language-options/fl-select-language-options.component';
import { FlExternalLinkComponent } from './component/fl-external-link/fl-external-link.component';
import {
  FlSelectUserCategoryOptionComponent,
} from './component/fl-select-user-category-option/fl-select-user-category-option.component';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flCoreComponentI18n } from './i18n/fl-core-component.i18n';
import { FlErrorTextComponent } from './component/fl-error-text/fl-error-text.component';
import { FlPinUnpinButtonComponent } from './component/fl-pin-unpin-button/fl-pin-unpin-button.component';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FlFileTextIconComponent } from './component/fl-file-text-icon/fl-file-text-icon.component';
import { FlTextIconModule } from '../fl-text-icon/fl-text-icon.module';
import { FlIconModule } from '../fl-svg-icon/fl-icon.module';
import { FlPasswordHiddenComponent } from './component/fl-password-hidden/fl-password-hidden.component';

/**
 * Core modules containing components
 */
@NgModule({
  declarations: [
    FlLimitHeightComponent,
    FlNewWebsiteVersionComponent,
    FlChipComponent,
    FlSelectLanguageOptionsComponent,
    FlExternalLinkComponent,
    FlSelectUserCategoryOptionComponent,
    FlErrorTextComponent,
    FlPinUnpinButtonComponent,
    FlFileTextIconComponent,
    FlPasswordHiddenComponent,
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
  ],
})
export class FlCoreComponentModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlCoreComponentModule', flCoreComponentI18n);
  }
}
