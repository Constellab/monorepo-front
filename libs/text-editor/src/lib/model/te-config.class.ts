import {ToolConstructable, ToolSettings} from '@editorjs/editorjs/types/tools';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import Underline from '@editorjs/underline';
import Strikethrough from '@sotaproject/strikethrough';
import {TeHeaderWithIdBlock} from '../block/te-header-with-id-block.class';
import NestedList from '@editorjs/nested-list';
import InlineCode from '@editorjs/inline-code';
import Quote from '@editorjs/quote';
import {teComponentBlockFactory} from '../block/te-component-block.class';
import {TeFormulaBlock} from '../block/te-formula-block.class';
import Table from '@editorjs/table';
import Paragraph from '@editorjs/paragraph';
import {TeHintBlock} from '../block/te-hint-block.class';
import {TeVideoBlock} from '../block/te-video-block.class';
import {FlKeyboardKey, flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';
import {TeFigureBlock, TeFigureBlockConfig} from '../block/te-figure-block.class';
import {TeCodeBlock} from '../block/te-code-block.class';

export type TeTools = { [toolName: string]: ToolConstructable | ToolSettings };


export abstract class TeConfig {

  public static readonly TOOLBOX_OPEN_KEY = FlKeyboardKey.TAB;

  abstract getTools(envInjector: EnvironmentInjector,
                    applicationRef: ApplicationRef): TeTools;

  abstract getInlineToolbar(): string[];

  getParagraphConfig(): ToolSettings {
    return {
      class: Paragraph,
      inlineToolbar: true,
      config: {
        preserveBlank: true,
      }
    };
  }

  getHeaderConfig(): ToolSettings {
    return {
      class: TeHeaderWithIdBlock,
      config: {
        levels: [2, 3, 4],
        defaultLevel: 2
      },
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
          icon: '<span class="material-icons-outlined">format_list_bulleted</span>',
          title: translateService.translate('teTextEditor.list_unordered'),
          data: {
            style: 'unordered',
          },
        },
        {
          icon: '<span class="material-icons-outlined">format_list_numbered</span>',
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
      underline: Underline,
      strikethrough: Strikethrough,
      header: this.getHeaderConfig(),
      list: this.getListConfig(),
    };
  }

  getInlineToolbar(): string[] {
    return ['bold', 'italic', 'underline', 'strikethrough', 'link'];
  }
}

export class TeCompleteConfig extends TeConfig {

  getTools(envInjector: EnvironmentInjector,
           applicationRef: ApplicationRef): TeTools {
    return {
      paragraph: this.getParagraphConfig(),
      underline: Underline,
      strikethrough: Strikethrough,
      header: this.getHeaderConfig(),
      list: this.getListConfig(),
      code: this.getCodeConfig(envInjector, applicationRef),
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+M',
      },
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
    };
  }

  getInlineToolbar(): string[] {
    return ['bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode'];
  }

}
