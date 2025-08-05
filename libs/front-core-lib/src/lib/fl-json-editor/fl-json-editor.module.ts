import { CommonModule } from '@angular/common';
import { inject,NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlDialogModule } from '../fl-dialog/fl-dialog.module';
import { FlSnackBarModule } from '../fl-snack-bar/fl-snack-bar.module';
import { FlTextIconModule } from '../fl-text-icon/fl-text-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlPrettyJsonComponent } from './fl-pretty-json/fl-pretty-json.component';
import { FlPrettyJsonDialogComponent } from './fl-pretty-json-dialog/fl-pretty-json-dialog.component';
import { flJsonEditorI18n } from './i18n/fl-json-editor.i18n';

/**
 * Module containing a component to edit json in html
 */
@NgModule({
  declarations: [FlPrettyJsonComponent, FlPrettyJsonDialogComponent],
  exports: [FlPrettyJsonComponent, FlPrettyJsonDialogComponent],
  imports: [
    CommonModule,

    MatDialogModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,

    FlTextIconModule,
    FlDialogModule,
    FlTranslateModule,
    FlSnackBarModule,
    FlCoreDirectiveModule,
  ],
})
export class FlJsonEditorModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlJsonEditorModule', flJsonEditorI18n);
  }
}
