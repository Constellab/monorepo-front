import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

import { HaFooterComponent } from '../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../ha-core/ha-component/ha-header/ha-header/ha-header.component';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';

const SESSION_STORAGE_KEY = 'cli-auth-code';

@Component({
  selector: 'ha-cli-auth-page',
  templateUrl: './ha-cli-auth-page.component.html',
  styleUrls: ['./ha-cli-auth-page.component.scss'],
  imports: [HaHeaderComponent, HaFooterComponent, TranslatePipe, MatButton, FlLoaderModule],
})
export class HaCliAuthPageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(FlApiService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private platformId = inject(PLATFORM_ID);

  state: 'loading' | 'confirmation' | 'success' | 'error' | 'denied' = 'loading';
  code: string;
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

    if (!this.authenticatedUserService.hasAuthorizationCookie()) {
      FlLoginSavedRoute.route = '/cli-auth';
      this.router.navigate([HaRouterService.getLoginRoute()]);
      return;
    }

    this.state = 'confirmation';
  }

  authorize(): void {
    this.state = 'loading';
    this.apiService.put(`cli-auth/validate/${this.code}`, {}).subscribe({
      next: () => {
        this.state = 'success';
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage = this.mapError(err);
      },
    });
  }

  deny(): void {
    this.state = 'loading';
    this.apiService.put(`cli-auth/refuse/${this.code}`, {}).subscribe({
      next: () => {
        this.state = 'denied';
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage = this.mapError(err);
      },
    });
  }

  private mapError(err: any): string {
    const status = err?.status;
    const message = err?.error?.detail || err?.error?.message || '';

    if (status === 404 || message.includes('not found') || message.includes('invalid')) {
      return 'cli_auth.error_invalid_code';
    }
    if (status === 410 || message.includes('expired')) {
      return 'cli_auth.error_code_expired';
    }
    if (status === 409 || message.includes('already')) {
      return 'cli_auth.error_code_used';
    }
    return 'cli_auth.error_unknown';
  }
}
