import { Component, inject,input, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem,MatMenuTrigger } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

import { HaMetadataService } from '../../../../ha-service/ha-metadata.service';
import { HaShareButtonElement } from '../../model/ha-share.class';

@Component({
  selector: 'ha-share-button',
  templateUrl: './ha-share-button.component.html',
  styleUrl: './ha-share-button.component.scss',
  imports: [MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, TranslatePipe],
})
export class HaShareButtonComponent implements OnInit {
  private metaService = inject(HaMetadataService);

  shareToMedium = input<boolean>();

  isEditor = input<boolean>();

  shareButtonElements: HaShareButtonElement[] = [];

  ngOnInit(): void {
    this.setShareButtonElements();
  }

  onShareToMedium(): void {
    const pageUrl = this.metaService.getMetaTag('og:url', true);
    const mediumImportUrl = `https://medium.com/p/import`;
    // copy link to clipboard
    navigator.clipboard.writeText(pageUrl);
    // open medium import page with noopener noreferrer
    window.open(mediumImportUrl, '_blank', 'noopener noreferrer');
  }

  private setShareButtonElements(): void {
    this.shareButtonElements = [
      {
        icon: 'facebook',
        url: this.metaService.getFacebookShareUrl(),
        label: 'Facebook',
      },
      {
        icon: 'x',
        url: this.metaService.getTwitterShareUrl(),
        label: 'X',
      },
      {
        icon: 'linkedin',
        url: this.metaService.getLinkedInShareUrl(),
        label: 'LinkedIn',
      },
    ];
  }
}
