import { TeHelper } from '../model/te.helper';
import { MenuConfig } from '@editorjs/editorjs/types/tools';
import { Observable } from 'rxjs';
import { TeBlockTune } from '../model/te-block-tune-factory.class';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TeAudioTranscriptionDialogComponent } from '../component/te-audio-transcription-dialog/te-audio-transcription-dialog.component';
import { TeRichText } from '../model/lib';

export interface TeAudioTranscriptionConfig {
  transcribeAudio: (audio: Blob) => Observable<TeRichText>;
}

/**
 * Block tune to record an audio to write text in the rich text editor
 */
export class TeAudioTranscriptionBlockTune extends TeBlockTune {
  render(): HTMLElement | MenuConfig {
    const button = TeHelper.generateTuneButton(
      TeHelper.getTranslateService().translate('teTextEditor.dictate'),
      'mic'
    );
    button.addEventListener('click', () => {
      this.openAudioDialog(this.config.block.id);
    });
    return button;
  }

  private openAudioDialog(blockId: string): void {
    const dialogService = this.envInjector.get(FlDialogService);
    dialogService
      .openSmallDialog(TeAudioTranscriptionDialogComponent, {
        data: this.additionalData as TeAudioTranscriptionConfig,
      })
      .afterClosed()
      .subscribe((result) => this.onClosedDialog(blockId, result));
  }

  private onClosedDialog(blockId: string, result?: TeRichText): void {
    if (result) {
      let index = this.config.api.blocks.getBlockIndex(blockId);
      for (const block of result.getBlocks()) {
        this.config.api.blocks.insert(block.type, block.data, null, index);
        index++;
      }
    }
  }
}
