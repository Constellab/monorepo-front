import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FlDialogHeaderComponent } from './component/fl-dialog-header/fl-dialog-header.component';
import { FlConfirmDialogComponent } from './component/fl-confirm-dialog/fl-confirm-dialog.component';
import { FlDialogService } from './fl-dialog.service';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlSnackBarModule } from '../fl-snack-bar/fl-snack-bar.module';
import { FlDialogHeaderActionsComponent } from './component/fl-dialog-header-actions/fl-dialog-header-actions.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlTranslateService } from '../fl-translate/service/fl-translate.service';
import { flDialogI18n } from './fl-dialog.i18n';
import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';

/**
 * Core modules containing components
 */
@NgModule({
  declarations: [FlConfirmDialogComponent, FlDialogHeaderComponent, FlDialogHeaderActionsComponent],
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

  constructor(translateServie: FlTranslateService) {
    translateServie.addModuleTranslation('flDialog', flDialogI18n);
  }
}
