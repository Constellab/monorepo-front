import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { LiRouterService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LabEnvStore } from '../../../lab-core/lab-env.store';

@Component({
  selector: 'lab-login-page',
  templateUrl: './lab-login-page.component.html',
  styleUrls: ['./lab-login-page.component.scss'],
  imports: [FlAuthModule, MatButton, TranslatePipe],
})
export class LabLoginPageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);

  appRoute: string = LiRouterService.getAppRoute();

  labStore = inject(LabEnvStore);
  isDevEnv = this.labStore.isDev();

  ngOnInit(): void {
    // Gateway auth hop: when an unidentified visitor is sent here with a redirect_uri, return there
    // after login. Reuse the existing FlLoginSavedRoute mechanism (fl-complete-login prioritizes it).
    const redirectUri = this.activatedRoute.snapshot.queryParamMap.get('redirect_uri');
    if (redirectUri && LabLoginPageComponent.isSafeRedirectUri(redirectUri)) {
      FlLoginSavedRoute.setRoute(redirectUri);
    }
  }

  /**
   * Open-redirect guard. With the front-driven gateway design the redirect is entirely front-side
   * (the backend no longer issues it), so the front owns this guard. Only allow a same-origin,
   * path-only URL targeting a known front-owned auth-bounce entrypoint: the app gateway
   * (`/open/app/...`) or the OAuth consent page (`/oauth-consent`). Reject absolute URLs, other
   * origins, protocol-relative (`//`), and backslash tricks.
   */
  private static isSafeRedirectUri(uri: string): boolean {
    const isAllowedPath = /^\/open\/app\//.test(uri) || /^\/oauth-consent(?:[/?]|$)/.test(uri);
    return isAllowedPath && !uri.startsWith('//') && !uri.includes('\\');
  }

  switchToProd(): void {
    this.labStore.setLabEnvironment('prod');
  }
}
