import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlCodeEditorModule } from '@monorepo/front-core-lib/fl-code-editor';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlEmojiPickerModule } from '@monorepo/front-core-lib/fl-emoji-picker';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlFormulaModule } from '@monorepo/front-core-lib/fl-formula';
import { FlImageModule } from '@monorepo/front-core-lib/fl-image';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { TeAudioTranscriptionDialogComponent } from './component/te-audio-transcription-dialog/te-audio-transcription-dialog.component';
import { TeCodeComponent } from './component/te-code/te-code.component';
import { TeEditBlockMetadataDialogComponent } from './component/te-edit-block-metadata-dialog/te-edit-block-metadata-dialog.component';
import { TeFigureComponent } from './component/te-figure/te-figure.component';
import { TeFileComponent } from './component/te-file/te-file.component';
import { TeFilesListComponent } from './component/te-files-list/te-files-list.component';
import { TeFormulaComponent } from './component/te-formula/te-formula.component';
import { TeFormulaInlineComponent } from './component/te-formula-inline/te-formula-inline.component';
import { TeIframeComponent } from './component/te-iframe/te-iframe.component';
import { TeLinkDialogComponent } from './component/te-link-dialog/te-link-dialog.component';
import { TeMentionInlineComponent } from './component/te-mention-inline/te-mention-inline.component';
import { TeMentionPortalComponent } from './component/te-mention-portal/te-mention-portal.component';
import { TeRawHtmlComponent } from './component/te-raw-html/te-raw-html.component';
import { TeTextEditorComponent } from './component/te-text-editor/te-text-editor.component';
import { TeTextEditorBrowserSideComponent } from './component/te-text-editor-browser-side/te-text-editor-browser-side.component';
import { TeTextEditorHistoryModificationComponent } from './component/te-text-editor-history-modification/te-text-editor-history-modification.component';
import { TeTextEditorHistoryModificationGroupComponent } from './component/te-text-editor-history-modification-group/te-text-editor-history-modification-group.component';
import { TeTextEditorHistoryModificationVisualizerDialogComponent } from './component/te-text-editor-history-modification-visualizer-dialog/te-text-editor-history-modification-visualizer-dialog.component';
import { TeTextEditorHistoryPortalComponent } from './component/te-text-editor-history-portal/te-text-editor-history-portal.component';
import { TeTextEditorSaveComponent } from './component/te-text-editor-save/te-text-editor-save.component';
import { TeTextEditorServerSideComponent } from './component/te-text-editor-server-side/te-text-editor-server-side.component';
import { TeTimestampComponent } from './component/te-timestamp/te-timestamp.component';
import { TeTimestampConfigDialogComponent } from './component/te-timestamp-config-dialog/te-timestamp-config-dialog.component';
import { TeTitleCaptionComponent } from './component/te-title-caption/te-title-caption.component';
import { TeTitlesListComponent } from './component/te-titles-list/te-titles-list.component';
import { TeVariableFormDialogComponent } from './component/te-variable-form-dialog/te-variable-form-dialog.component';
import { TeVariableInlineComponent } from './component/te-variable-inline/te-variable-inline.component';
import { TeVideoComponent } from './component/te-video/te-video.component';
import { TeFormulaInlineToolClass } from './inline-tool/te-formula-inline-tool.class';
import { teVariableTagName } from './model/te-variable.class';
import { TeRichTextIsEmptyPipe } from './pipe/te-rich-text-is-empty/te-rich-text-is-empty.pipe';
import { teMentionTagName } from './plugin/te-mention.class';
import { TE_TEXT_EDITOR_I18N } from './te-text-editor.i18n';

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
    TeAudioTranscriptionDialogComponent,
    TeTimestampComponent,
    TeTimestampConfigDialogComponent,
    TeTextEditorSaveComponent,
    TeIframeComponent,
    TeRawHtmlComponent,
    TeFormulaInlineComponent,
    TeEditBlockMetadataDialogComponent,
  ],
  exports: [
    TeTextEditorComponent,
    TeTitleCaptionComponent,
    TeRichTextIsEmptyPipe,
    TeTextEditorBrowserSideComponent,
    TeTextEditorServerSideComponent,
    TeTextEditorHistoryPortalComponent,
    TeFilesListComponent,
    TeTitlesListComponent,
    TeTextEditorSaveComponent,
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
    FlFormModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatDivider,
    MatOptionModule,

    RouterLink,
    NgOptimizedImage,
    MatDatepickerModule,
    MatTimepickerModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
  ],
})
export class TeTextEditorModule {
  static init: boolean = false;

  constructor() {
    const translateService = inject(FlTranslateService);
    const injector = inject(Injector);
    const platformId = inject(PLATFORM_ID);

    translateService.addModuleTranslation('TeTextEditorModule', TE_TEXT_EDITOR_I18N);

    if (!TeTextEditorModule.init) {
      if (isPlatformBrowser(platformId)) {
        customElements.define(
          teVariableTagName,
          createCustomElement(TeVariableInlineComponent, { injector: injector })
        );

        customElements.define(
          teMentionTagName,
          createCustomElement(TeMentionInlineComponent, { injector: injector })
        );

        customElements.define(
          TeFormulaInlineToolClass.TAG,
          createCustomElement(TeFormulaInlineComponent, { injector: injector })
        );
      }
      TeTextEditorModule.init = true;
    }
  }
}
