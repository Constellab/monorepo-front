import { TeBlockTune, TeHelper, TeRichText } from '@monorepo/text-editor';
import { MenuConfig } from '@editorjs/editorjs/types/tools';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  LabNoteInsertTemplateDialogComponent,
  LabNoteInsertTemplateDialogData,
} from '../component/lab-note-insert-template-dialog/lab-note-insert-template-dialog.component';

export class LabNoteInsertTemplateBlockTuneConfig {
  noteId: string;
}

/**
 * Block tune add the option to insert a note template in the note rich text
 */
export class LabNoteInsertTemplateBlockTune extends TeBlockTune {
  render(): HTMLElement | MenuConfig {
    const button = TeHelper.generateTuneButton(
      TeHelper.getTranslateService().translate('biox.note_insert_note_template'),
      'description'
    );
    button.addEventListener('click', () => {
      this.openAudioDialog(this.config.block.id);
    });
    return button;
  }

  private openAudioDialog(blockId: string): void {
    const dialogService = this.envInjector.get(FlDialogService);
    const data: LabNoteInsertTemplateDialogData = {
      noteId: this.getConfig().noteId,
      blockIndex: this.config.api.blocks.getBlockIndex(blockId),
    };
    dialogService
      .openSmallDialog(LabNoteInsertTemplateDialogComponent, {
        data: data,
      })
      .afterClosed()
      .subscribe((result) => this.onClosedDialog(result));
  }

  private onClosedDialog(content: TeRichText): void {
    if (content) {
      this.config.api.blocks.render(content.toHTMLEditorJson());
    }
  }

  private getConfig(): LabNoteInsertTemplateBlockTuneConfig {
    return this.additionalData;
  }
}
