import { inject, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ClStringHelper, ClYoutubeHelper } from '@monorepo/core-lib';
import { marked, Tokens } from 'marked';
import { markedHighlight } from 'marked-highlight';

import { FlHighlight } from './fl-highlight.class';

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      return FlHighlight.highlight(code, lang);
    },
  })
);

@Pipe({
  name: 'flMarkdown',
  standalone: false,
})
export class FlMarkdownPipe implements PipeTransform {
  private domSanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml | null {
    if (!value) return null;
    const renderer = new marked.Renderer();

    const iframes: Record<string, string> = {};

    // Open all links in a new tab, with rel="noopener noreferrer" to avoid
    // exposing window.opener to the target page.
    renderer.link = ({ href, title, text }: Tokens.Link) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    };

    renderer.image = ({ href, title, text }: Tokens.Image) => {
      if (href === null) {
        return text;
      }

      let out: string = '';

      if (ClYoutubeHelper.isYoutubeVideoUrl(href)) {
        const embedHref: string | null = ClYoutubeHelper.convertToEmbedUrl(href);
        // eslint-disable-next-line max-len
        let iframe: string = `<div class="iframe-div"><iframe title="Youtube video ${title}" src="${embedHref}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen property="binding"`;
        if (title) {
          iframe += ` title="${title}">`;
        } else {
          iframe += '>';
        }
        iframe += '</iframe></div>';
        const id: string = ClStringHelper.generateUUID();
        iframes[id] = iframe;
        out += id;
      } else {
        out += `<img src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        out += '>';
      }
      return out;
    };

    const parsedDoc: string = marked.parse(value, { renderer: renderer, async: false });
    const sanitizedDoc: string | null = this.domSanitizer.sanitize(SecurityContext.HTML, parsedDoc);
    if (sanitizedDoc == null) return null;

    let safeDoc: string = sanitizedDoc;
    for (const key of Object.keys(iframes)) {
      const safeIframe: string | null = this.domSanitizer.sanitize(
        SecurityContext.RESOURCE_URL,
        this.domSanitizer.bypassSecurityTrustResourceUrl(iframes[key])
      );
      if (safeIframe == null) continue;

      safeDoc = safeDoc.replace(key, safeIframe);
    }
    return this.domSanitizer.bypassSecurityTrustHtml(safeDoc);
  }
}
