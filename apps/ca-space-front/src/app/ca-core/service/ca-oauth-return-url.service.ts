import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { CaEnvironmentHelper } from '../utils/ca-environment.helper';

/**
 * The front's only part in the OAuth 2.1 authorization flow machine clients (an AI client today, the
 * CLI later) use to reach the platform with a Constellab authentication.
 *
 * The API is the authorization server. When GET <api>/oauth/authorize finds no valid session, it
 * redirects the browser to /login?returnUrl=<the whole authorize url>. Once the visitor is logged
 * in, the front sends them back to that url so the API can resume the flow where it stopped -
 * without it the visitor logs in successfully and lands on the platform home page, with the client
 * still waiting for a flow that never completes.
 *
 * The front never handles a token: it sees neither the authorization code nor the access token, and
 * the session cookies are httpOnly and set by the API.
 *
 * Everything that knows about the contract with the API lives here - the param name, which url is
 * acceptable, and how to follow it - so a caller has one thing to ask and one thing to obey.
 *
 * Deliberately a copy of HaOauthHelper, which does the same job in ha-community-front against the
 * community API. The two are NOT to be merged: the parent work moves the authorization server to the
 * Space API and then deletes the community's authorize endpoint, taking its copy with it. Until then,
 * keep the method name and the accepted paths identical so a fix to one is greppable from the other.
 */
@Injectable({
  providedIn: 'root',
})
export class CaOauthReturnUrlService {
  private document = inject<Document>(DOCUMENT);

  /**
   * Name of the login page query param holding the url to come back to after login.
   * Must match the back configuration (frontLoginUrl of the authorization server).
   *
   * Public because the API is not the only one to send a visitor to login with a url to come back
   * to: the consent page does it too when the session died under it, and the two must spell the
   * param the same way for the login page to read either.
   */
  public static readonly RETURN_URL_QUERY_PARAM: string = 'returnUrl';

  /**
   * The only endpoint a return url may point at. Narrower than "the API", on purpose: it is the one
   * endpoint that ever sends a visitor here, so accepting anything else would widen the target for
   * no use. The authorization server is mounted from a shared library, so this is the same path the
   * community front already trusts - including its sub-paths, so a trailing slash or a segment the
   * server appends does not read as an attack and abandon the flow.
   */
  private static readonly AUTHORIZE_PATH: string = '/oauth/authorize';

  /**
   * The return url carried by the login page query params, refusing anything that is not the API's
   * authorize endpoint. Without that check the login page is an open redirect, and
   * /login?returnUrl=https://phishing.example would hand the visitor to the attacker the moment
   * they log in, with the Constellab domain as a warranty.
   *
   * @returns the url to come back to, byte for byte - the whole OAuth query string is the API's
   * business and normalising it breaks the flow - or null when there is nothing safe to honour, in
   * which case the caller falls back to its usual landing page.
   */
  public getSafeAuthorizeReturnUrl(queryParams: Params): string | null {
    const returnUrl: string = queryParams?.[CaOauthReturnUrlService.RETURN_URL_QUERY_PARAM];
    if (!returnUrl) {
      return null;
    }

    const url: URL | null = CaOauthReturnUrlService.parseUrl(returnUrl);
    const apiUrl: URL | null = CaOauthReturnUrlService.parseUrl(CaEnvironmentHelper.getApiUrl());
    if (!url || !apiUrl) {
      return null;
    }

    if (url.origin !== apiUrl.origin) {
      return null;
    }

    // the api may be served under a base path, so build the expected path from it rather than
    // matching the origin root
    const authorizePath: string =
      apiUrl.pathname.replace(/\/+$/, '') + CaOauthReturnUrlService.AUTHORIZE_PATH;
    if (url.pathname !== authorizePath && !url.pathname.startsWith(`${authorizePath}/`)) {
      return null;
    }

    return returnUrl;
  }

  /**
   * Resume the flow of the machine client. A full browser navigation and not a router one: the
   * target is the API origin, which is not an app route.
   *
   * @param returnUrl must be one getSafeAuthorizeReturnUrl() returned. This does not re-check it:
   * there is one way to obtain a url worth leaving the app for, and it is above.
   */
  public resume(returnUrl: string): void {
    this.document.location.assign(returnUrl);
  }

  /**
   * @returns the parsed url, or null if it is not a valid absolute url
   */
  private static parseUrl(value: string): URL | null {
    try {
      return new URL(value);
    } catch {
      return null;
    }
  }
}
