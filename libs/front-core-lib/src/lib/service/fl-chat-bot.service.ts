import {Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FlChatBotService {

  private renderer: Renderer2;
  private chatCreated: boolean = false;

  constructor(rendererFactory: RendererFactory2,
              @Inject(PLATFORM_ID) private platformId: any) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadScript(isProd: boolean): void {
    if (this.chatCreated) return;

    if (isPlatformBrowser(this.platformId)) {
      if (isProd) {
        this.loadChatBot();
      } else {
        this.createFakeChatBot();
      }
    }
  }

  private loadChatBot(): void {
    // ChatBot Config
    const configScript = this.renderer.createElement('script');
    configScript.innerHTML = `
        window.embeddedChatbotConfig = {
          chatbotId: "T_y3-MsJ-eU2PYCgFnD7Q",
          domain: "www.chatbase.co"
        }
      `;
    this.renderer.appendChild(document.body, configScript);
    // Load ChatBot Script
    const scriptTag = this.renderer.createElement('script');
    this.renderer.setAttribute(scriptTag, 'src', 'https://www.chatbase.co/embed.min.js');
    this.renderer.setAttribute(scriptTag, 'chatbotId', 'T_y3-MsJ-eU2PYCgFnD7Q');
    this.renderer.setAttribute(scriptTag, 'domain', 'www.chatbase.co');
    this.renderer.setAttribute(scriptTag, 'defer', 'true');
    this.renderer.appendChild(document.body, scriptTag);
    this.chatCreated = true;
  }

  // call on dev env to create a fake chatbot button to avoid loading the real chatbot
  // but keep the same layout
  private createFakeChatBot(): void {
    const fakeChatBot: HTMLElement = this.renderer.createElement('div');
    this.renderer.addClass(fakeChatBot, 'g-fake-chatbot');
    this.renderer.appendChild(document.body, fakeChatBot);
    const icon: HTMLElement = this.renderer.createElement('span');
    this.renderer.addClass(icon, 'material-icons-outlined');
    icon.innerHTML = 'chat_bubble_outline';
    this.renderer.appendChild(fakeChatBot, icon);
    this.chatCreated = true;
  }
}
