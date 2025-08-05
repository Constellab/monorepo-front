import { CommonModule } from '@angular/common';
import { inject,NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlDialogModule } from '../fl-dialog/fl-dialog.module';
import { FlTextIconModule } from '../fl-text-icon/fl-text-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { flFormulaI18n } from './fl-formula.i18n';
import { FlFormulaComponent } from './fl-formula/fl-formula.component';
import { FlFormulaDialogComponent } from './fl-formula-dialog/fl-formula-dialog.component';

@NgModule({
  declarations: [FlFormulaComponent, FlFormulaComponent, FlFormulaDialogComponent],
  exports: [FlFormulaComponent, FlFormulaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FlDialogModule,
    FlTranslateModule,
    FlCorePipeModule,
    FlCoreDirectiveModule,
    FlTextIconModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class FlFormulaModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlFormulaModule', flFormulaI18n);
  }
}
