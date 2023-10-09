import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaBotChatScriptService {

  private renderer: Renderer2;
  private scriptTag: HTMLElement;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadScript() {
    if (!this.scriptTag) {
      // ChatBot Config
      const configScript = this.renderer.createElement('script');
      configScript.innerHTML = `
        window.embeddedChatbotConfig = {
          chatbotId: "UICfEbGM6YnD6BrGCHrFF",
          domain: "www.chatbase.co"
        }
      `;
      this.renderer.appendChild(document.body, configScript);
      // Load ChatBot Script
      this.scriptTag = this.renderer.createElement('script');
      this.renderer.setAttribute(this.scriptTag, 'src', 'https://www.chatbase.co/embed.min.js');
      this.renderer.setAttribute(this.scriptTag, 'chatbotId', 'UICfEbGM6YnD6BrGCHrFF');
      this.renderer.setAttribute(this.scriptTag, 'domain', 'www.chatbase.co');
      this.renderer.setAttribute(this.scriptTag, 'defer', 'true');
      this.renderer.appendChild(document.body, this.scriptTag);
    }
  }

  removeScript() {
    if (this.scriptTag) {
      this.renderer.removeChild(document.body, this.scriptTag);
      this.scriptTag = null;
    }
  }

}
