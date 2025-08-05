import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FlLoginSavedRoute, FlQueryParamHandler } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FlAuthLogin2FaResponse, FlAuthLoginResponse, FlAuthService } from '../../service/fl-auth.service';

export interface FlCompleteLoginQueryParam {
  twoFAUrlCode: string;
}

@Component({
  selector: 'fl-complete-login',
  templateUrl: './fl-complete-login.component.html',
  styleUrls: ['./fl-complete-login.component.scss'],
  providers: [FlQueryParamHandler],
  standalone: false,
})
export class FlCompleteLoginComponent implements OnInit {
  private router = inject(Router);
  private queryParamHandler = inject<FlQueryParamHandler<FlCompleteLoginQueryParam>>(FlQueryParamHandler);
  private authService = inject(FlAuthService);

  /**
   * Redirection route after the login is successful, do nothing if not provided
   */
  @Input() redirectionRoute?: string;

  @Output() loginSuccess: EventEmitter<void> = new EventEmitter<void>();

  currentView$: Observable<'login' | '2fa'>;

  ngOnInit(): void {
    this.currentView$ = this.queryParamHandler
      .getQueryParams()
      .pipe(map((queryParams) => (queryParams.twoFAUrlCode == null ? 'login' : '2fa')));
  }

  onLoginSuccess(result: FlAuthLoginResponse): void {
    if (result.status === 'LOGGED_IN') {
      this.loginCompleted(result.expiresIn);
    } else {
      this.switchTo2FAView(result);
    }
  }

  private switchTo2FAView(result: FlAuthLoginResponse): void {
    this.queryParamHandler.mergeQueryParams({ twoFAUrlCode: result.twoFAUrlCode });
  }

  onLogin2FASuccess(result: FlAuthLogin2FaResponse): void {
    this.loginCompleted(result.expiresIn);
  }

  private loginCompleted(expiresIn: number): void {
    this.authService.afterLogin(expiresIn);

    if (this.redirectionRoute) {
      // redirect to the app
      // if a route has been saved, redirect to this route
      if (FlLoginSavedRoute.hasRoute()) {
        this.router.navigate([FlLoginSavedRoute.getRoutePath()], {
          queryParams: FlLoginSavedRoute.getRouteQueryParams(),
        });
        FlLoginSavedRoute.clearRoute();
      } else {
        this.router.navigate([this.redirectionRoute]);
      }
    }

    this.loginSuccess.next();
  }
}
