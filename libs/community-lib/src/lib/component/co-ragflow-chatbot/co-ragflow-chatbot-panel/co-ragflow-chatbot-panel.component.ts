import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';
import { TranslatePipe } from '@ngx-translate/core';

import { CoRagflowChatbotComponent } from '../co-ragflow-chatbot.component';
import { CoRagflowChatbotPanelConfig } from './co-ragflow-chatbot-panel.config';

@Component({
  selector: 'co-ragflow-chatbot-panel',
  templateUrl: './co-ragflow-chatbot-panel.component.html',
  styleUrls: ['./co-ragflow-chatbot-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CoRagflowChatbotComponent, MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
})
export class CoRagflowChatbotPanelComponent {
  @ViewChild(CoRagflowChatbotComponent) chatbot: CoRagflowChatbotComponent;

  public config: CoRagflowChatbotPanelConfig = inject(FL_PORTAL_DATA);

  close(): void {
    this.config.onClose();
  }

  startNewConversation(): void {
    this.chatbot?.startNewConversation();
  }
}
