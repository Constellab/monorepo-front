import { inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { TeTextEditorComponent } from './component/te-text-editor/te-text-editor.component';
import { TeFormulaComponent } from './component/te-formula/te-formula.component';
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
import { TeTextEditorBrowserSideComponent } from './component/te-text-editor-browser-side/te-text-editor-browser-side.component';
import { TeTextEditorServerSideComponent } from './component/te-text-editor-server-side/te-text-editor-server-side.component';
import { createCustomElement } from '@angular/elements';
import { TeVariableInlineComponent } from './component/te-variable-inline/te-variable-inline.component';
import { teVariableTagName } from './model/te-variable.class';
import { TeMentionPortalComponent } from './component/te-mention-portal/te-mention-portal.component';
import { TeMentionInlineComponent } from './component/te-mention-inline/te-mention-inline.component';
import { teMentionTagName } from './plugin/te-mention.class';
import { TeFileComponent } from './component/te-file/te-file.component';
import { TeTextEditorHistoryPortalComponent } from './component/te-text-editor-history-portal/te-text-editor-history-portal.component';
import { TeTextEditorHistoryModificationVisualizerDialogComponent } from './component/te-text-editor-history-modification-visualizer-dialog/te-text-editor-history-modification-visualizer-dialog.component';
import { TeTextEditorHistoryModificationGroupComponent } from './component/te-text-editor-history-modification-group/te-text-editor-history-modification-group.component';
import { TeTextEditorHistoryModificationComponent } from './component/te-text-editor-history-modification/te-text-editor-history-modification.component';
import { TeFilesListComponent } from './component/te-files-list/te-files-list.component';
import { TeTitlesListComponent } from './component/te-titles-list/te-titles-list.component';
import { RouterLink } from '@angular/router';
import { TeAudioTranscriptionDialogComponent } from './component/te-audio-transcription-dialog/te-audio-transcription-dialog.component';
import { MatDivider } from '@angular/material/divider';
import { TeTimestampComponent } from './component/te-timestamp/te-timestamp.component';
import { TeTimestampConfigDialogComponent } from './component/te-timestamp-config-dialog/te-timestamp-config-dialog.component';
import { TeTextEditorSaveComponent } from './component/te-text-editor-save/te-text-editor-save.component';
import { TeIframeComponent } from './component/te-iframe/te-iframe.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { TeFormulaInlineComponent } from './component/te-formula-inline/te-formula-inline.component';
import { TeFormulaInlineToolClass } from './inline-tool/te-formula-inline-tool.class';
import { TeEditBlockMetadataDialogComponent } from './component/te-edit-block-metadata-dialog/te-edit-block-metadata-dialog.component';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

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

    translateService.addModuleTranslation('TeTextEditorModule', teTextEditorI18n);

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
