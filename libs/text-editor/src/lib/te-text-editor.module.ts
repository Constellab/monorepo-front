import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TeTextEditorComponent } from './component/te-text-editor/te-text-editor.component';
import { TeFormulaComponent } from './component/te-formula/te-formula.component';
import {
  FlCodeEditorModule,
  FlCoreComponentModule,
  FlCoreDirectiveModule,
  FlCorePipeModule,
  FlDateModule,
  FlDialogModule,
  FlEmojiPickerModule,
  FlFormulaModule,
  FlImageModule,
  FlInfiniteScrollModule,
  FlInputFileModule,
  FlLoaderModule,
  FlPortalModule,
  FlResizeModule,
  FlTextIconModule,
  FlTranslateModule,
  FlTranslateService,
  FlUserModule
} from '@monorepo/front-core-lib';
import { TeTitleCaptionComponent } from './component/te-title-caption/te-title-caption.component';
import { teTextEditorI18n } from './te-text-editor.i18n';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeLinkDialogComponent } from './component/te-link-dialog/te-link-dialog.component';
import { TeVideoComponent } from './component/te-video/te-video.component';
import { TeFigureComponent } from './component/te-figure/te-figure.component';
import { TeCodeComponent } from './component/te-code/te-code.component';
import { TeRichTextIsEmptyPipe } from './pipe/te-rich-text-is-empty/te-rich-text-is-empty.pipe';
import { TeVariableFormDialogComponent } from './component/te-variable-form-dialog/te-variable-form-dialog.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  TeTextEditorBrowserSideComponent
} from './component/te-text-editor-browser-side/te-text-editor-browser-side.component';
import {
  TeTextEditorServerSideComponent
} from './component/te-text-editor-server-side/te-text-editor-server-side.component';
import { createCustomElement } from '@angular/elements';
import { TeVariableInlineComponent } from './component/te-variable-inline/te-variable-inline.component';
import { teVariableTagName } from './model/te-variable.class';
import { TeMentionPortalComponent } from './component/te-mention-portal/te-mention-portal.component';
import { TeMentionInlineComponent } from './component/te-mention-inline/te-mention-inline.component';
import { teMentionTagName } from './plugin/te-mention.class';
import { TeFileComponent } from './component/te-file/te-file.component';
import {
  TeTextEditorHistoryPortalComponent
} from './component/te-text-editor-history-portal/te-text-editor-history-portal.component';
import {
  TeTextEditorHistoryModificationVisualizerDialogComponent
} from './component/te-text-editor-history-modification-visualizer-dialog/te-text-editor-history-modification-visualizer-dialog.component';
import {
  TeTextEditorHistoryModificationGroupComponent
} from './component/te-text-editor-history-modification-group/te-text-editor-history-modification-group.component';
import {
  TeTextEditorHistoryModificationComponent
} from './component/te-text-editor-history-modification/te-text-editor-history-modification.component';
import { TeFilesListComponent } from './component/te-files-list/te-files-list.component';
import { TeTitlesListComponent } from './component/te-titles-list/te-titles-list.component';
import { RouterLink } from '@angular/router';
import {
  TeAudioTranscriptionDialogComponent
} from './component/te-audio-transcription-dialog/te-audio-transcription-dialog.component';
import { MatDivider } from '@angular/material/divider';

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
    TeVariableFormDialogComponent,
    TeVariableInlineComponent,
    TeMentionPortalComponent,
    TeMentionInlineComponent,
    TeFileComponent,
    TeTextEditorHistoryPortalComponent,
    TeTextEditorHistoryModificationVisualizerDialogComponent,
    TeTextEditorHistoryModificationGroupComponent,
    TeTextEditorHistoryModificationComponent,
    TeFilesListComponent,
    TeTitlesListComponent,
    TeAudioTranscriptionDialogComponent
  ],
  exports: [
    TeTextEditorComponent,
    TeTitleCaptionComponent,
    TeRichTextIsEmptyPipe,
    TeTextEditorBrowserSideComponent,
    TeTextEditorServerSideComponent,
    TeTextEditorHistoryPortalComponent,
    TeFilesListComponent,
    TeTitlesListComponent
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
    FlEmojiPickerModule,
    FlInfiniteScrollModule,
    FlUserModule,
    FlPortalModule,
    FlCoreComponentModule,
    FlDateModule,
    FlTextIconModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatDivider,

    RouterLink,
  ]
})
export class TeTextEditorModule {
  static init: boolean = false;

  constructor(
    translateService: FlTranslateService,
    injector: Injector,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    translateService.addModuleTranslation(
      'TeTextEditorModule',
      teTextEditorI18n
    );

    if (!TeTextEditorModule.init) {
      if (isPlatformBrowser(platformId)) {
        customElements.define(
          teVariableTagName,
          createCustomElement(TeVariableInlineComponent, {injector: injector})
        );

        customElements.define(
          teMentionTagName,
          createCustomElement(TeMentionInlineComponent, {injector: injector})
        );

        // use to fix the error Unable to preventDefault inside passive event listener invocation.
        // we create a custom event listener call before all others with passive false so the
        // text editor is using this listener and not another one with passive true
        // this is a dirty fix
        document.addEventListener('keydown', () => {
        }, {
          passive: false,
          capture: true,
        });
      }
      TeTextEditorModule.init = true;
    }
  }
}
