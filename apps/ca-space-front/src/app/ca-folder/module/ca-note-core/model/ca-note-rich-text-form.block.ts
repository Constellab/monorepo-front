import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { TeComponentBlock } from '@monorepo/text-editor';

import { CaNoteFormBlockComponent } from '../component/ca-note-form-block/ca-note-form-block.component';

export interface CaNoteRichTextFormBlockAdditionalData {
  noteId: string;
}

export interface CaNoteRichTextFormBlockData {
  form_id: string;
}

export class CaNoteRichTextFormBlock extends TeComponentBlock<CaNoteFormBlockComponent> {
  constructor(
    protected options: BlockToolConstructorOptions,
    protected readonly envInjector: EnvironmentInjector,
    protected readonly applicationRef: ApplicationRef,
    protected readonly additionalData: CaNoteRichTextFormBlockAdditionalData
  ) {
    super(options, envInjector, applicationRef, additionalData);
  }

  public static readonly TAG_NAME = 'ca-note-form-block';

  getComponentType(): Type<CaNoteFormBlockComponent> {
    return CaNoteFormBlockComponent;
  }

  getTagName(): string {
    return CaNoteRichTextFormBlock.TAG_NAME;
  }

  initInputs(data: CaNoteRichTextFormBlockData): void {
    this.componentInstance.setFormInputs(this.additionalData.noteId, data.form_id);
  }

  save(): BlockToolData {
    return this.data;
  }
}
