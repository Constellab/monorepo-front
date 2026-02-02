import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CoRagflowChatbotComponent } from '../co-ragflow-chatbot.component';
import { CO_RAGFLOW_CHATBOT_CONFIG, CoRagflowChatbotPanelConfig } from './co-ragflow-chatbot-panel.config';

@Component({
  selector: 'co-ragflow-chatbot-panel',
  templateUrl: './co-ragflow-chatbot-panel.component.html',
  styleUrls: ['./co-ragflow-chatbot-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CoRagflowChatbotComponent, MatButtonModule, MatIconModule, TranslatePipe],
})
export class CoRagflowChatbotPanelComponent {

  public config: CoRagflowChatbotPanelConfig = inject(CO_RAGFLOW_CHATBOT_CONFIG);

  close(): void {
    this.config.onClose();
  }
}
