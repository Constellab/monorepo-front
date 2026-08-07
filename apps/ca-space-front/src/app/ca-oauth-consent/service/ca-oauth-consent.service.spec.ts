import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  FlApiErrorService,
  FlApiService,
  FlApiServiceConfig,
  FlServerError,
} from '@monorepo/front-core-lib/fl-api';
import { throwError } from 'rxjs';

import { CaOauthReturnUrlService } from '../../ca-core/service/ca-oauth-return-url.service';
import { CaEnvironmentHelper } from '../../ca-core/utils/ca-environment.helper';
import { CaOauthConsentDetails } from '../model/ca-oauth-consent-details.class';
import { CaOauthConsentService } from './ca-oauth-consent.service';

describe('CaOauthConsentService', () => {
  const API_URL: string = 'http://api.test';
  const CONSENT_ID: string = 'pending-42';
  const DETAILS_URL: string = `${API_URL}/oauth/authorize/consent/details?consent_id=${CONSENT_ID}`;
  const TOKEN_URL: string = `${API_URL}/oauth/authorize/consent/token`;

  let service: CaOauthConsentService;
  let httpMock: HttpTestingController;
  let assign: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;

  /** where a decision leaves for: the API endpoint that answers with a 302 to the client */
  function decisionUrl(decision: string, token: string = 'one-shot'): string {
    return (
      `${API_URL}/oauth/authorize/consent/decision` +
      `?consent_id=${CONSENT_ID}&decision=${decision}&consent_token=${token}`
    );
  }

  /** what the API answers to the details call, in its own naming */
  function detailsResponse(): Record<string, unknown> {
    return {
      client_name: 'Some AI client',
      client_id: 'e068a0e3',
      client_name_is_verified: false,
      user_email: 'someone@gencovery.com',
      resources: [
        { name: 'Your Spaces', url: `${API_URL}/mcp/space`, description: 'Read your folders and notes' },
      ],
      warning: 'It will be able to do anything you can.',
    };
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    vi.spyOn(CaEnvironmentHelper, 'getApiUrl').mockReturnValue(API_URL);

    assign = vi.fn();
    navigate = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FlApiService,
        CaOauthConsentService,
        CaOauthReturnUrlService,
        {
          provide: FlApiServiceConfig,
          useValue: {
            getApiUrl: (): string => `${API_URL}/`,
            getHeaders: (): Record<string, string> => undefined,
          },
        },
        {
          provide: FlApiErrorService,
          useValue: {
            // the shape FlApiService turns an http failure into, and all the page reads of it
            handleServerError: (response: HttpErrorResponse) =>
              throwError((): FlServerError => ({ response, message: 'error' })),
          },
        },
        { provide: Router, useValue: { navigate } },
        { provide: DOCUMENT, useValue: { location: { assign } } },
      ],
    });

    service = TestBed.inject(CaOauthConsentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('getDetails', () => {
    it('should ask the authorization server what the client is requesting', () => {
      let details: CaOauthConsentDetails = null;
      service.getDetails(CONSENT_ID).subscribe((result) => (details = result));

      httpMock.expectOne(DETAILS_URL).flush(detailsResponse());

      expect(details).toBeInstanceOf(CaOauthConsentDetails);
      expect(details.clientName).toBe('Some AI client');
      expect(details.clientId).toBe('e068a0e3');
      expect(details.clientNameIsVerified).toBe(false);
      expect(details.userEmail).toBe('someone@gencovery.com');
      expect(details.warning).toBe('It will be able to do anything you can.');
    });

    it('should read every requested resource, so none can be granted unseen', () => {
      let details: CaOauthConsentDetails = null;
      const response = detailsResponse();
      response.resources = [
        { name: 'Your Spaces', url: `${API_URL}/mcp/space` },
        { name: 'The documentation', url: 'http://community.test/mcp', description: 'Search the docs' },
      ];
      service.getDetails(CONSENT_ID).subscribe((result) => (details = result));

      httpMock.expectOne(DETAILS_URL).flush(response);

      expect(details.resources).toHaveLength(2);
      expect(details.resources[0].name).toBe('Your Spaces');
      expect(details.resources[0].url).toBe(`${API_URL}/mcp/space`);
      expect(details.resources[1].description).toBe('Search the docs');
    });

    it('should hand the failure to the caller with its status, and no snackbar', () => {
      // the page turns each status into its own screen, a toast on top would only repeat it worse
      let error: FlServerError = null;
      service.getDetails(CONSENT_ID).subscribe({ error: (result: FlServerError) => (error = result) });

      httpMock.expectOne(DETAILS_URL).flush(null, { status: 404, statusText: 'Not Found' });

      expect(error.response.status).toBe(404);
    });

    it('should ask for nothing but a description', () => {
      // loading the page must not create anything on the back: closing it then grants nothing
      service.getDetails(CONSENT_ID).subscribe();

      expect(httpMock.expectOne(DETAILS_URL).request.method).toBe('GET');
    });
  });

  describe('decide', () => {
    it('should mint a token then leave for the api, which redirects to the client', () => {
      service.decide(CONSENT_ID, 'allow').subscribe();

      const mint = httpMock.expectOne(TOKEN_URL);
      expect(mint.request.method).toBe('POST');
      expect(mint.request.body).toEqual({ consent_id: CONSENT_ID });
      expect(assign).not.toHaveBeenCalled();

      mint.flush({ consent_token: 'one-shot' });

      // a full page navigation, not an xhr: the api answers with a 302 the browser must follow, and
      // the authorization code it carries is none of the front's business
      expect(assign).toHaveBeenCalledWith(decisionUrl('allow'));
    });

    it('should send a refusal the same way, so the client is told rather than left waiting', () => {
      service.decide(CONSENT_ID, 'deny').subscribe();

      httpMock.expectOne(TOKEN_URL).flush({ consent_token: 'one-shot' });

      expect(assign).toHaveBeenCalledWith(decisionUrl('deny'));
    });

    it('should not leave the page when the answer carries no token', () => {
      // leaving for the api without one drops the visitor on an error page with their decision lost
      let error: FlServerError = null;
      service.decide(CONSENT_ID, 'allow').subscribe({ error: (result: FlServerError) => (error = result) });

      httpMock.expectOne(TOKEN_URL).flush({});

      expect(assign).not.toHaveBeenCalled();
      expect(error).not.toBeNull();
    });

    it('should not leave the page when the token could not be minted', () => {
      // there is nothing to send without it, and the page has to stay to say so
      let error: FlServerError = null;
      service.decide(CONSENT_ID, 'allow').subscribe({ error: (result: FlServerError) => (error = result) });

      httpMock.expectOne(TOKEN_URL).flush(null, { status: 500, statusText: 'Server Error' });

      expect(assign).not.toHaveBeenCalled();
      expect(error.response.status).toBe(500);
    });
  });

  describe('goToLogin', () => {
    it('should send the visitor to login with the url that re-enters the flow', () => {
      service.goToLogin(CONSENT_ID);

      expect(navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: `${API_URL}/oauth/authorize/consent?consent_id=${CONSENT_ID}` },
      });
    });

    it('should send a url the login page accepts to come back to', () => {
      // the login page honours a return url only when it is the authorization endpoint of the api -
      // what keeps it from being an open redirect. A consent route outside that path would be
      // silently dropped, and the visitor would land in the app with the client still waiting.
      service.goToLogin(CONSENT_ID);

      const returnUrl: string = navigate.mock.calls[0][1].queryParams.returnUrl;
      const returnUrlService: CaOauthReturnUrlService = TestBed.inject(CaOauthReturnUrlService);

      expect(returnUrlService.getSafeAuthorizeReturnUrl({ returnUrl })).toBe(returnUrl);
    });
  });
});
