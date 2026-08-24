import { ChangeDetectionStrategy,Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
 * space/external opens, and `?redirect_to=<in-app path>` when the nginx fallback routed a shared app
 * URL here). The backend exposes only JSON APIs; the front owns the URL, the auth hop, the progress
 * UI, and all navigation.
 *
 * Flow:
 *  1. On load, `POST /apps/gateway/start {app_key, code?}`.
 *     - 200 → keep `status_token` AND `authorize_grant`, poll `/apps/process/{status_token}/status`
 *       ~1s, show progress.
 *     - 401 → not authenticated → redirect to `/login?redirect_uri={this front URL}` (front→front).
 *  2. On `status === 'RUNNING'` → `POST /apps/gateway/handoff {app_key, authorize_grant}` → navigate
 *     the browser to the returned `app_url` (carries `?gws_code=…`, which the app exchanges + scrubs),
 *     with `redirect_to` merged into its path when present.
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RvResourceViewModule, MatButton, FlTranslateModule],
})
export class LabOpenAppPageComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private appService = inject(LiAppService);

  // ~1s poll cadence for the gateway page (the in-datalab panel polls slower, 5s).
  private static readonly STATUS_POLL_INTERVAL = 1000;

  status = signal<RvAppStatus>('STARTING');
  statusText = signal<string | undefined>(undefined);

  // Translation key of a terminal open failure (no app to open): the nginx fallback resolver
  // redirects here with ?error=<reason> for a shared URL that maps to no app. Set means `start` was
  // never called and Retry is hidden — there is nothing to retry.
  // Kept separate from statusText, which carries raw server text that must not go through translate.
  errorMessageKey = signal<string | undefined>(undefined);

  // Display status for the progress UI. RUNNING is a transient "handing off now" state on this page
  // (we immediately redirect into the app), so show the "starting" look — never the error branch,
  // which rv-app-progress renders for any non-STARTING status.
  displayStatus = computed<RvAppStatus>(() => (this.status() === 'STOPPED' ? 'STOPPED' : 'STARTING'));

  private appKey: string | null = null;
  // One-time code for space/external opens (absent for from-lab opens which use the session cookie).
  private code?: string;
  // In-app path to land on after the handoff (e.g. `/config`), set when the nginx fallback routed a
  // shared app URL here: the app's own host only serves a server block while it runs, so a shared
  // URL of a stopped app arrives via the fallback, which forwards the originally requested path.
  private redirectTo?: string;
  // Grant returned by `start`, kept in page state and sent back verbatim to `handoff`.
  // String for an AUTHENTICATED app, null for a PUBLIC one. Single-use (10 min lifetime).
  private authorizeGrant: string | null = null;

  private pollSubscription?: Subscription;

  ngOnInit(): void {
    this.appKey = this.activatedRoute.snapshot.paramMap.get('appKey');
    this.code = this.activatedRoute.snapshot.queryParamMap.get('code') ?? undefined;
    // queryParamMap already URL-decodes: do not decode again, or an encoded slash in the path
    // (`%2F`) would be turned into a real separator.
    this.redirectTo = this.activatedRoute.snapshot.queryParamMap.get('redirect_to') ?? undefined;

    // The fallback resolver sends unknown app URLs here with ?error=<reason>. Render the message and
    // stop: there is no app to start, so calling `start` would only produce a second, confusing failure.
    const error = this.activatedRoute.snapshot.queryParamMap.get('error');
    if (error) {
      this.showTerminalError(error);
      return;
    }

    this.start();
  }

  /**
   * Render a terminal open failure, reusing the page's existing error UI.
   *
   * The reason comes from an untrusted query param, so it is mapped through a known-key allowlist to
   * a translation key — never interpolated into the UI — and anything unrecognised falls back to the
   * generic message.
   */
  private showTerminalError(error: string): void {
    const messageKeys: Record<string, string> = {
      invalid_host: 'g.open_app_error_invalid_host',
      app_not_found: 'g.open_app_error_app_not_found',
    };

    this.errorMessageKey.set(messageKeys[error] ?? 'g.open_app_error_generic');
    this.status.set('STOPPED');
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
      // A from-lab session then exists, so the code is not resent (it was single-use anyway) — but
      // every OTHER query param must survive the hop, or a logged-out visitor following a shared
      // deep link loses `redirect_to` and lands on the app root after logging in.
      const params = new URLSearchParams(window.location.search);
      params.delete('code');
      const query = params.toString();
      const redirectUri = `/${LI_CONST_OPEN_ROUTE}/app/${this.appKey}${query ? `?${query}` : ''}`;
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
        window.location.href = LabOpenAppPageComponent.applyRedirectTo(result.app_url, this.redirectTo);
      },
      error: () => this.onError(),
    });
  }

  /**
   * Merge the requested in-app path into the handoff URL, so a shared deep link lands where the
   * user asked instead of the app root.
   *
   * The handoff URL's own query must survive: it carries the single-use `gws_code` that is the
   * app's only credential, so only the path is replaced and `gws_code` always wins a key collision
   * (a deep link must not be able to forge it). Off-origin targets are rejected — the backend
   * sanitises too, but this page can also be reached with a hand-written query string.
   */
  private static applyRedirectTo(appUrl: string, redirectTo?: string): string {
    if (!redirectTo) {
      return appUrl;
    }
    // Same-origin, path-only targets only: reject absolute URLs, protocol-relative and backslash tricks.
    if (!redirectTo.startsWith('/') || redirectTo.startsWith('//') || redirectTo.includes('\\')) {
      return appUrl;
    }

    const target = new URL(appUrl);
    const requested = new URL(redirectTo, target.origin);

    target.pathname = requested.pathname;
    requested.searchParams.forEach((value, key) => {
      if (!target.searchParams.has(key)) {
        target.searchParams.set(key, value);
      }
    });
    return target.toString();
  }

  private onError(): void {
    this.status.set('STOPPED');
  }

  retry(): void {
    this.start();
  }
}
