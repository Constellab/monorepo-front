import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FlApiService, FlServerError } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaOauthReturnUrlService } from '../../ca-core/service/ca-oauth-return-url.service';
import { CaRouterService } from '../../ca-core/service/ca-router.service';
import { CaOauthConsentDetails } from '../model/ca-oauth-consent-details.class';

/** What the visitor answered. Sent to the API as is, so the two names are part of the contract. */
export type CaOauthConsentDecision = 'allow' | 'deny';

/**
 * Everything the front knows about the consent step of the OAuth 2.1 authorization flow: the param
 * names, the routes, and how a decision leaves the app. One place to ask, one place to keep in step
 * with the authorization server - the same arrangement CaOauthReturnUrlService has for the login
 * bounce that precedes this page.
 *
 * The contract, all of it under the authorize path so that a visitor whose session died mid-flow can
 * be sent back through the login page, whose return url check already trusts that path and nothing
 * else:
 *
 *  - the API redirects the browser to `<front>/oauth/consent?consent_id=…` when GET
 *    `<api>/oauth/authorize` finds a session and needs a decision;
 *  - `GET <api>/oauth/authorize/consent/details?consent_id=…` describes what is being asked. 401
 *    when there is no session, 404 once the pending authorization is unknown, expired or decided;
 *  - `POST <api>/oauth/authorize/consent/token` `{consent_id}` mints the single use, short lived
 *    token that makes a decision unforgeable;
 *  - `GET <api>/oauth/authorize/consent/decision?consent_id=…&decision=…&consent_token=…` is a full
 *    page navigation the API answers with a 302 to the client, carrying the code for an allow and
 *    `error=access_denied` for a deny;
 *  - `GET <api>/oauth/authorize/consent?consent_id=…` re-enters the flow after a login, and is the
 *    only url this page ever hands to the login page as a return url.
 *
 * Two rules hold the security of the step together:
 *
 *  - **the front never sees the authorization code**. The decision is a browser navigation, not an
 *    XHR whose answer we would read, so the code exists only between the API and the client. Losing
 *    that would make every future bug on this page a credential leak rather than a broken screen.
 *  - **a decision cannot be forged**. Without the minted token, a page on another origin could make
 *    a logged in visitor's browser approve a pending authorization it started itself, with its own
 *    redirect target - which is account takeover, not a nuisance. The token is minted by an XHR, so
 *    only an origin the API allows can obtain one; it is minted on the click, so abandoning the page
 *    leaves nothing behind; and being single use, it cannot be replayed out of a browser history.
 */
@Injectable({
  providedIn: 'root',
})
export class CaOauthConsentService {
  private apiService = inject(FlApiService);
  private returnUrlService = inject(CaOauthReturnUrlService);
  private router = inject(Router);
  private document = inject<Document>(DOCUMENT);

  /**
   * Name of the query param carrying the pending authorization, both on the page url and on every
   * call about it. Deliberately not called 'state': the client owns a param by that name in the same
   * flow, and confusing the two is how one ends up echoed in place of the other.
   */
  public static readonly CONSENT_ID_QUERY_PARAM: string = 'consent_id';

  /** Base route of the consent step on the API, under the authorize path it belongs to. */
  private static readonly CONSENT_ROUTE: string = 'oauth/authorize/consent';

  /**
   * What is being asked. Safe to call on load: it is a description, not a credential, and asking
   * for it grants nothing.
   *
   * The snackbar is hidden because the page turns each status into its own screen - 401 back to
   * login, 404 a pending authorization that no longer exists - and a toast on top would only repeat
   * it in vaguer words.
   */
  public getDetails(consentId: string): Observable<CaOauthConsentDetails> {
    return this.apiService.get(`${CaOauthConsentService.CONSENT_ROUTE}/details`, CaOauthConsentDetails, {
      hideSnackBarError: true,
      params: { [CaOauthConsentService.CONSENT_ID_QUERY_PARAM]: consentId },
    });
  }

  /**
   * Answer for the visitor and leave the app with it.
   *
   * Minting and leaving are one operation on purpose: the token would be a credential to look after
   * if it ever sat in a component field, and there is no moment in this flow where holding one is
   * useful. Fetch, navigate, forget.
   *
   * @returns an observable that completes as the browser is told to leave - so the caller only ever
   * has to handle its error, which is the case where the page is still there to show something.
   */
  public decide(consentId: string, decision: CaOauthConsentDecision): Observable<void> {
    return this.apiService
      .post(
        `${CaOauthConsentService.CONSENT_ROUTE}/token`,
        { [CaOauthConsentService.CONSENT_ID_QUERY_PARAM]: consentId },
        null,
        { hideSnackBarError: true }
      )
      .pipe(
        // map rather than tap, so the token is dropped here and never reaches a caller that has no
        // business holding one
        map((result: { consent_token: string }) => {
          // an answer without a token is one the API would refuse. Leaving for it anyway would drop
          // the visitor on an API error page with their decision lost and no way back, so fail here
          // instead, where the page is still standing and can offer to try again.
          if (!result?.consent_token) {
            throw <FlServerError>{ response: null, message: 'No consent token in the API answer' };
          }

          this.leaveWithDecision(consentId, decision, result.consent_token);
        })
      );
  }

  /**
   * Send a visitor without a session to the login page, so they come back here once through.
   *
   * They come back through the API rather than straight to this route: the login page honours a
   * return url only when it points at the authorization endpoint, which is what keeps it from being
   * an open redirect, and the API has to re-enter its own flow anyway to know the pending
   * authorization is still worth resuming.
   */
  public goToLogin(consentId: string): void {
    this.router.navigate([CaRouterService.getLoginRoute()], {
      queryParams: {
        [CaOauthReturnUrlService.RETURN_URL_QUERY_PARAM]: this.getResumeUrl(consentId),
      },
    });
  }

  /**
   * A full page navigation, not an XHR: the API answers with a 302 to the client's redirect target
   * that the browser must follow, and the code it carries on the way is none of the front's
   * business.
   */
  private leaveWithDecision(consentId: string, decision: CaOauthConsentDecision, token: string): void {
    const params: string = this.apiService.convertRecordToURLParams({
      [CaOauthConsentService.CONSENT_ID_QUERY_PARAM]: consentId,
      decision,
      consent_token: token,
    });

    this.document.location.assign(
      `${this.apiService.getBaseRouteUrl(`${CaOauthConsentService.CONSENT_ROUTE}/decision`)}?${params}`
    );
  }

  /** The API url that re-enters the flow at its consent step, once a session exists again. */
  private getResumeUrl(consentId: string): string {
    const params: string = this.apiService.convertRecordToURLParams({
      [CaOauthConsentService.CONSENT_ID_QUERY_PARAM]: consentId,
    });

    return `${this.apiService.getBaseRouteUrl(CaOauthConsentService.CONSENT_ROUTE)}?${params}`;
  }
}
