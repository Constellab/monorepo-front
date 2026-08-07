import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { of } from 'rxjs';

import { CaOauthReturnUrlService } from '../../../ca-core/service/ca-oauth-return-url.service';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaLoginPageComponent } from './ca-login-page.component';

describe('CaLoginPageComponent', () => {
  const AUTHORIZE_URL = 'http://localhost:3001/oauth/authorize?client_id=e068a0e3&state=xyz';

  let returnUrlServiceSpy: {
    getSafeAuthorizeReturnUrl: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
  };

  /**
   * Build and initialise the login page as it is reached with the given query params.
   *
   * Instantiated without its template on purpose: what is under test is where the component sends
   * the visitor, and rendering fl-login-page would drag in the captcha, the theme and the whole
   * login form for no added assertion. The two template bindings are typechecked by the build.
   *
   * @param safeReturnUrl what CaOauthReturnUrlService makes of the params - null when there is
   * nothing safe to honour, which covers both an ordinary login and a refused url.
   */
  function buildPage(queryParams: Params = {}, safeReturnUrl: string = null): CaLoginPageComponent {
    returnUrlServiceSpy = {
      getSafeAuthorizeReturnUrl: vi.fn().mockReturnValue(safeReturnUrl),
      resume: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams }, queryParams: of(queryParams) } },
        { provide: CaOauthReturnUrlService, useValue: returnUrlServiceSpy },
        { provide: FlSnackBarService, useValue: { openErrorMessage: vi.fn(), openSuccessMessage: vi.fn() } },
        { provide: FlDialogService, useValue: { openSmallDialog: vi.fn() } },
      ],
    });

    const page: CaLoginPageComponent = TestBed.runInInjectionContext(() => new CaLoginPageComponent());
    page.ngOnInit();
    return page;
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('should send an ordinary login into the app', () => {
    const page = buildPage();

    // fl-complete-login navigates there itself, honouring any route saved by a session that expired
    expect(page.redirectionRoute()).toBe(CaRouterService.getAppRoute());

    page.onLoginSuccess();
    expect(returnUrlServiceSpy.resume).not.toHaveBeenCalled();
  });

  it('should read the return url from the params the page was reached with', () => {
    const queryParams: Params = { returnUrl: AUTHORIZE_URL };
    buildPage(queryParams, AUTHORIZE_URL);

    expect(returnUrlServiceSpy.getSafeAuthorizeReturnUrl).toHaveBeenCalledWith(queryParams);
  });

  it('should resume the authorization flow after a login', () => {
    const page = buildPage({ returnUrl: AUTHORIZE_URL }, AUTHORIZE_URL);

    page.onLoginSuccess();

    expect(returnUrlServiceSpy.resume).toHaveBeenCalledWith(AUTHORIZE_URL);
  });

  it('should resume it after a two factor step too', () => {
    // fl-complete-login funnels both the password and the 2FA path through loginSuccess, so there is
    // a single place to honour and nothing specific to 2FA to do here
    const page = buildPage({ returnUrl: AUTHORIZE_URL }, AUTHORIZE_URL);

    page.onLoginSuccess();

    expect(returnUrlServiceSpy.resume).toHaveBeenCalledTimes(1);
  });

  it('should not let the app navigate anywhere before leaving it', () => {
    // an in-app navigation would tear down this page mid-redirection, and a route saved by an
    // expired session would win over the flow the visitor came here to complete
    const page = buildPage({ returnUrl: AUTHORIZE_URL }, AUTHORIZE_URL);

    expect(page.redirectionRoute()).toBeNull();
  });

  it('should fall back to the app when the return url is not a safe target', () => {
    const page = buildPage({ returnUrl: 'https://phishing.example' }, null);

    expect(page.redirectionRoute()).toBe(CaRouterService.getAppRoute());

    page.onLoginSuccess();
    expect(returnUrlServiceSpy.resume).not.toHaveBeenCalled();
  });
});
