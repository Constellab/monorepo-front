import { ApplicationRef, Component, EnvironmentInjector } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';
import {
  TeCompleteConfig,
  teInlineToolFactory,
  TeTools,
  TeVariableInlineToolClass,
} from '@monorepo/text-editor';
import { LabRichTextAudioTranscriptionConfig } from '../../../../entity-service/lab-rich-text.service';

/**
 * Config for the text editor of dynamic field, it is a complete text editor
 * without any external file (image, file, view...)
 */
class LabDynamicFieldRichTextConfig extends TeCompleteConfig {
  constructor() {
    super({ includeToolbarButton: true });
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    tools.audioTranscription = this.getAudioTranscriptionConfig(
      new LabRichTextAudioTranscriptionConfig(),
      envInjector,
      applicationRef
    );

    return tools;
  }

  getInlineToolbar(): string[] {
    return this.getFullInlineToolbar(true);
  }

  getTunes(): string[] {
    return ['audioTranscription', ...super.getTunes()];
  }
}

/**
 * Component to allow the rich text editor to be used as a dynamic field.
 */
@Component({
    selector: 'lab-rich-text-dynamic-field',
    templateUrl: './lab-rich-text-dynamic-field.component.html',
    styleUrl: './lab-rich-text-dynamic-field.component.scss',
    standalone: false
})
export class LabRichTextDynamicFieldComponent extends FlDynamicFieldAbstractDirective {
  config = new LabDynamicFieldRichTextConfig();
}
