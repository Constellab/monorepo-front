import { CommonModule } from '@angular/common';
import { inject,NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlDragModule } from '../fl-drag/fl-drag.module';
import { FlSnackBarModule } from '../fl-snack-bar/fl-snack-bar.module';
import { FlIconModule } from '../fl-svg-icon/fl-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlInputFileDirective } from './fl-input-file.directive';
import { FlInputFileContainerComponent } from './fl-input-file-container/fl-input-file-container.component';
import { FlInputFileIconContainerComponent } from './fl-input-file-icon-container/fl-input-file-icon-container.component';
import { FL_FILE_INPUT_I18N } from './i18n/fl-input-file.i18n';

/**
 * Form input to manage file
 */
@NgModule({
  declarations: [FlInputFileContainerComponent, FlInputFileDirective, FlInputFileIconContainerComponent],
  exports: [FlInputFileDirective, FlInputFileContainerComponent, FlInputFileIconContainerComponent],
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatRippleModule,

    FlDragModule,
    FlTranslateModule,
    FlIconModule,
    FlSnackBarModule,
  ],
})
export class FlInputFileModule {
  constructor() {
    const translateServie = inject(FlTranslateService);

    translateServie.addModuleTranslation('FlInputFileModule', FL_FILE_INPUT_I18N);
  }
}
