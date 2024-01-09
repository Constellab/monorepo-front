import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TeTextEditorComponent} from './component/te-text-editor/te-text-editor.component';
import {TeFormulaComponent} from './component/te-formula/te-formula.component';
import {
  FlCodeEditorModule,
  FlCoreDirectiveModule,
  FlCorePipeModule,
  FlDialogModule,
  FlFormulaModule,
  FlImageModule,
  FlInputFileModule,
  FlLoaderModule,
  FlResizeModule,
  FlTranslateModule,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {TeTitleCaptionComponent} from './component/te-title-caption/te-title-caption.component';
import {teTextEditorI18n} from './te-text-editor.i18n';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TeLinkDialogComponent} from './component/te-link-dialog/te-link-dialog.component';
import {TeVideoComponent} from './component/te-video/te-video.component';
import {TeFigureComponent} from './component/te-figure/te-figure.component';
import {TeCodeComponent} from './component/te-code/te-code.component';
import {TeTextEditorSsrComponent} from './component/te-text-editor-ssr/te-text-editor-ssr.component';

@NgModule({
  declarations: [
    TeTextEditorComponent,
    TeFormulaComponent,
    TeTitleCaptionComponent,
    TeLinkDialogComponent,
    TeVideoComponent,
    TeFigureComponent,
    TeCodeComponent,
    TeTextEditorSsrComponent,
  ],
  exports: [
    TeTextEditorComponent,
    TeTextEditorSsrComponent,
    TeTitleCaptionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FlFormulaModule,
    FlDialogModule,
    FlTranslateModule,
    FlCoreDirectiveModule,
    FlCorePipeModule,
    FlImageModule,
    FlResizeModule,
    FlInputFileModule,
    FlLoaderModule,
    FlCodeEditorModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class TeTextEditorModule {

  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation('TeTextEditorModule', teTextEditorI18n);
  }
}
