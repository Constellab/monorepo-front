import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RvResourceViewApp } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

/**
 * Show app in an iframe
 * It passes the query params to the iframe
 */
@Component({
  selector: 'rv-view-app',
  templateUrl: './rv-view-app.component.html',
  styleUrl: './rv-view-app.component.scss',
  standalone: false,
})
export class RvViewAppComponent extends RvResourceViewDirective<RvResourceViewApp> implements OnInit {
  private sanitize = inject(DomSanitizer);
  private route = inject(ActivatedRoute);

  iframeUrl: SafeUrl;

  ngOnInit(): void {
    this.route.queryParams.subscribe((urlsParams) => {
      let url = this.view.data.url.host_url;

      const params: Record<string, string> = this.view.data.url.params;

      if (this.moduleConfig.enableQueryParams()) {
        // merge the front url params with the url params of the app
        for (const key in urlsParams) {
          // skip the key if it is already in the url
          if (!params[key]) {
            params[key] = urlsParams[key];
          }
        }
      }

      if (Object.keys(params).length > 0) {
        url +=
          '?' +
          Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
      }
      this.iframeUrl = this.sanitize.bypassSecurityTrustResourceUrl(url);
    });
  }
}
