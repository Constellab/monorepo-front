import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { CaAuthService } from '../../../ca-login/service/ca-auth.service';
import { CaOauthConsentDetails } from '../../model/ca-oauth-consent-details.class';
import { CaOauthConsentDecision, CaOauthConsentService } from '../../service/ca-oauth-consent.service';

/**
 * What the page is showing. One state, so the template never has to combine two flags and end up
 * offering a decision on a screen that failed to load.
 */
export type CaOauthConsentStatus = 'LOADING' | 'READY' | 'SUBMITTING' | 'INVALID_LINK' | 'EXPIRED' | 'ERROR';

/**
 * The one human gate of the OAuth 2.1 flow a machine client - an AI client today, the CLI later -
 * goes through to act as the visitor across the platform. Outside the app shell, like the login page
 * it follows: a visitor arrives here from the API, not from a menu.
 *
 * A grant reaches everything its owner can reach, in every Space they belong to, so the page has one
 * job: show what is being asked, in words someone can act on, and take an answer. Everything it shows
 * comes from the API - see CaOauthConsentService for the contract and for why the decision leaves the
 * app rather than being posted from here.
 *
 * The rules that matter, all of them things it would be easy to lose in a later edit:
 *
 *  - nothing about the client is hardcoded. A Resource added on the back appears here with no front
 *    deployment, and no list in the front can fall out of step with what is actually being granted;
 *  - the client name is chosen by whoever registered the client, so it is framed as a claim and
 *    rendered through interpolation, which escapes it. The client id is the only identifier that
 *    cannot be forged;
 *  - doing nothing grants nothing. Loading the page asks the API for a description, never for a
 *    credential, and closing it leaves no trace on the back;
 *  - there is no auto submit. A grant needs a real click, and Refuse is as reachable as Allow.
 */
@Component({
  selector: 'ca-oauth-consent-page',
  templateUrl: './ca-oauth-consent-page.component.html',
  styleUrl: './ca-oauth-consent-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButton, MatIcon, FlLoaderModule, TranslatePipe],
})
export class CaOauthConsentPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(CaAuthService);
  private consentService = inject(CaOauthConsentService);
  private themeService = inject(FlThemeService);

  /**
   * Read once, like the login page does: the visitor comes from a client and needs to see whose page
   * is asking before reading a word of it.
   */
  logo: string = this.themeService.getConstellabLogo();

  status: WritableSignal<CaOauthConsentStatus> = signal('LOADING');
  details: WritableSignal<CaOauthConsentDetails | null> = signal(null);

  /** Set when an answer could not be sent, so the decision screen can say so and be tried again. */
  decisionFailed: WritableSignal<boolean> = signal(false);

  /** The pending authorization this page is about. Opaque: kept as given, parsed by nobody here. */
  private consentId: string | null = null;

  ngOnInit(): void {
    this.consentId = this.route.snapshot.queryParamMap.get(CaOauthConsentService.CONSENT_ID_QUERY_PARAM);

    // without it there is nothing to consent to and nothing to ask the API about
    if (!this.consentId) {
      this.status.set('INVALID_LINK');
      return;
    }

    // no marker means certainly no session - the one question a cookie is allowed to answer. Calling
    // the API anyway would end in CaApiErrorService concluding the session is over, which for a
    // visitor who never had one means a "session expired" they did not cause and a saved route
    // stripped of its consent id. It may only ever spare a call: the API still answers for everyone
    // whose marker says "maybe", including one left behind by a session that ended weeks ago.
    if (!this.authService.hasAuthorizationCookie()) {
      this.consentService.goToLogin(this.consentId);
      return;
    }

    this.loadDetails();
  }

  /** Retry a details load that failed, from the error screen. */
  retryLoad(): void {
    this.loadDetails();
  }

  allow(): void {
    this.decide('allow');
  }

  deny(): void {
    this.decide('deny');
  }

  private loadDetails(): void {
    // defensive: only called after ngOnInit's guard (or from a screen shown after it), but never
    // load a details request for a flow we cannot name
    if (!this.consentId) {
      this.status.set('INVALID_LINK');
      return;
    }

    this.status.set('LOADING');
    this.decisionFailed.set(false);

    this.consentService.getDetails(this.consentId).subscribe({
      next: (details: CaOauthConsentDetails) => this.onDetails(details),
      error: (error: FlServerError) => this.onDetailsError(error),
    });
  }

  private onDetails(details: CaOauthConsentDetails): void {
    // approving a list the visitor cannot see is not consent. An answer with no Resource is a back
    // that has changed under us, not a client asking for nothing, so refuse to render the decision.
    if (!details?.resources?.length) {
      this.status.set('ERROR');
      return;
    }

    this.details.set(details);
    this.status.set('READY');
  }

  /**
   * A 401 here means the session is really over: CaHttpRefreshInterceptorService renews and replays
   * an access token that had merely expired, so nothing that could be recovered reaches this point.
   */
  private onDetailsError(error: FlServerError): void {
    const httpStatus: number | undefined = error?.response?.status;

    if (httpStatus === 401 && this.consentId) {
      this.consentService.goToLogin(this.consentId);
      return;
    }

    // the pending authorization is unknown, expired, or already answered: there is nothing valid to
    // consent to, so no decision screen may be shown
    if (httpStatus === 404 || httpStatus === 410) {
      this.status.set('EXPIRED');
      return;
    }

    this.status.set('ERROR');
  }

  private decide(decision: CaOauthConsentDecision): void {
    // defensive: neither button is rendered without a consent id, but never answer for a flow we
    // cannot name
    if (!this.consentId) {
      this.status.set('INVALID_LINK');
      return;
    }

    this.status.set('SUBMITTING');
    this.decisionFailed.set(false);

    this.consentService.decide(this.consentId, decision).subscribe({
      // nothing to do on success: the browser is on its way to the API, which sends it to the client
      next: () => undefined,
      error: (error: FlServerError) => this.onDecisionError(error),
    });
  }

  private onDecisionError(error: FlServerError): void {
    if (error?.response?.status === 401 && this.consentId) {
      this.consentService.goToLogin(this.consentId);
      return;
    }

    // back to the decision. Nothing was granted - the API only ever acts on the navigation that
    // never happened - so the visitor can simply answer again.
    this.status.set('READY');
    this.decisionFailed.set(true);
  }
}
