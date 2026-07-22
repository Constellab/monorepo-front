import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiAuthService } from '@monorepo/lab-lib/li-core';

import { LabEnvStore } from '../../lab-core/lab-env.store';
import { LabEnvironmentHelper } from '../../lab-core/lab-environment.helper';
import { LabOAuthConsentDetails } from '../model/lab-oauth-consent-details.class';
import { LabOAuthConsentService } from '../service/lab-oauth-consent.service';

/**
 * OAuth consent page — the single human gate in the lab-driven OAuth flow that lets an external
 * client (Claude Code today, others later) act as the user against this lab's data.
 *
 * Where it sits in the flow: the lab API redirects the browser here with an opaque `login_state`.
 * This page requires a lab session, asks the backend what is being authorized
 * (`GET user/oauth-consent-details`), renders that truth, and on Allow fetches a single-use code then
 * full-page-navigates to `{API_URL}/oauth-auth/consent?login_state=…&code=…`, which the backend
 * validates and 302s back to the client. The page's job ends at that redirect.
 *
 * Hard rules (see the v2 spec):
 *  - NOTHING about the client or its access is hardcoded — it all comes from the details response.
 *  - `client_name` is ATTACKER-CONTROLLED: framed as an unverified claim, escaped (Angular `{{}}`
 *    escapes), never rendered as HTML or allowed to influence styling. No client logo/homepage.
 *  - `login_state` is passed through VERBATIM and sent nowhere except the consent URL. Missing
 *    `login_state`, or details 404 (expired/used) → error, NO consent screen.
 *  - The one-time code is fetched INSIDE the Allow handler (it expires in 60s) and is never stored,
 *    logged, or persisted. Fetch, redirect, forget.
 *  - No auto-submit: consent requires a real click, and Deny is as reachable/prominent as Allow.
 *  - We never follow any URL from the query string; the only navigation target is the API_URL one.
 */
type LabOAuthConsentStatus = 'LOADING' | 'READY' | 'AUTHORIZING' | 'INVALID_LINK' | 'EXPIRED' | 'ERROR';

@Component({
  selector: 'lab-oauth-consent-page',
  templateUrl: './lab-oauth-consent-page.component.html',
  styleUrl: './lab-oauth-consent-page.component.scss',
  imports: [MatButton, FlTranslateModule],
})
export class LabOAuthConsentPageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(LiAuthService);
  private consentService = inject(LabOAuthConsentService);
  private labEnvStore = inject(LabEnvStore);

  status = signal<LabOAuthConsentStatus>('LOADING');
  details = signal<LabOAuthConsentDetails | undefined>(undefined);

  // Set when a code fetch failed (non-401) so the READY view can surface a retryable inline error.
  codeError = signal<boolean>(false);

  // Opaque pending-authorization identifier from the backend redirect. Kept verbatim, never parsed.
  private loginState: string | null = null;

  ngOnInit(): void {
    this.loginState = this.activatedRoute.snapshot.queryParamMap.get('login_state');

    // Missing/empty login_state: the link is unusable. Fail fast, do not call the API.
    if (!this.loginState) {
      this.status.set('INVALID_LINK');
      return;
    }

    // Require a lab session. If absent, bounce through login and come back here with login_state
    // intact (the login page whitelists /oauth-consent and preserves the return URL).
    if (!this.authService.hasAuthorizationCookie()) {
      this.redirectToLogin();
      return;
    }

    this.loadDetails();
  }

  /**
   * Fetch what is being authorized. Safe on load: the response is a description, not a credential.
   * This is what drives every piece of copy on the page — nothing is hardcoded.
   */
  private loadDetails(): void {
    this.status.set('LOADING');
    this.consentService.getConsentDetails(this.loginState).subscribe({
      next: (details) => {
        this.details.set(details);
        this.status.set('READY');
      },
      error: (error: FlServerError) => this.onDetailsError(error),
    });
  }

  private onDetailsError(error: FlServerError): void {
    const httpStatus = error?.response?.status;
    if (httpStatus === 401) {
      // Session expired between the cookie check and this call → re-authenticate and return here.
      this.redirectToLogin();
      return;
    }
    if (httpStatus === 404) {
      // The pending authorization is unknown/expired/already used: there is nothing valid to consent
      // to, so we must NOT render a consent screen.
      this.status.set('EXPIRED');
      return;
    }
    this.status.set('ERROR');
  }

  /**
   * Allow: fetch the single-use code NOW (it expires in 60s), then immediately full-page-navigate
   * to the backend consent endpoint. The code lives only in this call chain — never stored or logged.
   */
  allow(): void {
    if (!this.loginState) {
      // Defensive: the button is not rendered without a valid login_state, but never redirect blind.
      this.status.set('INVALID_LINK');
      return;
    }

    this.status.set('AUTHORIZING');
    this.codeError.set(false);

    this.consentService.getConsentCode().subscribe({
      next: (code) => this.redirectToConsent(code),
      error: (error: FlServerError) => this.onConsentCodeError(error),
    });
  }

  /**
   * Deny: never call the backend. Leave the page; the pending authorization expires on its own and
   * the client reports that the login did not complete.
   */
  deny(): void {
    window.location.href = '/';
  }

  /** Retry the failed details load (from the ERROR state). */
  retryLoad(): void {
    this.loadDetails();
  }

  private onConsentCodeError(error: FlServerError): void {
    if (error?.response?.status === 401) {
      // Session expired between page load and click → re-authenticate and return here.
      this.redirectToLogin();
      return;
    }
    // Any other error: back to READY so the user can retry the Allow click with a fresh code.
    this.status.set('READY');
    this.codeError.set(true);
  }

  private redirectToConsent(code: string): void {
    // Full-page navigation (NOT XHR): the backend answers with a 302 the browser must follow.
    // login_state and code are the only things sent, and only to this API_URL endpoint.
    const url =
      `${this.getApiBaseUrl()}/oauth-auth/consent` +
      `?login_state=${encodeURIComponent(this.loginState)}` +
      `&code=${encodeURIComponent(code)}`;
    window.location.href = url;
  }

  private redirectToLogin(): void {
    const returnUrl = `/oauth-consent?login_state=${encodeURIComponent(this.loginState)}`;
    window.location.href = `/login?redirect_uri=${encodeURIComponent(returnUrl)}`;
  }

  /**
   * Base lab API URL (e.g. https://glab-dev.rio.gencovery.io), WITHOUT the /core-api suffix — the
   * consent endpoint lives at the API root. Resolved the same dev/prod way as every core-api call.
   */
  private getApiBaseUrl(): string {
    return this.labEnvStore.isDev()
      ? LabEnvironmentHelper.getDevBaseApiUrl()
      : LabEnvironmentHelper.getBaseApiUrl();
  }
}
