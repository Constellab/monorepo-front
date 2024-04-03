import {
  TeCompleteConfig,
  teComponentBlockFactory,
  teInlineToolFactory,
  TeTools,
  TeVariableInlineToolClass
} from '@monorepo/text-editor';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {LabReportContentViewBlock} from './lab-report-content-view.block';
import {LabRichTextTextEditorImageConfig} from '../../../lab-core/entity-service/lab-rich-text.service';

/**
 * Config for the text editor in the report to support view in the editor
 */
export class LabReportTextEditorConfig extends TeCompleteConfig {

  constructor(private reportId?: string) {
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
    tools.resourceView = teComponentBlockFactory(LabReportContentViewBlock, envInjector, applicationRef, this.reportId);

    // configure and add the image block
    const imageConfig = new LabRichTextTextEditorImageConfig();
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    return tools;
  }

  getInlineToolbar(): string[] {
    return ['bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode', 'variable', 'cleanStyle'];
  }
}
