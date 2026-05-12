import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FL_RESIZE_I18N } from './fl-resize.i18n';
import { FlResizeDirective } from './fl-resize/fl-resize.directive';
import { FlResizePortalFullscreenButtonComponent } from './fl-resize-fullscreen-button/fl-resize-portal-fullscreen-button.component';

@NgModule({
  declarations: [FlResizePortalFullscreenButtonComponent, FlResizeDirective],
  exports: [FlResizePortalFullscreenButtonComponent, FlResizeDirective],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, FlTranslateModule],
})
export class FlResizeModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlResizeModule', FL_RESIZE_I18N);
  }
}
