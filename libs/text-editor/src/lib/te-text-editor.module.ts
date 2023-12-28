import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TeTextEditorComponent} from './component/te-text-editor/te-text-editor.component';
import {TeFormulaComponent} from './component/te-formula/te-formula.component';
import {
  FlCoreDirectiveModule,
  FlCorePipeModule,
  FlDialogModule,
  FlFormulaModule,
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

@NgModule({
  declarations: [
    TeTextEditorComponent,
    TeFormulaComponent,
    TeTitleCaptionComponent,
    TeLinkDialogComponent,
    TeVideoComponent,
  ],
  exports: [
    TeTextEditorComponent,
    TeFormulaComponent
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

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class TeTextEditorModule {
  private static registered: boolean = false;

  constructor(injector: Injector,
              translateService: FlTranslateService) {
    if (TeTextEditorModule.registered) return;
    translateService.addModuleTranslation('TeTextEditorModule', teTextEditorI18n);

    //
    // customElements.define(TeFormulaBlock.TAG_NAME,
    //   createCustomElement(TeFormulaComponent, {injector: injector}));

    TeTextEditorModule.registered = true;
  }
}
