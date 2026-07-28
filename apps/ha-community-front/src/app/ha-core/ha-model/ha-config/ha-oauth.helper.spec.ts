import { HaEnvironmentHelper } from './ha-environment.helper';
import { HaOauthHelper } from './ha-oauth.helper';

describe('HaOauthHelper.getSafeAuthorizeReturnUrl', () => {
  const apiUrl: string = HaEnvironmentHelper.getApiUrl();
  const oauthQueryParams: string = [
    'response_type=code',
    'client_id=e068a0e3',
    'redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallback',
    'code_challenge=E9Melhoa',
    'code_challenge_method=S256',
    `resource=${encodeURIComponent(`${apiUrl}/mcp/community-doc`)}`,
    'state=xyz',
  ].join('&');
  const authorizeUrl = `${apiUrl}/oauth/authorize?${oauthQueryParams}`;

  it('should accept the authorize url of the api and keep it untouched', () => {
    expect(HaOauthHelper.getSafeAuthorizeReturnUrl(authorizeUrl)).toBe(authorizeUrl);
  });

  it('should ignore an empty value', () => {
    expect(HaOauthHelper.getSafeAuthorizeReturnUrl(null)).toBeNull();
    expect(HaOauthHelper.getSafeAuthorizeReturnUrl('')).toBeNull();
  });

  it('should ignore another origin', () => {
    expect(HaOauthHelper.getSafeAuthorizeReturnUrl('https://phishing.example/oauth/authorize')).toBeNull();
    // credentials trick : the real origin is the attacker one
    expect(
      HaOauthHelper.getSafeAuthorizeReturnUrl('http://localhost:3333@phishing.example/oauth/authorize')
    ).toBeNull();
  });

  it('should ignore a non absolute url', () => {
    expect(HaOauthHelper.getSafeAuthorizeReturnUrl('/oauth/authorize?state=xyz')).toBeNull();
    expect(HaOauthHelper.getSafeAuthorizeReturnUrl('//phishing.example/oauth/authorize')).toBeNull();
  });

  it('should ignore another path of the api', () => {
    expect(HaOauthHelper.getSafeAuthorizeReturnUrl(`${apiUrl}/user`)).toBeNull();
    expect(HaOauthHelper.getSafeAuthorizeReturnUrl(`${apiUrl}/oauth/authorize-evil`)).toBeNull();
  });
});
