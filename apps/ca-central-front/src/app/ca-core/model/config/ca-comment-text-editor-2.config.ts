import {TeBasicConfig, teSimpleBlockFactory, TeTools} from '@monorepo/text-editor';
import {CaUser} from '../entities/ca-user.class';
import {ToolSettings} from '@editorjs/editorjs/types/tools';
import {Observable} from 'rxjs';
import {CaMentionBlock, MarkerTool} from './ca-mention-block.class';
import {flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';

export class CaCommentTextEditor2Config extends TeBasicConfig {

  constructor(private users$?: Observable<CaUser[]>) {
    super();
  }


  // getDefaultBlock(): string {
  //   return 'paragraphWithMention';
  // }

  getMentionConfig(): ToolSettings {
    const translateService = flRootInjector.get(FlTranslateService);
    return {
      class: teSimpleBlockFactory(CaMentionBlock, this.users$),
      config: {
        placeholder: translateService.translate('write_a_comment'),
      },
    };
  };

  //
  // getInlineToolbar(): string[] {
  //   return ['bold', 'mention'];
  // }

  getTools(): TeTools {
    const tools = super.getTools();
    // // replace the paragraph tool with the mention tool
    // delete tools.paragraph;
    // tools.paragraphWithMention = this.getMentionConfig();
    // tools.test = {
    //   class: MarkerTool,
    //   shortcut: 'CMD+SHIFT+N',
    // };
    // return {
    //   paragraph: Paragraph,
    //   marker: MarkerTool,
    // };
    tools.mention = {
      class: MarkerTool,
      // shortcut: '@'
    };

    return tools;
  }


}
