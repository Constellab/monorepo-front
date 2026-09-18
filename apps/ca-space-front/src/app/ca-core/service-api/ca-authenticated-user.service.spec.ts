import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { of } from 'rxjs';

import { CaSpaceInfoDto } from '../model/entities/space/ca-space.class';
import { CaEnvironmentHelper } from '../utils/ca-environment.helper';
import { CaAuthenticatedUserService } from './ca-authenticated-user.service';
import { CaCurrentSpaceService } from './ca-current-space.service';
import { CaSpaceService } from './ca-space.service';

/**
 * The redirection to the user's own space host.
 *
 * It used to branch on the number of labels in the hostname, which silently assumed a two label
 * FRONT_DOMAIN ('constellab.space'). Every instance served from a deeper one - and the caprover
 * template derives them all from a single DOMAIN - fell in the wrong branch. These tests pin the
 * behaviour for a front domain of any depth, so moving the Space under another level stays a
 * configuration change.
 */
describe('CaAuthenticatedUserService redirection to the space host', () => {
  const ROUTE = '/app/folder/document/abc';

  let windowStub: { location: { hostname: string; href: string } };

  /** the service, set up as if served from `hostname`, for a user whose space is `spaceDomain` */
  function build(frontDomain: string, hostname: string, spaceDomain: string): CaAuthenticatedUserService {
    vi.spyOn(CaEnvironmentHelper, 'isProduction').mockReturnValue(true);
    vi.spyOn(CaEnvironmentHelper, 'getFrontDomain').mockReturnValue(frontDomain);

    windowStub = { location: { hostname, href: `https://${hostname}${ROUTE}` } };

    const spaceInfo: CaSpaceInfoDto = {
      user: { lang: 'en', theme: 'light' },
      space: { domain: spaceDomain },
      roleInSpace: 'OWNER',
    } as unknown as CaSpaceInfoDto;

    TestBed.configureTestingModule({
      providers: [
        CaAuthenticatedUserService,
        { provide: FlApiService, useValue: { get: vi.fn(), put: vi.fn() } },
        { provide: FlTranslateService, useValue: { changeAppLanguage: vi.fn() } },
        { provide: FlThemeService, useValue: { changeTheme: vi.fn() } },
        { provide: CaSpaceService, useValue: { getCurrentInfo: () => of(spaceInfo) } },
        {
          provide: CaCurrentSpaceService,
          useValue: { init: vi.fn(), setCurrentSpace: vi.fn(), setCurrentSpaceUserRole: vi.fn() },
        },
        { provide: Location, useValue: { path: () => ROUTE } },
        { provide: DOCUMENT, useValue: { defaultView: windowStub } },
      ],
    });

    return TestBed.inject(CaAuthenticatedUserService);
  }

  /** where the browser was sent, or null when it was left alone */
  function redirectionOf(service: CaAuthenticatedUserService, hostname: string): string | null {
    const initial: string = `https://${hostname}${ROUTE}`;
    let failed = false;

    service.loadCurrentInfo().subscribe({ error: () => (failed = true) });

    // the service throws to stop the guard from routing a page the browser is leaving
    return windowStub.location.href === initial && !failed ? null : windowStub.location.href;
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should keep the route when the host carries no space', () => {
    // the object asked for lives in the user's space, so it survives the hop
    const service = build('test.constellab.com', 'test.constellab.com', 'my-space');

    expect(redirectionOf(service, 'test.constellab.com')).toBe(
      `https://my-space.test.constellab.com${ROUTE}`
    );
  });

  it('should keep the route on a front domain of any depth', () => {
    // 'space.test.constellab.com' has four labels: the old label count read 'space' as a space
    // domain and redirected without the route
    const service = build('space.test.constellab.com', 'space.test.constellab.com', 'my-space');

    expect(redirectionOf(service, 'space.test.constellab.com')).toBe(
      `https://my-space.space.test.constellab.com${ROUTE}`
    );
  });

  it('should leave the browser alone on the user own space host', () => {
    const service = build('test.constellab.com', 'my-space.test.constellab.com', 'my-space');

    expect(redirectionOf(service, 'my-space.test.constellab.com')).toBeNull();
  });

  it('should drop the route when the host names another space', () => {
    // the route points at an object of that other space, which the user cannot read
    const service = build('test.constellab.com', 'other-space.test.constellab.com', 'my-space');

    expect(redirectionOf(service, 'other-space.test.constellab.com')).toBe(
      'https://my-space.test.constellab.com'
    );
  });

  it('should not mistake a deeper host for the user own space', () => {
    // the first label matches, the rest does not: not the user's space host
    const service = build('test.constellab.com', 'my-space.other.test.constellab.com', 'my-space');

    expect(redirectionOf(service, 'my-space.other.test.constellab.com')).toBe(
      'https://my-space.test.constellab.com'
    );
  });
});
