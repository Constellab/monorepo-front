import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { ClHelpService } from '@monorepo/core-lib';
import { BlockToolData } from '@editorjs/editorjs/types/tools';
import { TeVariableFormInfo, teVariableTagName } from './te-variable.class';
import { TeElementInlineDirective } from './te-element.directive';
import {
  TeTextEditorHistoryBlockModification,
  TeTextEditorHistoryModificationGroup,
  TeTextEditorHistoryModificationType,
} from './te-text-editor-history-modification.class';

export type TeRichTextContent = OutputData;

export type TeRichTextContentBlock = OutputBlockData;

export enum TeBlockType {
  PARAGRAPH = 'paragraph',
  HEADER = 'header',
  FIGURE = 'figure',
}

export interface TeRichTextUndoRedoResult {
  index: number;
  block: TeRichTextContentBlock;
  modificationType: TeTextEditorHistoryModificationType;
  modificationsGroup: TeTextEditorHistoryModificationGroup;
  oldIndex?: number;
}

export class TeRichText {
  public static emptyContent(): TeRichTextContent {
    return {
      time: new Date().getTime(),
      blocks: [],
      version: '2.30.2',
    };
  }

  public static isEmpty(content: TeRichTextContent): boolean {
    if (ClHelpService.isNullOrEmpty(content) || ClHelpService.isNullOrEmpty(content.blocks)) return true;

    // check if all block are paragraph and contain only spaces or empty string
    const allParagraph = content.blocks.every((block) => block.type === TeBlockType.PARAGRAPH);
    if (!allParagraph) return false;

    return content.blocks.every((block) => {
      return (
        ClHelpService.isNullOrEmpty(block.data) ||
        ClHelpService.isNullOrEmpty(block.data.text) ||
        ClHelpService.isNullOrEmpty(block.data.text.trim())
      );
    });
  }

  public static getFirstParagraphsText(content: TeRichTextContent): string {
    if (TeRichText.isEmpty(content)) return null;
    let result = '';
    const paragraphBlocks = content.blocks.filter((block) => block.type === TeBlockType.PARAGRAPH);
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
    const titleBlocks = content.blocks.filter(
      (block) => block.type === TeBlockType.HEADER && titleTypes.includes(block.data.level)
    );
    return titleBlocks.map((block) => {
      block.data.text = block.data.text.trim().replace(/<[^>]*>/g, '');
      block.data.text = block.data.text.replace(/&nbsp;/g, '');
      return block.data;
    });
  }

  public static getFiguresBlocks(content: TeRichTextContent): BlockToolData[] {
    if (content == null || content.blocks == null) return [];
    return content.blocks.filter((block) => block.type === TeBlockType.FIGURE);
  }

  public static getFirstFigureLink(content: TeRichTextContent): string {
    const figures = TeRichText.getFiguresBlocks(content);
    if (figures.length === 0) return null;
    return figures[0].data.filename;
  }

  public static isLinkInFigures(content: TeRichTextContent, link: string): boolean {
    return TeRichText.getFiguresBlocks(content).some((block) => block.data.filename === link);
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
    if (content1 == null || content2 == null) return false;
    if (content1.time === content2.time) return true;
    if (content1.version !== content2.version) return false;
    return JSON.stringify(content1.blocks) === JSON.stringify(content2.blocks);
  }

  public static getRichTextModification(
    oldContent: TeRichTextContent,
    newContent: TeRichTextContent,
    userId: string,
    modifications: TeTextEditorHistoryModificationGroup = new TeTextEditorHistoryModificationGroup()
  ): TeTextEditorHistoryModificationGroup {
    const differences: TeTextEditorHistoryBlockModification[] = [];
    if (oldContent == null) {
      return modifications;
    }
    const oldBlocks = oldContent?.blocks;
    if (oldBlocks == null) {
      return modifications;
    }
    const oldBlockMap = new Map(oldBlocks.map((block) => [block.id, block]));

    newContent.blocks.forEach((block, index) => {
      const oldBlock = oldBlockMap.get(block.id);
      const oldBlockIndex = oldBlocks.indexOf(oldBlock);
      if (oldBlock == null) {
        const modif = new TeTextEditorHistoryBlockModification(
          newContent.version,
          block.id,
          block.type,
          TeTextEditorHistoryModificationType.CREATED,
          index,
          userId
        );
        modif.blockValue = block.data;
        differences.push(modif);
      } else if (JSON.stringify(oldBlock.data) !== JSON.stringify(block.data)) {
        const modif = new TeTextEditorHistoryBlockModification(
          newContent.version,
          block.id,
          block.type,
          TeTextEditorHistoryModificationType.UPDATED,
          index,
          userId
        );
        modif.blockValue = block.data;
        modif.differences = TeTextEditorHistoryModificationGroup.getValuesDifferences(
          JSON.stringify(oldBlock.data),
          JSON.stringify(block.data)
        );
        differences.push(modif);
        oldBlockMap.delete(block.id);
      } else if (oldBlockIndex != index && oldBlockMap.has(block.id)) {
        const modif = new TeTextEditorHistoryBlockModification(
          newContent.version,
          block.id,
          block.type,
          TeTextEditorHistoryModificationType.MOVED,
          index,
          userId
        );
        modif.oldIndex = oldBlockIndex;
        modif.blockValue = block.data;
        differences.push(modif);
        oldBlockMap.delete(block.id);
      } else {
        oldBlockMap.delete(block.id);
      }
    });
    oldBlocks.forEach((oldBlock, index) => {
      if (oldBlockMap.has(oldBlock.id)) {
        const modif = new TeTextEditorHistoryBlockModification(
          newContent.version,
          oldBlock.id,
          oldBlock.type,
          TeTextEditorHistoryModificationType.DELETED,
          index,
          userId
        );
        modif.blockValue = oldBlock.data;
        differences.push(modif);
      }
    });
    modifications.fusion(differences);
    return modifications;
  }

  public static undoModification(
    content: TeRichTextContent,
    modificationGroup: TeTextEditorHistoryModificationGroup
  ): TeRichTextUndoRedoResult {
    if (
      content == null ||
      modificationGroup?.modifications?.length === 0 ||
      modificationGroup.currentIndex < 0
    ) {
      return null;
    }

    const modificationToUndo = modificationGroup.modifications[modificationGroup.currentIndex];

    let updatedBlock: TeRichTextContentBlock = null;

    if (
      (modificationToUndo.type == TeTextEditorHistoryModificationType.UPDATED ||
        modificationToUndo.type == TeTextEditorHistoryModificationType.MOVED) &&
      !content.blocks.some((block) => block.id === modificationToUndo.blockId)
    ) {
      modificationToUndo.type = TeTextEditorHistoryModificationType.CREATED;
    }

    if (modificationToUndo.type === TeTextEditorHistoryModificationType.UPDATED) {
      const diff = TeTextEditorHistoryModificationGroup.undoDifferences(
        JSON.stringify(content.blocks[modificationToUndo.index].data),
        modificationToUndo.differences
      );
      if (diff?.length > 0) {
        content.blocks[modificationToUndo.index].data = JSON.parse(diff);
      }
      updatedBlock = content.blocks[modificationToUndo.index];
    } else if (
      modificationToUndo.type === TeTextEditorHistoryModificationType.DELETED ||
      modificationToUndo.type === TeTextEditorHistoryModificationType.MOVED
    ) {
      updatedBlock = {
        id: modificationToUndo.blockId,
        type: modificationToUndo.blockType,
        data: modificationToUndo.blockValue,
      };
    }
    modificationGroup.currentIndex--;

    return {
      block: updatedBlock,
      index: modificationToUndo.index,
      oldIndex: modificationToUndo.oldIndex,
      modificationType: modificationToUndo.type,
      modificationsGroup: modificationGroup,
    };
  }

  public static redoModification(
    content: TeRichTextContent,
    modificationGroup: TeTextEditorHistoryModificationGroup
  ): TeRichTextUndoRedoResult {
    if (modificationGroup.currentIndex < -1) {
      modificationGroup.currentIndex = -1;
    }

    if (
      content == null ||
      modificationGroup?.modifications?.length === 0 ||
      modificationGroup.currentIndex == modificationGroup.modifications.length - 1
    ) {
      return null;
    }

    const modificationToRedo = modificationGroup.modifications[modificationGroup.currentIndex + 1];

    let updatedBlock: TeRichTextContentBlock = null;

    if (
      modificationToRedo.type == TeTextEditorHistoryModificationType.UPDATED &&
      !content.blocks.some((block) => block.id === modificationToRedo.blockId)
    ) {
      modificationToRedo.type = TeTextEditorHistoryModificationType.CREATED;
    }

    if (
      modificationToRedo.type === TeTextEditorHistoryModificationType.UPDATED &&
      content.blocks[modificationToRedo.index]?.data
    ) {
      const diff = TeTextEditorHistoryModificationGroup.redoDifferences(
        JSON.stringify(content.blocks[modificationToRedo.index]?.data),
        modificationToRedo.differences
      );
      if (diff?.length > 0) {
        content.blocks[modificationToRedo.index].data = JSON.parse(diff);
      }
      updatedBlock = content.blocks[modificationToRedo.index];
    } else if (modificationToRedo.type === TeTextEditorHistoryModificationType.CREATED) {
      updatedBlock = {
        id: modificationToRedo.blockId,
        type: modificationToRedo.blockType,
        data: modificationToRedo.blockValue,
      };
    }

    modificationGroup.currentIndex++;

    return {
      block: updatedBlock,
      index: modificationToRedo.index,
      oldIndex: modificationToRedo.oldIndex,
      modificationType: modificationToRedo.type,
      modificationsGroup: modificationGroup,
    };
  }
}
