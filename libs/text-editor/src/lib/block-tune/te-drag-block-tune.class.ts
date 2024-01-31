import {API, BlockAPI, BlockTune, ToolConfig} from '@editorjs/editorjs';
import {TunesMenuConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {BlockTuneData} from '@editorjs/editorjs/types/block-tunes/block-tune-data';
import {TeHelper} from '../model/te.helper';
import {ClHelpService} from '@monorepo/core-lib';

/**
 * BLock tune to drag and drop blocks
 */
export class TeDragBlockTune implements BlockTune {

  constructor(private config: {
    api: API,
    config?: ToolConfig,
    block: BlockAPI,
    data: BlockTuneData
  }) {
  }


  static get isTune(): boolean {
    return true;
  }

  render(): HTMLElement | TunesMenuConfig {
    const button = TeHelper.generateTuneButton(TeHelper.getTranslateService().translate('teTextEditor.drag_block'), 'open_with')
    // enable drag and drop
    button.setAttribute('draggable', 'true');

    // no drag image
    button.addEventListener('dragstart', (event) => {
      event.dataTransfer.setDragImage(new Image(), 0, 0);
    });

    let blockId: string;

    // while dragging get the text editor drop target block id
    button.addEventListener('drag', (event) => {
      this.config.api.toolbar.close();
      blockId = TeHelper.getBlockDropTargetId(this.config.api.ui.nodes.redactor);
    });

    // handle the drop
    button.addEventListener('dragend', (event) => {
      ClHelpService.stopEventPropagation(event);
      if (blockId == null || blockId === this.config.block.id) return;
      // get the index of the drop position
      let newIndex = this.config.api.blocks.getBlockIndex(blockId);
      // get the index of current block
      const index = this.config.api.blocks.getBlockIndex(this.config.block.id);
      // when we move the element up, the target indicator is shifted down
      if (newIndex < index) newIndex++;
      this.config.api.blocks.move(newIndex, index);
    });

    return button;

  }


}
