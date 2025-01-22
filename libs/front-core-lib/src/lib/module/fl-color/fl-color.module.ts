import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlColorSelectorComponent } from './component/fl-color-selector/fl-color-selector.component';
import { MatIconModule } from '@angular/material/icon';
import { FlColorSelectorPortalComponent } from './component/fl-color-selector-portal/fl-color-selector-portal.component';
import { FlPortalModule } from '../fl-portal/fl-portal.module';
import { FormsModule } from '@angular/forms';
import { FlColorSelectorDirective } from './directive/fl-color-selector.directive';
import { FlStringToRgbPipe } from './pipe/fl-string-to-rgb/fl-string-to-rgb.pipe';
import { FlColorPickerComponent } from './component/fl-color-picker/fl-color-picker.component';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlTranslateService } from '../fl-translate/service/fl-translate.service';
import { flColorI18n } from './i18n/fl-color.i18n';
import { MatTooltip } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    FlColorSelectorComponent,
    FlColorSelectorPortalComponent,
    FlColorSelectorDirective,
    FlStringToRgbPipe,
    FlColorPickerComponent,
  ],
  exports: [FlColorSelectorComponent, FlColorSelectorDirective, FlStringToRgbPipe, FlColorPickerComponent],
  imports: [CommonModule, FormsModule, MatIconModule, FlPortalModule, FlTranslateModule, MatTooltip],
})
export class FlColorModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlColorModule', flColorI18n);
  }
}
