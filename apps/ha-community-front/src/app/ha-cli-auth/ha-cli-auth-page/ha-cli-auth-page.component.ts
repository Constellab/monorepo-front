import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

import { HaFooterComponent } from '../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../ha-core/ha-component/ha-header/ha-header/ha-header.component';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCliAuthService } from '../../ha-core/ha-service/ha-cli-auth.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';

const SESSION_STORAGE_KEY = 'cli-auth-code';

@Component({
  selector: 'ha-cli-auth-page',
  templateUrl: './ha-cli-auth-page.component.html',
  styleUrls: ['./ha-cli-auth-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HaHeaderComponent, HaFooterComponent, TranslatePipe, MatButton, FlLoaderModule],
})
export class HaCliAuthPageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private cliAuthService = inject(HaCliAuthService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private platformId = inject(PLATFORM_ID);

  state: 'loading' | 'confirmation' | 'success' | 'error' | 'denied' = 'loading';
  code: string | null;
  errorMessage: string;
  currentUser = toSignal(this.authenticatedUserService.getUser());

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const queryCode = this.activatedRoute.snapshot.queryParams['code'];
    if (queryCode) {
      this.code = queryCode;
      sessionStorage.setItem(SESSION_STORAGE_KEY, queryCode);
    } else {
      this.code = sessionStorage.getItem(SESSION_STORAGE_KEY);
    }

    if (!this.code) {
      this.state = 'error';
      this.errorMessage = 'cli_auth.error_no_code';
      return;
    }

    // wait for the authoritative answer: an expired access token is renewed behind the scenes, so
    // deciding from a cookie would send a logged in user to the login page for nothing
    this.authenticatedUserService.isAuthenticatedOnce().subscribe((authenticated) => {
      if (!authenticated) {
        FlLoginSavedRoute.route = '/cli-auth';
        this.router.navigate([HaRouterService.getLoginRoute()]);
        return;
      }

      this.state = 'confirmation';
    });
  }

  authorize(): void {
    if (!this.code) {
      return;
    }

    this.state = 'loading';
    this.cliAuthService.validate(this.code).subscribe({
      next: () => {
        this.state = 'success';
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage = err?.error?.detail;
      },
    });
  }

  deny(): void {
    if (!this.code) {
      return;
    }

    this.state = 'loading';
    this.cliAuthService.refuse(this.code).subscribe({
      next: () => {
        this.state = 'denied';
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage = err?.error?.detail;
      },
    });
  }
}
