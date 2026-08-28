import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Params } from '@angular/router';

import { CaEnvironmentHelper } from '../utils/ca-environment.helper';
import { CaOauthReturnUrlService } from './ca-oauth-return-url.service';

describe('CaOauthReturnUrlService', () => {
  const API_URL: string = 'http://localhost:3001';

  let service: CaOauthReturnUrlService;
  let assign: ReturnType<typeof vi.fn>;

  /** the query string an authorization request carries, which must reach the API untouched */
  const authorizeQueryString: string = [
    'response_type=code',
    'client_id=e068a0e3',
    'redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallback',
    'code_challenge=E9Melhoa',
    'code_challenge_method=S256',
    `resource=${encodeURIComponent(`${API_URL}/mcp/space`)}`,
    'state=xyz',
  ].join('&');

  /** (re)build the service against a given API url, which is what decides who is a safe target */
  function configure(apiUrl: string = API_URL): void {
    TestBed.resetTestingModule();
    vi.spyOn(CaEnvironmentHelper, 'getApiUrl').mockReturnValue(apiUrl);

    assign = vi.fn();
    TestBed.configureTestingModule({
      providers: [CaOauthReturnUrlService, { provide: DOCUMENT, useValue: { location: { assign } } }],
    });

    service = TestBed.inject(CaOauthReturnUrlService);
  }

  /** ask about the param, out of login page query params, as the guard and the page both do */
  function read(returnUrl: string | null): string | null {
    const queryParams: Params = returnUrl === null ? {} : { returnUrl };
    return service.getSafeAuthorizeReturnUrl(queryParams);
  }

  beforeEach(() => configure());

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('getSafeAuthorizeReturnUrl', () => {
    it('should accept the authorize url of the api and keep it untouched', () => {
      // the whole OAuth query string is the API's business: a normalised url is a broken flow
      const authorizeUrl = `${API_URL}/oauth/authorize?${authorizeQueryString}`;

      expect(read(authorizeUrl)).toBe(authorizeUrl);
    });

    it('should accept a sub path of the authorize endpoint', () => {
      // refusing these abandons a flow the API asked to resume - a trailing slash is not an attack.
      // HaOauthHelper accepts them too: the two fronts face the same authorization server code.
      expect(read(`${API_URL}/oauth/authorize/`)).toBe(`${API_URL}/oauth/authorize/`);
      expect(read(`${API_URL}/oauth/authorize/consent?${authorizeQueryString}`)).toBe(
        `${API_URL}/oauth/authorize/consent?${authorizeQueryString}`
      );
    });

    it('should ignore an absent value, so an ordinary login is untouched', () => {
      expect(read(null)).toBeNull();
      expect(read('')).toBeNull();
    });

    it('should ignore another origin', () => {
      // without this the login page is an open redirect, handing a visitor to an attacker right
      // after login with the Constellab domain as a warranty
      expect(read('https://phishing.example/oauth/authorize')).toBeNull();
      // credentials trick: the real origin is the attacker one
      expect(read('http://localhost:3001@phishing.example/oauth/authorize')).toBeNull();
    });

    it('should ignore a non absolute url', () => {
      expect(read('/oauth/authorize?state=xyz')).toBeNull();
      expect(read('//phishing.example/oauth/authorize')).toBeNull();
    });

    it('should ignore another path of the api', () => {
      expect(read(`${API_URL}/users/current`)).toBeNull();
      expect(read(`${API_URL}/oauth/authorize-evil`)).toBeNull();
    });

    it('should accept the authorize url of an api served under a base path', () => {
      configure(`${API_URL}/api`);
      const authorizeUrl = `${API_URL}/api/oauth/authorize?${authorizeQueryString}`;

      expect(read(authorizeUrl)).toBe(authorizeUrl);
      // the same path on the origin root is not the API
      expect(read(`${API_URL}/oauth/authorize`)).toBeNull();
    });

    it('should ignore everything when the api url is not configured', () => {
      configure('');

      expect(read(`${API_URL}/oauth/authorize`)).toBeNull();
    });
  });

  describe('resume', () => {
    it('should leave the app with a full browser navigation', () => {
      // the target is the API origin, not an app route: the router cannot reach it
      const authorizeUrl = `${API_URL}/oauth/authorize?${authorizeQueryString}`;

      service.resume(authorizeUrl);

      expect(assign).toHaveBeenCalledWith(authorizeUrl);
    });
  });
});
