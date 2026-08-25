import { HaEnvironmentHelper } from './ha-environment.helper';

/**
 * OAuth 2.1 authorization flow, used by MCP clients (like Claude) to access the community doc
 * with a Constellab authentication.
 *
 * The API is the authorization server, the front has a single responsibility in the flow:
 * when GET <api>/oauth/authorize finds no valid Constellab session, the API redirects the browser
 * to /login?returnUrl=<the full authorize url>. Once logged in, the front sends the user back to
 * that url so the API can resume the flow.
 *
 * The front never handles any token: it sees neither the authorization code nor the access token,
 * the session cookie is httpOnly and set by the API.
 */
export class HaOauthHelper {
  /**
   * Name of the login page query param holding the url to come back to after login.
   * Must match the back configuration (frontLoginUrl in hn-oauth.config.ts).
   */
  public static readonly RETURN_URL_QUERY_PARAM = 'returnUrl';

  private static readonly AUTHORIZE_PATH = '/oauth/authorize';

  /**
   * Validate a returnUrl before redirecting to it, otherwise the login page becomes an open
   * redirect (/login?returnUrl=https://phishing.example would send the user to the attacker
   * right after login, with the Constellab domain as a warranty).
   *
   * Only the /oauth/authorize endpoint of the API known by the front config is accepted.
   *
   * @returns the url to redirect to (unmodified, the whole OAuth query string must stay intact),
   * or null if it must be ignored.
   */
  public static getSafeAuthorizeReturnUrl(returnUrl: string | null | undefined): string | null {
    if (!returnUrl) {
      return null;
    }

    const url: URL | null = HaOauthHelper.parseUrl(returnUrl);
    const apiUrl: URL | null = HaOauthHelper.parseUrl(HaEnvironmentHelper.getApiUrl());
    if (!url || !apiUrl) {
      return null;
    }

    if (url.origin !== apiUrl.origin) {
      return null;
    }

    // the api may be served under a base path, build the expected path from it
    const authorizePath: string = apiUrl.pathname.replace(/\/+$/, '') + HaOauthHelper.AUTHORIZE_PATH;
    if (url.pathname !== authorizePath && !url.pathname.startsWith(`${authorizePath}/`)) {
      return null;
    }

    return returnUrl;
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
