import { Component, inject, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ClYoutubeHelper } from '@monorepo/core-lib';
import edjsHTML from 'editorjs-html';

import { TeFigureBlock } from '../../block/te-figure-block.class';
import { TeVideoBlockData } from '../../block/te-video-block.class';
import { TeRichText } from '../../model/lib';
import { TeConfig } from '../../model/te-config.class';

@Component({
  selector: 'te-text-editor-server-side',
  templateUrl: './te-text-editor-server-side.component.html',
  styleUrl: './te-text-editor-server-side.component.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class TeTextEditorServerSideComponent implements OnInit {
  private renderer: Renderer2 = inject(Renderer2);

  @Input({ required: true }) richText: TeRichText;

  @Input({ required: true }) config: TeConfig;

  htmlValue: string;

  ngOnInit(): void {
    if (this.richText != null) {
      const parser = edjsHTML({
        figure: (block: TeFigureBlock) => {
          if (this.config?.figureConfig) {
            const img: HTMLImageElement = this.renderer.createElement('img');
            img.src = this.config.figureConfig.getImageUrl(block.data.filename);
            img.height = block.data.height;
            img.width = block.data.width;
            img.alt = 'Text editor image';
            return `${img.outerHTML}`;
          }
          return '';
        },
        video: (block: { data: TeVideoBlockData }) => {
          const url = block.data?.url;
          if (!url) return '';
          const videoId = ClYoutubeHelper.getYoutubeVideoId(url);
          if (!videoId) return '';
          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          const title = block.data.title || 'YouTube video';
          const caption = block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : '';
          // eslint-disable-next-line max-len
          return `<figure class="ssr-video"><a href="${embedUrl}" target="_blank" rel="noopener"><img src="${thumbnailUrl}" alt="${title}" loading="lazy" /><span class="ssr-video-play">&#9654;</span></a>${caption}</figure>`;
        },
      });
      const HTML = parser.parse(this.richText.toHTMLEditorJson());
      this.htmlValue = HTML.map((row: any) => (row instanceof Error ? '' : row)).join('<br>');
    }
  }
}
