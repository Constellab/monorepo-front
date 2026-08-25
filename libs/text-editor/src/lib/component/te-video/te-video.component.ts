import { ChangeDetectionStrategy, Component, inject, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ClYoutubeHelper } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { TeElementBlockDirective } from '../../model/te-element.directive';
import { TeLinkDialogComponent, TeLinkDialogInput } from '../te-link-dialog/te-link-dialog.component';

@Component({
  selector: 'te-video',
  templateUrl: './te-video.component.html',
  styleUrls: ['./te-video.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TeVideoComponent extends TeElementBlockDirective implements OnInit {
  private sanitize = inject(DomSanitizer);
  private dialogService = inject(FlDialogService);

  @Input() url?: string;

  @Input() videoTitle?: string;

  @Input() caption?: string;

  sanitizedUrl: SafeUrl;
  thumbnailUrl: string | null;
  urlError: boolean = false;
  iframeLoaded: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setUrl(this.url);
  }

  loadIframe(): void {
    this.iframeLoaded = true;
  }

  public openLinkDialog(): void {
    const data: TeLinkDialogInput = {
      title: 'teTextEditor.youtube_video',
      isYoutube: true,
    };
    this.dialogService
      .openSmallDialog(TeLinkDialogComponent, { data })
      .afterClosed()
      .subscribe((url: string) => this.setUrl(url));
  }

  private setUrl(url?: string): void {
    if (url && ClYoutubeHelper.isYoutubeUrl(url)) {
      const embedUrl = ClYoutubeHelper.isYoutubeEmbedVideoUrl(url)
        ? url
        : ClYoutubeHelper.convertToEmbedUrl(url);
      const sanitizedUrl = embedUrl == null ? null : this.sanitize.sanitize(SecurityContext.URL, embedUrl);

      if (embedUrl == null || sanitizedUrl == null) {
        this.urlError = true;
        this.url = url;
        return;
      }

      this.sanitizedUrl = this.sanitize.bypassSecurityTrustResourceUrl(sanitizedUrl);

      const videoId = ClYoutubeHelper.getYoutubeVideoId(embedUrl);
      this.thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

      this.urlError = false;
      this.iframeLoaded = false;
      this.url = embedUrl;
      return;
    }
    this.urlError = true;
    this.url = url;
  }
}
