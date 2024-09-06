import { Component } from '@angular/core';
import { CaChatState } from '../ca-chat.state';

@Component({
  selector: 'ca-chat-page',
  templateUrl: './ca-chat-page.component.html',
  styleUrl: './ca-chat-page.component.scss',
  providers: [CaChatState]
})
export class CaChatPageComponent {

  constructor(private state: CaChatState) {
    this.state.init();
  }
}
