import { Component, Input } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';
import { FormControl } from '@angular/forms';
import { LabOpenAiChat } from '../../model/lab-open-ai.class';

/**
 * Component for dynamic field to have a chat with OpenAI
 */
@Component({
    selector: 'lab-open-ai-chat-dynamic-field',
    templateUrl: './lab-open-ai-chat-dynamic-field.component.html',
    styleUrls: ['./lab-open-ai-chat-dynamic-field.component.scss'],
    standalone: false
})
export class LabOpenAiChatDynamicFieldComponent extends FlDynamicFieldAbstractDirective {
  @Input() formCtrl: FormControl<LabOpenAiChat>;
}
