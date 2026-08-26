import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
        video: (block: { data: TeVideoBlockData }) => this.renderVideoBlock(block.data),
      });
      const HTML = parser.parse(this.richText.toHTMLEditorJson());
      this.htmlValue = HTML.map((row: any) => (row instanceof Error ? '' : row)).join('<br>');
    }
  }

  /**
   * Render a video block as a figure containing a clickable thumbnail and an optional caption
   * @param data
   */
  private renderVideoBlock(data: TeVideoBlockData): string {
    const url = data?.url;
    if (!url) return '';
    const videoId = ClYoutubeHelper.getYoutubeVideoId(url);
    if (!videoId) return '';

    const figure: HTMLElement = this.renderer.createElement('figure');
    this.renderer.addClass(figure, 'ssr-video');

    this.renderer.appendChild(figure, this.createVideoThumbnailAnchor(videoId, data.title));

    if (data.caption) {
      const figcaption: HTMLElement = this.renderer.createElement('figcaption');
      figcaption.textContent = data.caption;
      this.renderer.appendChild(figure, figcaption);
    }

    return figure.outerHTML;
  }

  /**
   * Create the link to the youtube video, containing the video thumbnail and a play button
   * @param videoId
   * @param title
   */
  private createVideoThumbnailAnchor(videoId: string, title?: string): HTMLAnchorElement {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const anchor: HTMLAnchorElement = this.renderer.createElement('a');
    this.renderer.setAttribute(anchor, 'href', embedUrl);
    this.renderer.setAttribute(anchor, 'target', '_blank');
    this.renderer.setAttribute(anchor, 'rel', 'noopener');

    const img: HTMLImageElement = this.renderer.createElement('img');
    this.renderer.setAttribute(img, 'src', thumbnailUrl);
    this.renderer.setAttribute(img, 'alt', title || 'YouTube video');
    this.renderer.setAttribute(img, 'loading', 'lazy');

    const playBtn: HTMLElement = this.renderer.createElement('span');
    this.renderer.addClass(playBtn, 'ssr-video-play');
    playBtn.innerHTML = '&#9654;';

    this.renderer.appendChild(anchor, img);
    this.renderer.appendChild(anchor, playBtn);

    return anchor;
  }
}
