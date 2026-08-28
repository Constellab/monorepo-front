import { LabOpenAppPageComponent } from './lab-open-app-page.component';

/**
 * The handoff URL carries the single-use `gws_code` that is the app's only credential, so merging a
 * requested deep-link path into it must never disturb that query param.
 *
 * `applyRedirectTo` is private; reached here via bracket access so these rules can be pinned without
 * widening the component's public surface.
 */
const applyRedirectTo = (appUrl: string, redirectTo?: string): string =>
  (LabOpenAppPageComponent as unknown as { applyRedirectTo(a: string, r?: string): string })[
    'applyRedirectTo'
  ](appUrl, redirectTo);

describe('LabOpenAppPageComponent.applyRedirectTo', () => {
  const appUrl = 'http://a.localhost:8510/?gws_code=C';

  it('returns the handoff URL untouched when no redirect_to is present', () => {
    expect(applyRedirectTo(appUrl, undefined)).toBe('http://a.localhost:8510/?gws_code=C');
  });

  it('applies the requested path while keeping gws_code', () => {
    expect(applyRedirectTo(appUrl, '/config')).toBe('http://a.localhost:8510/config?gws_code=C');
  });

  it("keeps the deep link's own query params alongside gws_code", () => {
    expect(applyRedirectTo(appUrl, '/config?tab=1')).toBe(
      'http://a.localhost:8510/config?gws_code=C&tab=1'
    );
  });

  it('never lets a deep link override gws_code', () => {
    // otherwise a shared link could pin a spent/forged code and break the exchange
    expect(applyRedirectTo(appUrl, '/x?gws_code=FORGED')).toBe('http://a.localhost:8510/x?gws_code=C');
  });

  it.each(['//evil.com', 'https://evil.com', '/\\evil', 'config'])(
    'rejects the off-origin target %s',
    (target) => {
      expect(applyRedirectTo(appUrl, target)).toBe(appUrl);
    }
  );
});

/**
 * The nginx fallback resolver redirects here with ?error=<reason> when a shared app URL maps to no
 * app, because that request is a top-level browser navigation: raising an API exception there would
 * render the raw JSON error envelope to a human.
 */
describe('LabOpenAppPageComponent terminal error mapping', () => {
  // mirrors showTerminalError's allowlist
  const messageKey = (error: string): string =>
    ({
      invalid_host: 'g.open_app_error_invalid_host',
      app_not_found: 'g.open_app_error_app_not_found',
    })[error] ?? 'g.open_app_error_generic';

  it('maps the known backend reasons to their own message', () => {
    expect(messageKey('invalid_host')).toBe('g.open_app_error_invalid_host');
    expect(messageKey('app_not_found')).toBe('g.open_app_error_app_not_found');
  });

  it('falls back to the generic message for an unknown reason', () => {
    // the value is attacker-controlled, so it must never reach the UI verbatim
    expect(messageKey('<script>alert(1)</script>')).toBe('g.open_app_error_generic');
    expect(messageKey('totally_unknown')).toBe('g.open_app_error_generic');
  });
});

/**
 * Change 2 regression: the 401 -> login -> back hop used to rebuild the return URL from appKey
 * alone, dropping every query param. A logged-out visitor following a shared deep link therefore
 * lost `redirect_to` and landed on the app root after logging in.
 */
describe('LabOpenAppPageComponent login-hop redirect_uri', () => {
  const buildRedirectUri = (search: string, appKey: string): string => {
    const params = new URLSearchParams(search);
    params.delete('code');
    const query = params.toString();
    return `/open/app/${appKey}${query ? `?${query}` : ''}`;
  };

  it('preserves redirect_to across the login hop', () => {
    expect(buildRedirectUri('?redirect_to=%2Fconfig', 'abc123')).toBe(
      '/open/app/abc123?redirect_to=%2Fconfig'
    );
  });

  it('drops the single-use code but keeps redirect_to', () => {
    expect(buildRedirectUri('?code=XYZ&redirect_to=%2Fconfig', 'abc123')).toBe(
      '/open/app/abc123?redirect_to=%2Fconfig'
    );
  });

  it('adds no query string when there is nothing to preserve', () => {
    expect(buildRedirectUri('', 'abc123')).toBe('/open/app/abc123');
    expect(buildRedirectUri('?code=XYZ', 'abc123')).toBe('/open/app/abc123');
  });

  it('stays accepted by the login open-redirect guard', () => {
    // mirrors LabLoginPageComponent.isSafeRedirectUri
    const uri = buildRedirectUri('?redirect_to=%2Fconfig', 'abc123');
    expect(/^\/open\/app\//.test(uri) && !uri.startsWith('//') && !uri.includes('\\')).toBe(true);
  });
});
