import { ApplicationRef, Component, EnvironmentInjector } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { LiRichTextAudioTranscriptionConfig } from '@monorepo/lab-lib/li-core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TeCompleteConfig,
  TeTextEditorModule,
  TeTools,
  TeVariableInlineToolClass,
  teInlineToolFactory,
} from '@monorepo/text-editor';

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
      new LiRichTextAudioTranscriptionConfig(),
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
  selector: 'li-rich-text-dynamic-field',
  templateUrl: './li-rich-text-dynamic-field.component.html',
  styleUrl: './li-rich-text-dynamic-field.component.scss',
  imports: [TeTextEditorModule, ReactiveFormsModule],
})
export class LiRichTextDynamicFieldComponent extends FlDynamicFieldAbstractDirective {
  config = new LabDynamicFieldRichTextConfig();
}
