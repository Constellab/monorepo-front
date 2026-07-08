import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlPortalModule } from '../fl-portal/fl-portal.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlColorPickerComponent } from './component/fl-color-picker/fl-color-picker.component';
import { FlColorSelectorComponent } from './component/fl-color-selector/fl-color-selector.component';
import { FlColorSelectorPortalComponent } from './component/fl-color-selector-portal/fl-color-selector-portal.component';
import { FlColorSelectorDirective } from './directive/fl-color-selector.directive';
import { FL_COLOR_I18N } from './i18n/fl-color.i18n';
import { FlContrastColorPipe } from './pipe/fl-contrast-color/fl-contrast-color.pipe';
import { FlStringToRgbPipe } from './pipe/fl-string-to-rgb/fl-string-to-rgb.pipe';

@NgModule({
  declarations: [
    FlColorSelectorComponent,
    FlColorSelectorPortalComponent,
    FlColorSelectorDirective,
    FlStringToRgbPipe,
    FlContrastColorPipe,
    FlColorPickerComponent,
  ],
  exports: [
    FlColorSelectorComponent,
    FlColorSelectorDirective,
    FlStringToRgbPipe,
    FlContrastColorPipe,
    FlColorPickerComponent,
  ],
  imports: [CommonModule, FormsModule, MatIconModule, FlPortalModule, FlTranslateModule, MatTooltip],
})
export class FlColorModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlColorModule', FL_COLOR_I18N);
  }
}
