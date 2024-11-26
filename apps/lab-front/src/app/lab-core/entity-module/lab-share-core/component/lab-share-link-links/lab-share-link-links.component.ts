import { Component, inject, input } from '@angular/core';
import { LabShareLink } from '../../../../model/entities/lab-share.entity';
import { FlClipboardService } from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-share-link-links',
  templateUrl: './lab-share-link-links.component.html',
  styleUrl: './lab-share-link-links.component.scss',
})
export class LabShareLinkLinksComponent {
  shareLink = input.required<LabShareLink>();

  private clipboardService = inject(FlClipboardService);

  copyDownloadLink(): void {
    this.clipboardService.copy(this.shareLink().downloadLink, {
      text: 'biox.share_link_copied',
      translateText: true,
    });
  }

  copyPreviewLink(): void {
    this.clipboardService.copy(this.shareLink().previewLink, {
      text: 'biox.share_link_copied',
      translateText: true,
    });
  }
}
