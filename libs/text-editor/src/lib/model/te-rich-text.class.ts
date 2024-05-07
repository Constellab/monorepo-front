import {OutputData} from '@editorjs/editorjs';
import {ClHelpService} from '@monorepo/core-lib';
import {BlockToolData} from '@editorjs/editorjs/types/tools';
import {TeVariableFormInfo, teVariableTagName} from './te-variable.class';
import {TeElementInlineDirective} from './te-element.directive';

export type TeRichTextContent = OutputData;

export enum TeBlockType {
  PARAGRAPH = 'paragraph',
  HEADER = 'header',
  FIGURE = 'figure',
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

      if (block.data && block.data.text && block.data.text.trim() !== '') {
        if (result.length + block.data.text.trim().length > 200) {
          result += block.data.text.trim().substring(0, 200 - result.length) + '...';
          break;
        }
        result += block.data.text.trim() + ' ';
      }
    }
    return result.replace(/<[^>]*>/g, '');
  }

  public static getTitles(content: TeRichTextContent, titleTypes: number[]): BlockToolData[] {
    if (content == null || content.blocks == null) return [];
    const titleBlocks = content.blocks.filter(block => block.type === TeBlockType.HEADER && titleTypes.includes(block.data.level));
    return titleBlocks.map(block => {
      block.data.text = block.data.text.trim().replace(/<[^>]*>/g, '');
      block.data.text = block.data.text.replace(/&nbsp;/g, '');
      return block.data;
    });
  }

  public static getFiguresBlocks(content: TeRichTextContent): BlockToolData[] {
    if (content == null || content.blocks == null) return [];
    return content.blocks.filter(block => block.type === TeBlockType.FIGURE);
  }

  public static getFirstFigureLink(content: TeRichTextContent): string {
    const figures = TeRichText.getFiguresBlocks(content);
    if (figures.length === 0) return null;
    return figures[0].data.filename;
  }

  public static isLinkInFigures(content: TeRichTextContent, link: string): boolean {
    return TeRichText.getFiguresBlocks(content).some(block => block.data.filename === link);
  }

  public static areSimilar(content1: TeRichTextContent, content2: TeRichTextContent): boolean {
    if (content1 == null && content2 == null) return true;
    if (content1 == null || content2 == null) return false;
    if (content1.blocks?.length !== content2.blocks?.length) return false;
    for (let i = 0; i < content1.blocks?.length; i++) {
      if (content1.blocks[i].id !== content2.blocks[i].id) return false;
      if (content1.blocks[i].type !== content2.blocks[i].type) return false;

      for (const key in content1.blocks[i].data) {
        if (content1.blocks[i].data[key] !== content2.blocks[i].data[key]) {
          return false;
        }
      }
    }
    return true;
  }

  public static getVariables(content: TeRichTextContent): TeVariableFormInfo[] {
    const variables: TeVariableFormInfo[] = [];
    if (content == null || content.blocks == null) return variables;

    for (const block of content.blocks) {
      if (block.type === 'paragraph') {
        const content = block.data.text;

        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');

        const spans: Element[] = doc.getElementsByTagName(teVariableTagName) as any;

        for (const span of spans) {
          const jsonAttribute = span.getAttribute(TeElementInlineDirective.dataAttribute);
          if (!jsonAttribute) continue;

          variables.push(JSON.parse(jsonAttribute));
        }
      }
    }
    return variables;
  }

  public static contentAreEquals(content1: TeRichTextContent, content2: TeRichTextContent): boolean {
    if(content1 == null || content2 == null) return false;
    if(content1.time === content2.time) return true;
    if(content1.version !== content2.version) return false;
    return JSON.stringify(content1.blocks) === JSON.stringify(content2.blocks);
  }
}
