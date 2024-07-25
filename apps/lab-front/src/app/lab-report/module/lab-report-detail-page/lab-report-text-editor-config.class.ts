import {
  TeCompleteConfig,
  teComponentBlockFactory,
  teInlineToolFactory,
  TeTools,
  TeVariableInlineToolClass
} from '@monorepo/text-editor';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  LabRichTextViewBlock,
  LabRichTextViewBlockAdditionalData
} from '../../../lab-core/entity-module/lab-rich-text-core/lab-rich-text-view.block';
import {
  LabRichTextFileConfig,
  LabRichTextImageConfig,
  LabRichTextObjectType
} from '../../../lab-core/entity-service/lab-rich-text.service';

/**
 * Config for the text editor in the report to support view in the editor
 */
export class LabReportTextEditorConfig extends TeCompleteConfig {

  constructor(private reportId: string) {
    super();
  }


  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // add the view block
    const data: LabRichTextViewBlockAdditionalData = {
      type: 'report',
      entityId: this.reportId
    };
    tools.resourceView = teComponentBlockFactory(LabRichTextViewBlock, envInjector, applicationRef, data);

    // add the file view block
    const fileViewData: LabRichTextViewBlockAdditionalData = {
      type: 'file-view',
      entityId: this.reportId
    };
    tools.fileView = teComponentBlockFactory(LabRichTextViewBlock, envInjector, applicationRef, fileViewData);

    // configure and add the image block
    const imageConfig = new LabRichTextImageConfig(LabRichTextObjectType.REPORT, this.reportId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    tools.file = this.getFileConfig(new LabRichTextFileConfig(LabRichTextObjectType.REPORT, this.reportId), envInjector, applicationRef);

    return tools;
  }

  getInlineToolbar(): string[] {
    return ['bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode', 'variable', 'cleanStyle'];
  }
}
