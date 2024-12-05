import { ToolConstructable, ToolSettings } from '@editorjs/editorjs/types/tools';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  teGetHeaderWithIdBlockDefaultConfig,
  TeHeaderWithIdBlock,
  TeHeaderWithIdBlockConfig,
} from '../block/te-header-with-id-block.class';
import InlineCode from '@editorjs/inline-code';
import { TeFormulaBlock } from '../block/te-formula-block.class';
import { TeHintBlock } from '../block/te-hint-block.class';
import { TeVideoBlock } from '../block/te-video-block.class';
import { flRootInjector, FlTranslateService } from '@monorepo/front-core-lib';
import { TeFigureBlock, TeFigureBlockConfig } from '../block/te-figure-block.class';
import { TeCodeBlock } from '../block/te-code-block.class';
import { teComponentBlockFactory } from './te-block-factory.class';
import { TeStrikethroughInlineTool } from '../inline-tool/te-strikethrough-inline-tool.class';
import { TeDragBlockTune } from '../block-tune/te-drag-block-tune.class';
import { TeHelper } from './te.helper';
import { TeVariableInlineToolClass } from '../inline-tool/te-variable-inline-tool.class';
import { TeParagraphBlock } from '../block/te-paragraph-block.class';
import { teInlineToolFactory } from '../inline-tool/te-inline-tool.factory';
import { TeUnderlineInlineTool } from '../inline-tool/te-underline-inline-tool.class';
import { TeCleanStyleInlineTool } from '../inline-tool/te-clean-style-inline-tool.class';
import { TeFakeInlineTool } from '../inline-tool/te-fake-inline-tool.class';
import { TeNestedListBlock } from '../block/te-nested-list-block.class';
import { TeMentionConfig, TeMentionInlineTool } from '../plugin/te-mention.class';
import { TeFileBlock, TeFileBlockConfig } from '../block/te-file-block';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { TeComponentInitData } from '../block/te-component-block.class';
import TeTable from '../block/te-table-block.class';
import {
  TeAudioTranscriptionBlockTune,
  TeAudioTranscriptionConfig,
} from '../block-tune/te-audio-transcription-block-tune.class';
import { teBlockTuneFactory } from './te-block-tune-factory.class';
import { TeTimestampBlock } from '../block/te-timestamp-block.class';

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
    const translateService = flRootInjector.get(FlTranslateService);
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
      class: InlineCode,
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
    tools.push('cleanStyle');
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
      underline: TeUnderlineInlineTool,
      strikethrough: TeStrikethroughInlineTool,
      cleanStyle: TeCleanStyleInlineTool,
      fake: TeFakeInlineTool,

      // Other
      drag: TeDragBlockTune,
    };
  }

  getTunes(): string[] {
    return ['drag'];
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
      table: this.getTableConfig(),
      hint: {
        class: TeHintBlock,
        inlineToolbar: true,
      },
      video: teComponentBlockFactory(TeVideoBlock, envInjector, applicationRef),
      timestamp: this.getTimeStampConfig(envInjector, applicationRef),

      // Inline
      underline: TeUnderlineInlineTool,
      strikethrough: TeStrikethroughInlineTool,
      inlineCode: this.getInlineCodeConfig(),
      variable: teInlineToolFactory(TeVariableInlineToolClass),
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
    return ['drag'];
  }
}
