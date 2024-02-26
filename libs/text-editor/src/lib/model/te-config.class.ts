import {ToolConstructable, ToolSettings} from '@editorjs/editorjs/types/tools';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {
  TeHeaderWithIdBlock,
  TeHeaderWithIdBlockConfig,
  teHeaderWithIdBlockDefaultConfig
} from '../block/te-header-with-id-block.class';
import NestedList from '@editorjs/nested-list';
import InlineCode from '@editorjs/inline-code';
import UnderlineInlineTool from '../inline-tools/inline-tool-underline';
import Quote from '@editorjs/quote';
import {TeFormulaBlock} from '../block/te-formula-block.class';
import Table from '@editorjs/table';
import Paragraph from '@editorjs/paragraph';
import {TeHintBlock} from '../block/te-hint-block.class';
import {TeVideoBlock} from '../block/te-video-block.class';
import {flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';
import {TeFigureBlock, TeFigureBlockConfig} from '../block/te-figure-block.class';
import {TeCodeBlock} from '../block/te-code-block.class';
import {teComponentBlockFactory} from './te-block-factory.class';
import StrikethroughInlineTool from '../inline-tools/inline-tool-strikethrough';
import {TeDragBlockTune} from '../block-tune/te-drag-block-tune.class';
import {TeHelper} from './te.helper';
import {teInlineToolFactory, TeVariableInlineToolClass} from '../inline-tool/te-variable-inline-tool.class';

export type TeTools = { [toolName: string]: ToolConstructable | ToolSettings };


export abstract class TeConfig {


  abstract getTools(envInjector: EnvironmentInjector,
                    applicationRef: ApplicationRef): TeTools;

  abstract getInlineToolbar(): string[];

  abstract getTunes(): string[];

  public getDefaultBlock(): string {
    return 'paragraph';
  }

  getParagraphConfig(): ToolSettings {
    return {
      class: Paragraph,
      inlineToolbar: true,
      config: {
        preserveBlank: true,
      }
    };
  }

  getHeaderConfig(config: Partial<TeHeaderWithIdBlockConfig> = {}): ToolSettings {
    config = Object.assign(teHeaderWithIdBlockDefaultConfig, config);
    return {
      class: TeHeaderWithIdBlock,
      config: config
    };
  }

  getListConfig(): ToolSettings {
    const translateService = flRootInjector.get(FlTranslateService);
    return {
      class: NestedList,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered'
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
      ]
    };
  }

  getImageConfig(config: TeFigureBlockConfig,
                 envInjector: EnvironmentInjector,
                 applicationRef: ApplicationRef): ToolSettings {
    return {
      class: teComponentBlockFactory(TeFigureBlock, envInjector, applicationRef, config),
    };
  };

  getCodeConfig(envInjector: EnvironmentInjector,
                applicationRef: ApplicationRef): ToolSettings {
    return {
      class: teComponentBlockFactory(TeCodeBlock, envInjector, applicationRef),
    };
  }
}


export class TeBasicConfig extends TeConfig {

  getTools(): TeTools {
    return {
      paragraph: this.getParagraphConfig(),
      header: this.getHeaderConfig(),
      list: this.getListConfig(),

      // Inline
      underline: UnderlineInlineTool,
      strikethrough: StrikethroughInlineTool,

      // Other
      drag: TeDragBlockTune,
    };
  }

  getTunes(): string[] {
    return ['drag'];
  }


  getInlineToolbar(): string[] {
    return ['bold', 'italic', 'underline', 'strikethrough', 'link'];
  }
}

export class TeCompleteConfig extends TeConfig {

  getTools(envInjector: EnvironmentInjector,
           applicationRef: ApplicationRef): TeTools {
    return {
      // Block
      paragraph: this.getParagraphConfig(),
      header: this.getHeaderConfig(),
      list: this.getListConfig(),
      code: this.getCodeConfig(envInjector, applicationRef),
      // TODO check if we keep the quote block
      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+O',
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author',
        },
      },
      formula: {
        class: teComponentBlockFactory(TeFormulaBlock, envInjector, applicationRef),
      },
      table: Table,
      hint: {
        class: TeHintBlock,
        inlineToolbar: true,
      },
      video: teComponentBlockFactory(TeVideoBlock, envInjector, applicationRef),

      // Inline
      underline: UnderlineInlineTool,
      strikethrough: StrikethroughInlineTool,
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+M',
      },
      variable: teInlineToolFactory(TeVariableInlineToolClass, envInjector, applicationRef),

      // Other
      drag: TeDragBlockTune,
    };
  }

  getInlineToolbar(): string[] {
    return ['bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode'];
  }

  getTunes(): string[] {
    return ['drag'];
  }

}
