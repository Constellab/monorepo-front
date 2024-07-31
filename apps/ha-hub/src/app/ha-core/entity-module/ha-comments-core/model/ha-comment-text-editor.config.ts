import {
  TeCleanStyleInlineTool,
  TeConfig,
  TeFakeInlineTool,
  TeStrikethroughInlineTool,
  TeTools,
  TeUnderlineInlineTool
} from '@monorepo/text-editor';

export class HaCommentTextEditorConfig extends TeConfig {

  constructor() {
    super({hideToolbar: true, dense: true});
  }

  override getTools(): TeTools {
    return {
      paragraph: this.getParagraphConfig(),
      list: this.getListConfig(),

      underline: TeUnderlineInlineTool,
      strikethrough: TeStrikethroughInlineTool,
      cleanStyle: TeCleanStyleInlineTool,
      fake: TeFakeInlineTool
    };
  }

  getInlineToolbar(): string[] {
    return this.getBasicInlineToolbar();
  }

  getTunes(): string[] {
    return [];
  }
}
