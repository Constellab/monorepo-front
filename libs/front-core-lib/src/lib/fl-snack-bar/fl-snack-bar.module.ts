import { CommonModule } from '@angular/common';
import { inject, ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlSnackBarInfoComponent } from './component/fl-snack-bar-info/fl-snack-bar-info.component';
import { FL_SNACK_BAR_I18N } from './fl-snack-bar.i18n';
import { FlSnackBarService } from './fl-snack-bar.service';

/**
 * Core modules containing components
 */
@NgModule({
  declarations: [FlSnackBarInfoComponent],
  exports: [],
  imports: [
    CommonModule,

    FlTranslateModule,

    // Material
    MatSnackBarModule,
    MatButtonModule,
  ],
})
export class FlSnackBarModule {
  public static forRoot(): ModuleWithProviders<FlSnackBarModule> {
    return {
      ngModule: FlSnackBarModule,
      providers: [FlSnackBarService],
    };
  }

  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlSnackBarModule', FL_SNACK_BAR_I18N);
  }
}
