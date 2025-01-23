import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlFormulaComponent } from './fl-formula/fl-formula.component';
import { FlFormulaDialogComponent } from './fl-formula-dialog/fl-formula-dialog.component';
import { FlDialogModule } from '../fl-dialog/fl-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flFormulaI18n } from './fl-formula.i18n';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlTextIconModule } from '../fl-text-icon/fl-text-icon.module';
import { MatIconModule } from '@angular/material/icon';

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
