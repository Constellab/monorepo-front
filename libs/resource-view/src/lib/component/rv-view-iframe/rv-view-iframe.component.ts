import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { RvResourceViewIframe } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

@Component({
  selector: 'rv-view-iframe',
  templateUrl: './rv-view-iframe.component.html',
  styleUrl: './rv-view-iframe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RvViewIframeComponent extends RvResourceViewDirective<RvResourceViewIframe> implements OnInit {
  private sanitizer = inject(DomSanitizer);

  iframeUrl: SafeUrl;

  ngOnInit(): void {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.view.data.src);
  }
}
