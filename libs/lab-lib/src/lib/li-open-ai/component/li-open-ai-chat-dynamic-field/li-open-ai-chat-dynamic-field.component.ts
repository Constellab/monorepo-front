import { Component, Input } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LiOpenAiChat } from '../../model/li-open-ai.class';
import { LiOpenAiChatComponent } from '../li-open-ai-chat/li-open-ai-chat.component';
import { MatError } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component for dynamic field to have a chat with OpenAI
 */
@Component({
  selector: 'li-open-ai-chat-dynamic-field',
  templateUrl: './li-open-ai-chat-dynamic-field.component.html',
  styleUrls: ['./li-open-ai-chat-dynamic-field.component.scss'],
  imports: [FlFormModule, LiOpenAiChatComponent, ReactiveFormsModule, MatError, TranslatePipe],
})
export class LiOpenAiChatDynamicFieldComponent extends FlDynamicFieldAbstractDirective {
  @Input() formCtrl: FormControl<LiOpenAiChat>;
}
