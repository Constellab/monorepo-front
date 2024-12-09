import { Component, input, OnInit } from '@angular/core';
import { HaShareButtonElement } from '../../model/ha-share.class';
import { HaMetadataService } from '../../../../ha-service/ha-metadata.service';

@Component({
  selector: 'ha-share-button',
  templateUrl: './ha-share-button.component.html',
  styleUrl: './ha-share-button.component.scss',
})
export class HaShareButtonComponent implements OnInit {
  shareToMedium = input<boolean>();

  isEditor = input<boolean>();

  shareButtonElements: HaShareButtonElement[] = [];

  constructor(private metaService: HaMetadataService) {}

  ngOnInit(): void {
    this.setShareButtonElements();
  }

  onShareToMedium(): void {
    const pageUrl = this.metaService.getMetaTag('og:url');
    const mediumImportUrl = `https://medium.com/p/import`;
    // copy link to clipboard
    navigator.clipboard.writeText(pageUrl);
    // open medium import page
    window.open(mediumImportUrl, '_blank');
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
