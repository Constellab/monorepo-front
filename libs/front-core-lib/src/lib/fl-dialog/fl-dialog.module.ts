import { CommonModule } from '@angular/common';
import { inject,ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlWarningDialogComponent } from './component/fl-warning-dialog/fl-warning-dialog.component';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlSnackBarModule } from '../fl-snack-bar/fl-snack-bar.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlConfirmDialogComponent } from './component/fl-confirm-dialog/fl-confirm-dialog.component';
import { FlDialogHeaderComponent } from './component/fl-dialog-header/fl-dialog-header.component';
import { FlDialogHeaderActionsComponent } from './component/fl-dialog-header-actions/fl-dialog-header-actions.component';
import { flDialogI18n } from './fl-dialog.i18n';
import { FlDialogService } from './fl-dialog.service';

/**
 * Core modules containing components
 */
@NgModule({
  declarations: [
    FlConfirmDialogComponent,
    FlDialogHeaderComponent,
    FlDialogHeaderActionsComponent,
    FlWarningDialogComponent,
  ],
  exports: [FlDialogHeaderComponent, FlDialogHeaderActionsComponent, MatDialogModule],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FlLoaderModule,
    FlTranslateModule,
    FlSnackBarModule,

    // Material
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FlCorePipeModule,
  ],
})
export class FlDialogModule {
  public static forRoot(): ModuleWithProviders<FlDialogModule> {
    return {
      ngModule: FlDialogModule,
      providers: [FlDialogService],
    };
  }

  constructor() {
    const translateServie = inject(FlTranslateService);

    translateServie.addModuleTranslation('flDialog', flDialogI18n);
  }
}
