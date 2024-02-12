import {OutputData} from '@editorjs/editorjs';
import {ClHelpService} from '@monorepo/core-lib';

export type TeRichTextContent = OutputData;

export enum TeBlockType {
  PARAGRAPH = 'paragraph',
}

export class TeRichText {

  public static emptyContent(): TeRichTextContent {
    return {
      time: new Date().getTime(),
      blocks: [],
      version: '2.28.2'
    };
  }

  public static isEmpty(content: TeRichTextContent): boolean {
    if (ClHelpService.isNullOrEmpty(content) || ClHelpService.isNullOrEmpty(content.blocks)) return true;

    // check if all block are paragraph and contain only spaces or empty string
    const allParagraph = content.blocks.every(block => block.type === TeBlockType.PARAGRAPH);
    if (!allParagraph) return false;

    return content.blocks.every(block => {
      return ClHelpService.isNullOrEmpty(block.data) || ClHelpService.isNullOrEmpty(block.data.text) ||
        ClHelpService.isNullOrEmpty(block.data.text.trim());
    });
  }

  public static getFirstParagraphsText(content: TeRichTextContent): string {
    if (TeRichText.isEmpty(content)) return null;
    let result = '';
    const paragraphBlocks = content.blocks.filter(block => block.type === TeBlockType.PARAGRAPH);
    if (paragraphBlocks.length === 0) return null;
    for (const block of paragraphBlocks) {

      if (block.data && block.data.text && block.data.text.trim() !== ''){
        if (result.length + block.data.text.trim().length > 200){
          result += block.data.text.trim().substring(0, 200 - result.length) + '...';
          break;
        }
        result += block.data.text.trim() + ' ';
      }
    }
    return result.replace(/<[^>]*>/g, '');
  }
}
