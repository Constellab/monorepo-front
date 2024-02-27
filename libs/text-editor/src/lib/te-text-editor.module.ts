import {Injector, NgModule} from '@angular/core';
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
  FlTranslateService,
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
import {TeRichTextIsEmptyPipe} from './pipe/te-rich-text-is-empty/te-rich-text-is-empty.pipe';
import {TeVariableFormComponent} from './component/te-variable-form/te-variable-form.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {
  TeTextEditorBrowserSideComponent
} from './component/te-text-editor-browser-side/te-text-editor-browser-side.component';
import {
  TeTextEditorServerSideComponent
} from './component/te-text-editor-server-side/te-text-editor-server-side.component';
import {createCustomElement} from '@angular/elements';
import {TeVariableInlineComponent} from './component/te-variable-inline/te-variable-inline.component';
import {teVariableTagName} from './model/te-variable.class';

@NgModule({
  declarations: [
    TeTextEditorComponent,
    TeFormulaComponent,
    TeTitleCaptionComponent,
    TeLinkDialogComponent,
    TeVideoComponent,
    TeFigureComponent,
    TeCodeComponent,
    TeRichTextIsEmptyPipe,
    TeTextEditorBrowserSideComponent,
    TeTextEditorServerSideComponent,
    TeVariableFormComponent,
    TeVariableInlineComponent,
  ],
  exports: [
    TeTextEditorComponent,
    TeTitleCaptionComponent,
    TeRichTextIsEmptyPipe,
    TeTextEditorBrowserSideComponent,
    TeTextEditorServerSideComponent
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
    MatOptionModule,
    MatSelectModule,
  ],
})
export class TeTextEditorModule {

  static init: boolean = false;

  constructor(translateService: FlTranslateService,
              injector: Injector) {
    translateService.addModuleTranslation(
      'TeTextEditorModule',
      teTextEditorI18n
    );

    if (!TeTextEditorModule.init) {
      customElements.define(
        teVariableTagName,
        createCustomElement(TeVariableInlineComponent, {injector: injector})
      );
      TeTextEditorModule.init = true;
    }
  }
}
