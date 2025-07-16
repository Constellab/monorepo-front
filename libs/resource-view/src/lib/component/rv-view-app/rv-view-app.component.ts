import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { RvResourceViewApp } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

export interface RvAppProcessStatus {
  status: 'RUNNING' | 'STOPPED' | 'STARTING';

  status_text?: string;
}

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
export class RvViewAppComponent
  extends RvResourceViewDirective<RvResourceViewApp>
  implements OnInit, OnDestroy
{
  private sanitize = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  iframeUrl: SafeUrl;
  currentStatus: 'RUNNING' | 'STOPPED' | 'STARTING';
  statusText?: string;
  isLoading = false;

  private statusCheckSubscription?: Subscription;

  private readonly STATUS_REFRESH_INTERVAL = 5000; // 5 seconds

  ngOnInit(): void {
    // Initialize status from the view data
    this.onStatus(this.view.data.status, this.view.data.status_text);

    // Start status checking if needed
    if (this.currentStatus === 'STARTING') {
      this.startStatusPolling();
    }

    this.route.queryParams.subscribe((urlsParams) => {
      this.buildIframeUrl(urlsParams);
    });
  }

  ngOnDestroy(): void {
    if (this.statusCheckSubscription) {
      this.statusCheckSubscription.unsubscribe();
    }
  }

  private startStatusPolling(): void {
    this.statusCheckSubscription = interval(this.STATUS_REFRESH_INTERVAL)
      .pipe(
        switchMap(() => this.getAppStatus()),
        takeWhile((status) => status.status === 'STARTING', true)
      )
      .subscribe({
        next: (status) => {
          this.onStatus(status.status, status.status_text);
        },
        error: (error) => {
          console.error('Error checking app status:', error);
          this.currentStatus = 'STOPPED';
          this.statusText = 'Failed to check app status';
          this.isLoading = false;
        },
      });
  }

  private onStatus(status: 'RUNNING' | 'STOPPED' | 'STARTING', statusText?: string): void {
    this.currentStatus = status;
    this.statusText = statusText;

    if (status === 'RUNNING') {
      this.isLoading = false;
    } else {
      this.isLoading = false;
    }
  }

  private buildIframeUrl(urlsParams: any): void {
    let url = this.view.data.app_url.host_url;

    const params: Record<string, string> = this.view.data.app_url.params;

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
  }

  private getAppStatus(): Observable<RvAppProcessStatus> {
    return this.http.get<RvAppProcessStatus>(this.view.data.get_status_route);
  }
}
