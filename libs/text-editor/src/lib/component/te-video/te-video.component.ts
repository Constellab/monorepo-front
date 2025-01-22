import { Component, Input, OnInit, SecurityContext, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ClYoutubeHelper } from '@monorepo/core-lib';
import { TeElementBlockDirective } from '../../model/te-element.directive';
import { FlDialogService } from '@monorepo/front-core-lib';
import { TeLinkDialogComponent, TeLinkDialogInput } from '../te-link-dialog/te-link-dialog.component';

@Component({
  selector: 'te-video',
  templateUrl: './te-video.component.html',
  styleUrls: ['./te-video.component.scss'],
  standalone: false,
})
export class TeVideoComponent extends TeElementBlockDirective implements OnInit {
  private sanitize = inject(DomSanitizer);
  private dialogService = inject(FlDialogService);

  @Input() url: string;

  @Input() videoTitle: string;

  @Input() caption: string;

  sanitizedUrl: SafeUrl;
  urlError: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setUrl(this.url);
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
      if (!ClYoutubeHelper.isYoutubeEmbedVideoUrl(url)) {
        url = ClYoutubeHelper.convertToEmbedUrl(url);
      }

      this.sanitizedUrl = this.sanitize.bypassSecurityTrustResourceUrl(
        this.sanitize.sanitize(SecurityContext.URL, url)
      );
      this.urlError = false;
    } else {
      this.urlError = true;
    }
    this.url = url;
  }
}
