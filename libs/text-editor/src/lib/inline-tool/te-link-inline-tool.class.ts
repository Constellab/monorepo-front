import { SanitizerConfig } from '@editorjs/editorjs';
import { flRootInjector } from '@monorepo/front-core-lib/fl-core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { TeLinkInlineToolData } from '../component/te-link-inline/te-link-inline.component';
import { TeHelper } from '../model/te.helper';
import { TeComponentInlineTool } from './te-component-inline-tool.class';

export class TeLinkInlineToolClass extends TeComponentInlineTool<TeLinkInlineToolData> {
  public static TAG = 'te-link-inline';

  static override get title(): string {
    return flRootInjector.get(FlTranslateService).translate('teTextEditor.link');
  }

  public static get sanitize(): SanitizerConfig {
    return {
      [TeLinkInlineToolClass.TAG]: {
        'data-jsondata': true,
      },
      a: {
        href: true,
        target: '_blank',
        rel: 'nofollow',
      },
    } as SanitizerConfig;
  }

  getInlineElementTag(): string {
    return TeLinkInlineToolClass.TAG;
  }

  renderInlineButton(): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(this.options.api.styles.inlineToolButton, 'g-text-editor-inline-button');
    button.innerHTML = TeHelper.getMatIconElement('link');

    this.inlineButton = button;
    return button;
  }

  getDefaultData(range: Range): TeLinkInlineToolData {
    const fragment = range.extractContents();
    const selectText = TeHelper.extractTextFromDocumentFragment(fragment);

    return {
      url: '',
      text: selectText,
    };
  }

  getWrapper(): HTMLElement | undefined {
    return document.createElement(TeLinkInlineToolClass.TAG);
  }

  /**
   * Transform <te-link-inline> custom elements to standard <a> tags
   * so Angular's sanitizer preserves them in [innerHTML]
   */
  static transformToAnchors(html: string): string {
    const tag = TeLinkInlineToolClass.TAG;
    const regex = new RegExp(`<${tag}[^>]*data-jsondata="([^"]*)"[^>]*>[^<]*</${tag}>`, 'g');

    return html.replace(regex, (_, jsonData: string) => {
      try {
        const decoded = jsonData.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        const data: TeLinkInlineToolData = JSON.parse(decoded);
        const text = data.text || data.url;
        const href = data.url || '';

        return `<a href="${href}" target="_blank" rel="nofollow">${text}</a>`;
      } catch {
        return '';
      }
    });
  }
}
