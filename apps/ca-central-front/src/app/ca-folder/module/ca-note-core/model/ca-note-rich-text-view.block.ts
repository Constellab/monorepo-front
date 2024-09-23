import { CaNoteContentViewComponent } from '../component/ca-note-content-view/ca-note-content-view.component';
import { RvConfigValues } from '@monorepo/resource-view';
import { TeComponentBlock } from '@monorepo/text-editor';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';

export interface CaNoteRichTextViewBlockAdditionalData {
  type: 'resourceView' | 'fileView';
  noteId: string;
}

export interface CaNoteResourceViewBlockData {
  id: string;
  resource_id: string;
  view_method_name: string;
  view_config: RvConfigValues;
  title: string;
  caption: string;
}

export interface CaNoteFileViewBlockData {
  id: string;
  title: string;
  caption: string;
}

export class CaNoteRichTextViewBlock extends TeComponentBlock<CaNoteContentViewComponent> {

  constructor(protected options: BlockToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef,
              // additionalData is the note id
              protected readonly additionalData: CaNoteRichTextViewBlockAdditionalData) {
    super(options, envInjector, applicationRef, additionalData);
  }

  public static readonly TAG_NAME = 'ca-note-content-view';


  getComponentType(): Type<CaNoteContentViewComponent> {
    return CaNoteContentViewComponent;
  }

  getTagName(): string {
    return CaNoteRichTextViewBlock.TAG_NAME;
  }

  initInputs(data: CaNoteResourceViewBlockData | CaNoteFileViewBlockData): void {
    let resourceId: string = null;
    if (this.additionalData.type === 'resourceView') {
      resourceId = (data as CaNoteResourceViewBlockData).resource_id;
    }

    this.componentInstance.setViewInputs(this.additionalData.noteId, data.id,
      data.title, data.caption, resourceId);
  }


  // this is only for read only mode
  save(): BlockToolData {
    return this.data;
  }
}


