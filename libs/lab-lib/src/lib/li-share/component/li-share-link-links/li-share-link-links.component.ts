import { Component, inject, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiShareLink } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-share-link-links',
  templateUrl: './li-share-link-links.component.html',
  styleUrl: './li-share-link-links.component.scss',
  imports: [MatTooltip, TranslatePipe],
})
export class LiShareLinkLinksComponent {
  shareLink = input.required<LiShareLink>();

  private clipboardService = inject(FlClipboardService);

  copyDownloadLink(): void {
    this.clipboardService.copy(this.shareLink().downloadLink, {
      text: 'li.share_link_copied',
      translateText: true,
    });
  }

  copyPreviewLink(): void {
    this.clipboardService.copy(this.shareLink().previewLink, {
      text: 'li.share_link_copied',
      translateText: true,
    });
  }
}
