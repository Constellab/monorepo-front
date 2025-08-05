import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT,inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';

import { flDifyLoad } from './fl-dify-loader-script';

@Injectable({
  providedIn: 'root',
})
export class FlDifyLoaderService {
  private platformId = inject(PLATFORM_ID);
  private rendererFactory = inject(RendererFactory2);
  private document = inject(DOCUMENT);

  public load(chatToken: string, isProduction: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (isProduction) {
      if (!chatToken) return;
      // Load the Dify chatbot script
      this.loadDify(chatToken);
    } else {
      // In development mode, generate a fake button to trigger the Dify chatbot
      this.generateFakeButton();
    }
  }

  private generateFakeButton(): void {
    // Create a fake button to trigger the Dify chatbot
    const button = document.createElement('div');
    button.id = 'dify-fake-button';
    // add the button to the body
    const renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);
    renderer.appendChild(this.document.body, button);
  }

  private loadDify(difyChatToken: string): void {
    // set the chat token
    (window as any).difyChatbotConfig = { token: difyChatToken };
    flDifyLoad();
  }
}
