import { TeHelper } from '../model/te.helper';
import { MenuConfig } from '@editorjs/editorjs/types/tools';
import { TeRichTextContent } from '../model/te-rich-text.class';
import { Observable } from 'rxjs';
import { TeBlockTune } from '../model/te-block-tune-factory.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  TeAudioTranscriptionDialogComponent
} from '../component/te-audio-transcription-dialog/te-audio-transcription-dialog.component';

export interface TeAudioTranscriptionConfig {
  transcribeAudio: (audio: Blob) => Observable<TeRichTextContent>;
}

/**
 * Block tune to record an audio to write text in the rich text editor
 */
export class TeAudioTranscriptionBlockTune extends TeBlockTune {

  render(): HTMLElement | MenuConfig {
    const button = TeHelper.generateTuneButton(TeHelper.getTranslateService().translate('teTextEditor.dictate'), 'mic');
    button.addEventListener('click', () => {
      this.openAudioDialog(this.config.block.id);
    });
    return button;
  }

  private openAudioDialog(blockId: string): void {
    const dialogService = this.envInjector.get(FlDialogService);
    dialogService.openSmallDialog(TeAudioTranscriptionDialogComponent, {
      data: this.additionalData as TeAudioTranscriptionConfig
    }).afterClosed().subscribe((result) => this.onClosedDialog(blockId, result));
  }

  private onClosedDialog(blockId: string, result?: TeRichTextContent): void {
    if (result) {
      let index = this.config.api.blocks.getBlockIndex(blockId);
      for (const block of result.blocks) {
        this.config.api.blocks.insert(block.type, block.data, null, index);
        index++;
      }
    }
  }

}
