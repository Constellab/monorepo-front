import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import {
  LI_CONST_OPEN_ROUTE,
  LiAppProcessStartingStatus,
  LiAppService,
  LiRouterService,
} from '@monorepo/lab-lib/li-core';
import { RvAppStatus, RvResourceViewModule } from '@monorepo/resource-view';
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';

/**
 * Front-owned app-link gateway page: the entrypoint AND the progress screen in one.
 *
 * This is the stable, bookmarkable URL `{front}/open/app/:appKey` (optionally `?code=<one-time>` for
 * space/external opens). The backend exposes only JSON APIs; the front owns the URL, the auth hop,
 * the progress UI, and all navigation.
 *
 * Flow:
 *  1. On load, `POST /apps/gateway/start {app_key, code?}`.
 *     - 200 → keep `status_token` AND `authorize_grant`, poll `/apps/process/{status_token}/status`
 *       ~1s, show progress.
 *     - 401 → not authenticated → redirect to `/login?redirect_uri={this front URL}` (front→front).
 *  2. On `status === 'RUNNING'` → `POST /apps/gateway/handoff {app_key, authorize_grant}` → navigate
 *     the browser to the returned `app_url` (carries `?gws_code=…`, which the app exchanges + scrubs).
 *     `authorize_grant` is single-use, so handoff is called exactly once per open.
 *  3. On `status === 'STOPPED'`/error → show `status_text` + Retry (re-calls start).
 *
 * Must be reachable directly (bookmark) and NOT behind an auth guard that discards the redirect_uri:
 * the 401→login→back flow is the intended auth path. The handoff call + final navigation rely on the
 * lab session cookie reaching :3000 (same-domain, cross-port) — kept as normal XHR + top-level nav.
 */
@Component({
  selector: 'lab-open-app-page',
  templateUrl: './lab-open-app-page.component.html',
  styleUrl: './lab-open-app-page.component.scss',
  imports: [RvResourceViewModule, MatButton, FlTranslateModule],
})
export class LabOpenAppPageComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private appService = inject(LiAppService);

  // ~1s poll cadence for the gateway page (the in-datalab panel polls slower, 5s).
  private static readonly STATUS_POLL_INTERVAL = 1000;

  status = signal<RvAppStatus>('STARTING');
  statusText = signal<string | undefined>(undefined);

  // Display status for the progress UI. RUNNING is a transient "handing off now" state on this page
  // (we immediately redirect into the app), so show the "starting" look — never the error branch,
  // which rv-app-progress renders for any non-STARTING status.
  displayStatus = computed<RvAppStatus>(() => (this.status() === 'STOPPED' ? 'STOPPED' : 'STARTING'));

  private appKey: string | null = null;
  // One-time code for space/external opens (absent for from-lab opens which use the session cookie).
  private code?: string;
  // Grant returned by `start`, kept in page state and sent back verbatim to `handoff`.
  // String for an AUTHENTICATED app, null for a PUBLIC one. Single-use (10 min lifetime).
  private authorizeGrant: string | null = null;

  private pollSubscription?: Subscription;

  ngOnInit(): void {
    this.appKey = this.activatedRoute.snapshot.paramMap.get('appKey');
    this.code = this.activatedRoute.snapshot.queryParamMap.get('code') ?? undefined;

    this.start();
  }

  ngOnDestroy(): void {
    this.pollSubscription?.unsubscribe();
  }

  private start(): void {
    // Missing/misconfigured route param: nothing to open, so fail fast instead of firing an invalid request.
    if (!this.appKey) {
      this.onError();
      return;
    }

    this.status.set('STARTING');
    this.statusText.set(undefined);
    this.authorizeGrant = null;
    this.pollSubscription?.unsubscribe();

    // Suppress the default error snackbar: 401 is an expected control-flow signal (→ login).
    this.appService.gatewayStart(this.appKey, this.code, { hideSnackBarError: true }).subscribe({
      next: (result) => {
        // Keep the grant for handoff (string for AUTHENTICATED apps, null for PUBLIC ones).
        this.authorizeGrant = result.authorize_grant;
        this.startPolling(result.status_token);
      },
      error: (error: FlServerError) => this.onStartError(error),
    });
  }

  private onStartError(error: FlServerError): void {
    if (error?.response?.status === 401) {
      // Not authenticated: redirect to the lab login, which returns here after login (front→front).
      // A from-lab session then exists, so the code is not resent (it was single-use anyway).
      const redirectUri = `/${LI_CONST_OPEN_ROUTE}/app/${this.appKey}`;
      window.location.href = `${LiRouterService.getLoginRoute()}?redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;
      return;
    }
    this.onError();
  }

  private startPolling(statusToken: string): void {
    this.pollSubscription = interval(LabOpenAppPageComponent.STATUS_POLL_INTERVAL)
      .pipe(
        switchMap(() => this.appService.getProcessStatus(statusToken)),
        takeWhile((status) => status.status === 'STARTING', true)
      )
      .subscribe({
        next: (status) => this.onStatus(status),
        error: () => this.onError(),
      });
  }

  private onStatus(status: LiAppProcessStartingStatus): void {
    this.status.set(status.status);

    if (status.status === 'RUNNING') {
      // Keep the "starting" spinner (no RUNNING status text) while we hand off into the app.
      this.statusText.set(undefined);
      this.handoff();
    } else {
      this.statusText.set(status.status_text);
    }
  }

  private handoff(): void {
    this.appService.gatewayHandoff(this.appKey, this.authorizeGrant).subscribe({
      next: (result) => {
        // Full-page navigation into the app host (carries ?gws_code=…, exchanged + scrubbed by the app).
        window.location.href = result.app_url;
      },
      error: () => this.onError(),
    });
  }

  private onError(): void {
    this.status.set('STOPPED');
  }

  retry(): void {
    this.start();
  }
}
