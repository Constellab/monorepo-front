import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiAuthenticatedUserService, LiAuthService, LiSystemService } from '@monorepo/lab-lib/li-core';

import { LabEnvStore } from '../../lab-core/lab-env.store';
import { LabEnvironmentHelper } from '../../lab-core/lab-environment.helper';
import { LabMcpConsentService } from '../service/lab-mcp-consent.service';

/**
 * MCP OAuth consent page — the single human gate in the lab-driven OAuth flow that lets an external
 * MCP client (Claude Code on a developer's machine) act as the user against this lab's data.
 *
 * Where it sits in the flow: the lab API redirects the browser here with an opaque `login_state`.
 * This page requires a lab session, shows what "Claude Code" will be able to do, and on Allow fetches
 * a single-use code then full-page-navigates to `{API_URL}/mcp-auth/consent?login_state=…&code=…`,
 * which the backend validates and 302s back to Claude. The page's job ends at that redirect.
 *
 * Hard rules (see the spec):
 *  - `login_state` is passed through VERBATIM and sent nowhere except the consent URL above. Missing
 *    `login_state` → error, no API call.
 *  - The one-time code is fetched INSIDE the Allow handler (it expires in 60s) and is never stored,
 *    logged, or persisted. Fetch, redirect, forget.
 *  - No auto-submit: consent requires a real click, and Deny is as reachable as Allow.
 *  - We never follow any URL from the query string; the only navigation target is the API_URL one.
 */
type LabMcpConsentStatus = 'INVALID_LINK' | 'READY' | 'AUTHORIZING' | 'ERROR';

@Component({
  selector: 'lab-mcp-consent-page',
  templateUrl: './lab-mcp-consent-page.component.html',
  styleUrl: './lab-mcp-consent-page.component.scss',
  imports: [MatButton, FlTranslateModule],
})
export class LabMcpConsentPageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(LiAuthService);
  private authenticatedUserService = inject(LiAuthenticatedUserService);
  private systemService = inject(LiSystemService);
  private consentService = inject(LabMcpConsentService);
  private labEnvStore = inject(LabEnvStore);

  // The client asking for access. Hard-coded: this flow only ever serves Claude Code.
  readonly clientName = 'Claude Code';

  status = signal<LabMcpConsentStatus>('READY');
  labName = signal<string | undefined>(undefined);
  userEmail = signal<string | undefined>(undefined);

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
    // intact (the login page whitelists /mcp-consent and preserves the return URL).
    if (!this.authService.hasAuthorizationCookie()) {
      this.redirectToLogin();
      return;
    }

    this.loadContext();
  }

  /**
   * Load the info the user needs to make the decision: which lab, and as whom. Both are read-only
   * context — NOT the consent code (that is fetched only on Allow, per the 60s expiry).
   */
  private loadContext(): void {
    this.systemService.getSystemInfo().subscribe({
      next: (systemInfo) => this.labName.set(systemInfo.lab.name),
      // Non-fatal: the consent decision can still be made without the lab name shown.
    });

    // The authenticated user is loaded lazily by the main shell, which this standalone page bypasses.
    const currentUser = this.authenticatedUserService.getCurrentUser();
    if (currentUser) {
      this.userEmail.set(currentUser.email);
    } else {
      this.authenticatedUserService.getUser$().subscribe((user) => {
        if (user) {
          this.userEmail.set(user.email);
        }
      });
      this.authenticatedUserService.loadAuthenticatedUser();
    }
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

    this.consentService.getConsentCode().subscribe({
      next: (code) => this.redirectToConsent(code),
      error: (error: FlServerError) => this.onConsentCodeError(error),
    });
  }

  /**
   * Deny: never call the backend. Leave the page; the pending authorization expires on its own and
   * Claude reports that the login did not complete.
   */
  deny(): void {
    window.location.href = '/';
  }

  retry(): void {
    // Re-run the Allow handler: fetch a fresh code and redirect. The previous code (if any) expired.
    this.allow();
  }

  private onConsentCodeError(error: FlServerError): void {
    if (error?.response?.status === 401) {
      // Session expired between page load and click → re-authenticate and return here.
      this.redirectToLogin();
      return;
    }
    this.status.set('ERROR');
  }

  private redirectToConsent(code: string): void {
    // Full-page navigation (NOT XHR): the backend answers with a 302 the browser must follow.
    // login_state and code are the only things sent, and only to this API_URL endpoint.
    const url =
      `${this.getApiBaseUrl()}/mcp-auth/consent` +
      `?login_state=${encodeURIComponent(this.loginState)}` +
      `&code=${encodeURIComponent(code)}`;
    window.location.href = url;
  }

  private redirectToLogin(): void {
    const returnUrl = `/mcp-consent?login_state=${encodeURIComponent(this.loginState)}`;
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
