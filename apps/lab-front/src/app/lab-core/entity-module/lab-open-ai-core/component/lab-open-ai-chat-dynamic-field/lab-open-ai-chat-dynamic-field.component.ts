import { Component, Input } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LabOpenAiChat } from '../../model/lab-open-ai.class';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabOpenAiChatComponent } from '../lab-open-ai-chat/lab-open-ai-chat.component';
import { MatError } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component for dynamic field to have a chat with OpenAI
 */
@Component({
  selector: 'lab-open-ai-chat-dynamic-field',
  templateUrl: './lab-open-ai-chat-dynamic-field.component.html',
  styleUrls: ['./lab-open-ai-chat-dynamic-field.component.scss'],
  imports: [FlFormModule, LabOpenAiChatComponent, ReactiveFormsModule, MatError, TranslatePipe],
})
export class LabOpenAiChatDynamicFieldComponent extends FlDynamicFieldAbstractDirective {
  @Input() formCtrl: FormControl<LabOpenAiChat>;
}
