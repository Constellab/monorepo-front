import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Params } from '@angular/router';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { Observable, of, Subject, throwError } from 'rxjs';

import { CaAuthService } from '../../../ca-login/service/ca-auth.service';
import { CaOauthConsentDetails } from '../../model/ca-oauth-consent-details.class';
import { CaOauthConsentService } from '../../service/ca-oauth-consent.service';
import { CaOauthConsentPageComponent } from './ca-oauth-consent-page.component';

describe('CaOauthConsentPageComponent', () => {
  const CONSENT_ID: string = 'pending-42';

  let consentServiceSpy: {
    getDetails: ReturnType<typeof vi.fn>;
    decide: ReturnType<typeof vi.fn>;
    goToLogin: ReturnType<typeof vi.fn>;
  };

  /** what the API says is being asked, already deserialized */
  function details(resources: number = 1): CaOauthConsentDetails {
    const consent = new CaOauthConsentDetails();
    consent.clientName = 'Some AI client';
    consent.clientId = 'e068a0e3';
    consent.clientNameIsVerified = false;
    consent.userEmail = 'someone@gencovery.com';
    consent.resources = Array.from({ length: resources }, (_unused, index) => ({
      name: `Resource ${index}`,
      url: `http://api.test/mcp/${index}`,
    }));
    return consent;
  }

  function serverError(status: number): Observable<never> {
    return throwError((): FlServerError => ({ response: { status } as HttpErrorResponse, message: 'error' }));
  }

  /**
   * Build and initialise the page as it is reached with the given query params.
   *
   * Instantiated without its template, like the login page spec: what is under test is what the page
   * decides - what it asks for, what it shows, and what it sends - and rendering the material
   * buttons and the translations would add no assertion.
   */
  function buildPage(
    queryParams: Params = { consent_id: CONSENT_ID },
    detailsResult: Observable<CaOauthConsentDetails> = of(details()),
    hasMarker: boolean = true
  ): CaOauthConsentPageComponent {
    TestBed.resetTestingModule();
    consentServiceSpy = {
      getDetails: vi.fn().mockReturnValue(detailsResult),
      decide: vi.fn().mockReturnValue(of(undefined)),
      goToLogin: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap(queryParams) } },
        },
        { provide: CaOauthConsentService, useValue: consentServiceSpy },
        { provide: CaAuthService, useValue: { hasAuthorizationCookie: () => hasMarker } },
        // only asked for the logo, and the real one reads a media query the test environment has no
        // answer for
        { provide: FlThemeService, useValue: { getConstellabLogo: () => 'logo.svg' } },
      ],
    });

    const page: CaOauthConsentPageComponent = TestBed.runInInjectionContext(
      () => new CaOauthConsentPageComponent()
    );
    page.ngOnInit();
    return page;
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('on load', () => {
    it('should show what the client is asking for', () => {
      const page = buildPage();

      expect(consentServiceSpy.getDetails).toHaveBeenCalledWith(CONSENT_ID);
      expect(page.status()).toBe('READY');
      expect(page.details().clientName).toBe('Some AI client');
      expect(page.details().resources).toHaveLength(1);
    });

    it('should grant nothing by being opened', () => {
      // a visitor who closes the page here must leave nothing behind: the load only ever describes
      const page = buildPage();

      expect(consentServiceSpy.decide).not.toHaveBeenCalled();
      expect(page.status()).toBe('READY');
    });

    it('should refuse the link when it carries no pending authorization', () => {
      const page = buildPage({});

      expect(page.status()).toBe('INVALID_LINK');
      expect(consentServiceSpy.getDetails).not.toHaveBeenCalled();
    });

    it('should not offer a decision when the api names no resource', () => {
      // approving a list the visitor cannot see is not consent, whatever the reason the list is empty
      const page = buildPage({ consent_id: CONSENT_ID }, of(details(0)));

      expect(page.status()).toBe('ERROR');
      expect(page.details()).toBeNull();
    });

    it('should send a visitor without a session through login, and back here after it', () => {
      const page = buildPage({ consent_id: CONSENT_ID }, serverError(401));

      expect(consentServiceSpy.goToLogin).toHaveBeenCalledWith(CONSENT_ID);
      expect(page.status()).not.toBe('READY');
    });

    it('should not call the api at all when no marker suggests a session', () => {
      // the call would end in the global session expired handling: a "session expired" the visitor
      // never caused, and a saved route stripped of the consent id
      buildPage({ consent_id: CONSENT_ID }, of(details()), false);

      expect(consentServiceSpy.getDetails).not.toHaveBeenCalled();
      expect(consentServiceSpy.goToLogin).toHaveBeenCalledWith(CONSENT_ID);
    });

    it('should not show a decision for a request that no longer exists', () => {
      expect(buildPage({ consent_id: CONSENT_ID }, serverError(404)).status()).toBe('EXPIRED');
      expect(buildPage({ consent_id: CONSENT_ID }, serverError(410)).status()).toBe('EXPIRED');
    });

    it('should let a failed load be tried again', () => {
      const page = buildPage({ consent_id: CONSENT_ID }, serverError(500));
      expect(page.status()).toBe('ERROR');

      consentServiceSpy.getDetails.mockReturnValue(of(details()));
      page.retryLoad();

      expect(page.status()).toBe('READY');
    });
  });

  describe('on a decision', () => {
    it('should send an approval', () => {
      const page = buildPage();

      page.allow();

      expect(consentServiceSpy.decide).toHaveBeenCalledWith(CONSENT_ID, 'allow');
    });

    it('should send a refusal, rather than leaving the client waiting', () => {
      const page = buildPage();

      page.deny();

      expect(consentServiceSpy.decide).toHaveBeenCalledWith(CONSENT_ID, 'deny');
    });

    it('should say it is submitting while the answer is in flight', () => {
      // what the buttons are disabled on, so a decision cannot be sent twice
      const page = buildPage();
      consentServiceSpy.decide.mockReturnValue(new Subject<void>());

      page.allow();

      expect(page.status()).toBe('SUBMITTING');
    });

    it('should come back to the decision when the answer could not be sent', () => {
      // nothing was granted: the api only acts on a navigation that never happened
      const page = buildPage();
      consentServiceSpy.decide.mockReturnValue(serverError(500));

      page.allow();

      expect(page.status()).toBe('READY');
      expect(page.decisionFailed()).toBe(true);
    });

    it('should send a visitor whose session died under the page through login', () => {
      const page = buildPage();
      consentServiceSpy.decide.mockReturnValue(serverError(401));

      page.allow();

      expect(consentServiceSpy.goToLogin).toHaveBeenCalledWith(CONSENT_ID);
    });

    it('should clear a previous failure when trying again', () => {
      const page = buildPage();
      consentServiceSpy.decide.mockReturnValue(serverError(500));
      page.allow();

      consentServiceSpy.decide.mockReturnValue(new Subject<void>());
      page.allow();

      expect(page.decisionFailed()).toBe(false);
    });
  });
});
