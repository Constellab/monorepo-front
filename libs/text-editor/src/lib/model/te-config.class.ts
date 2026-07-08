import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { ToolConstructable, ToolSettings } from '@editorjs/editorjs/types/tools';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { FL_ROOT_INJECTOR } from '@monorepo/front-core-lib/fl-core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { TeCodeBlock } from '../block/te-code-block.class';
import { TeComponentInitData } from '../block/te-component-block.class';
import { TeFigureBlock, TeFigureBlockConfig } from '../block/te-figure-block.class';
import { TeFileBlock, TeFileBlockConfig } from '../block/te-file-block';
import { TeFormulaBlock } from '../block/te-formula-block.class';
import {
  teGetHeaderWithIdBlockDefaultConfig,
  TeHeaderWithIdBlock,
  TeHeaderWithIdBlockConfig,
} from '../block/te-header-with-id-block.class';
import { TeHintBlock } from '../block/te-hint-block.class';
import { TeIframeBlock } from '../block/te-iframe-block.class';
import { TeNestedListBlock } from '../block/te-nested-list-block.class';
import { TeParagraphBlock } from '../block/te-paragraph-block.class';
import { TeRawHtmlBlock } from '../block/te-raw-html-block.class';
import TeTable from '../block/te-table-block.class';
import { TeTimestampBlock } from '../block/te-timestamp-block.class';
import { TeVideoBlock } from '../block/te-video-block.class';
import {
  TeAudioTranscriptionBlockTune,
  TeAudioTranscriptionConfig,
} from '../block-tune/te-audio-transcription-block-tune.class';
import { TeDragBlockTune } from '../block-tune/te-drag-block-tune.class';
import { TeBoldInlineTool } from '../inline-tool/te-bold-inline-tool.class';
import { TeCleanStyleInlineTool } from '../inline-tool/te-clean-style-inline-tool.class';
import { TeFakeInlineTool } from '../inline-tool/te-fake-inline-tool.class';
import { TeFormulaInlineToolClass } from '../inline-tool/te-formula-inline-tool.class';
import { TeInlineCodeTool } from '../inline-tool/te-inline-code-tool.class';
import { teInlineToolFactory } from '../inline-tool/te-inline-tool.factory';
import { TeStrikethroughInlineTool } from '../inline-tool/te-strikethrough-inline-tool.class';
import { TeUnderlineInlineTool } from '../inline-tool/te-underline-inline-tool.class';
import { TeVariableInlineToolClass } from '../inline-tool/te-variable-inline-tool.class';
import { TeMentionConfig, TeMentionInlineTool } from '../plugin/te-mention.class';
import { TeRichText } from './lib/te-rich-text.class';
import { TeHelper } from './te.helper';
import { teComponentBlockFactory } from './te-block-factory.class';
import { teBlockTuneFactory } from './te-block-tune-factory.class';

export type TeTools = { [toolName: string]: ToolConstructable | ToolSettings };

export interface TeAdditionalConfig {
  /**
   * Set to true to enable the emoji plugin
   */
  emoji: boolean;
  mention?: TeMentionConfig;
}

export interface TeConfigEvent {
  type: 'insertBlock';
  blockType: string;
  /**
   * For TeComponentBlock only, to force the block to be marked as new element
   */
  data?: BlockToolData | TeComponentInitData;
}

export interface TeUiConfig {
  hideToolbar: boolean;
  /**
   * If true an inline padding is added to include the tooltip button in this component
   */
  includeToolbarButton: boolean;

  /**
   *  In dense mode, the text is smaller and the paragraph have less padding
   */
  dense: boolean;
}

export abstract class TeConfig {
  public uiConfig: TeUiConfig;

  public figureConfig: TeFigureBlockConfig;

  constructor(uiConfig: Partial<TeUiConfig> = {}) {
    const defaultConfig: TeUiConfig = {
      hideToolbar: false,
      includeToolbarButton: false,
      dense: false,
    };
    this.uiConfig = Object.assign(defaultConfig, uiConfig);
  }

  abstract getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools;

  abstract getInlineToolbar(): string[];

  abstract getTunes(): string[];

  public getAdditionalConfig(): TeAdditionalConfig {
    return {
      emoji: true,
    };
  }

  public getDefaultBlock(): string {
    return 'paragraph';
  }

  /**
   * Override this method to provide a way to refresh the editor content from the server.
   * Used when entering edit mode and after an idle timeout in edit mode.
   * If it returns an Observable, the content will be reloaded.
   * By default returns null (no refresh).
   */
  public refreshContent$(): Observable<TeRichText> | null {
    return null;
  }

  getParagraphConfig(): ToolSettings {
    return {
      class: TeParagraphBlock,
      inlineToolbar: true,
      config: {
        preserveBlank: true,
      },
    };
  }

  getHeaderConfig(config: Partial<TeHeaderWithIdBlockConfig> = {}): ToolSettings {
    config = Object.assign(teGetHeaderWithIdBlockDefaultConfig(), config);
    return {
      class: TeHeaderWithIdBlock,
      config: config,
      // use the fake to show the toolbar to have access to convert to paragraph
      inlineToolbar: ['fake'],
    };
  }

  getListConfig(): ToolSettings {
    const translateService = FL_ROOT_INJECTOR.get(FlTranslateService);
    return {
      class: TeNestedListBlock,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
      },
      toolbox: [
        {
          icon: TeHelper.getMatIconElement('format_list_bulleted'),
          title: translateService.translate('teTextEditor.list_unordered'),
          data: {
            style: 'unordered',
          },
        },
        {
          icon: TeHelper.getMatIconElement('format_list_numbered'),
          title: translateService.translate('teTextEditor.list_ordered'),
          data: {
            style: 'ordered',
          },
        },
      ],
    };
  }

  getImageConfig(
    config: TeFigureBlockConfig,
    envInjector: EnvironmentInjector,
    applicationRef: ApplicationRef
  ): ToolSettings {
    return {
      class: teComponentBlockFactory(TeFigureBlock, envInjector, applicationRef, config),
    };
  }

  getFileConfig(
    config: TeFileBlockConfig,
    envInjector: EnvironmentInjector,
    applicationRef: ApplicationRef
  ): ToolSettings {
    return {
      class: teComponentBlockFactory(TeFileBlock, envInjector, applicationRef, config),
    };
  }

  getCodeConfig(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): ToolSettings {
    return {
      class: teComponentBlockFactory(TeCodeBlock, envInjector, applicationRef),
    };
  }

  getInlineCodeConfig(): ToolSettings {
    return {
      class: TeInlineCodeTool,
      shortcut: 'CMD+SHIFT+M',
    };
  }

  getMentionConfig(): ToolSettings {
    return {
      class: TeMentionInlineTool,
    };
  }

  getTableConfig(): ToolSettings {
    return {
      class: TeTable,
      inlineToolbar: true,
    };
  }

  getTimeStampConfig(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): ToolSettings {
    return {
      class: teComponentBlockFactory(TeTimestampBlock, envInjector, applicationRef),
    };
  }

  getAudioTranscriptionConfig(
    config: TeAudioTranscriptionConfig,
    envInjector: EnvironmentInjector,
    applicationRef: ApplicationRef
  ): ToolSettings {
    return {
      class: teBlockTuneFactory(TeAudioTranscriptionBlockTune, envInjector, applicationRef, config),
    };
  }

  getBasicInlineToolbar(): string[] {
    return ['convertTo', 'bold', 'italic', 'underline', 'strikethrough', 'link', 'cleanStyle'];
  }

  getFullInlineToolbar(variable: boolean = false): string[] {
    const tools = ['convertTo', 'bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode'];
    if (variable) tools.push('variable');
    tools.push('formulaInline', 'cleanStyle');
    return tools;
  }
}

export class TeBasicConfig extends TeConfig {
  getTools(): TeTools {
    return {
      paragraph: this.getParagraphConfig(),
      header: this.getHeaderConfig(),
      list: this.getListConfig(),

      // Inline
      bold: TeBoldInlineTool as any,
      underline: TeUnderlineInlineTool,
      strikethrough: TeStrikethroughInlineTool,
      cleanStyle: TeCleanStyleInlineTool,
      fake: TeFakeInlineTool,

      // Other
      drag: TeDragBlockTune,
    };
  }

  getTunes(): string[] {
    // moveUp, moveDown, delete are default button from
    // editorjs, we just set the delete button at the end
    return ['drag', 'moveUp', 'moveDown', 'delete'];
  }

  getInlineToolbar(): string[] {
    return this.getBasicInlineToolbar();
  }
}

export class TeCompleteConfig extends TeConfig {
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    return {
      // Block
      paragraph: this.getParagraphConfig(),
      header: this.getHeaderConfig(),
      list: this.getListConfig(),
      code: this.getCodeConfig(envInjector, applicationRef),
      formula: {
        class: teComponentBlockFactory(TeFormulaBlock, envInjector, applicationRef),
      },
      iframe: {
        class: teComponentBlockFactory(TeIframeBlock, envInjector, applicationRef),
      },
      html: {
        class: teComponentBlockFactory(TeRawHtmlBlock, envInjector, applicationRef),
      },
      table: this.getTableConfig(),
      hint: {
        class: TeHintBlock,
        inlineToolbar: true,
      },
      video: teComponentBlockFactory(TeVideoBlock, envInjector, applicationRef),
      timestamp: this.getTimeStampConfig(envInjector, applicationRef),

      // Inline
      bold: TeBoldInlineTool as any,
      underline: TeUnderlineInlineTool,
      strikethrough: TeStrikethroughInlineTool,
      inlineCode: this.getInlineCodeConfig(),
      variable: teInlineToolFactory(TeVariableInlineToolClass),
      formulaInline: teInlineToolFactory(TeFormulaInlineToolClass),
      cleanStyle: TeCleanStyleInlineTool,
      fake: TeFakeInlineTool,

      // Other
      drag: TeDragBlockTune,

      // Block tune
    };
  }

  getInlineToolbar(): string[] {
    return this.getFullInlineToolbar(false);
  }

  getTunes(): string[] {
    // moveUp, moveDown, delete are default button from
    // editorjs, we just set the delete button at the end
    return ['drag', 'moveUp', 'moveDown', 'delete'];
  }
}
