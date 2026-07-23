import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { CoRagflowChatbotBubbleComponent } from '@monorepo/community-lib';
import { ClHelpService, ClSupportedLanguage } from '@monorepo/core-lib';
import { FlCookieService, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { HaInstantSearchDialogComponent } from '../../ha-core/ha-component/ha-instant-search-dialog/ha-instant-search-dialog.component';
import { HaEnvironmentHelper } from '../../ha-core/ha-model/ha-config/ha-environment.helper';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCurrentPageState } from '../../ha-core/ha-state/ha-current-page.state';
import { HaJsonLdState } from '../../ha-core/ha-state/ha-json-ld.state';
import { HaThemeState } from '../../ha-core/ha-state/ha-theme.state';
import { HaCookieConsentComponent } from '../ha-cookie-consent/ha-cookie-consent.component';

/**
 * Root layout component wrapping all authenticated pages.
 *
 * Responsibilities:
 * - Provides shared layout (header, footer, sidenav) via its template.
 * - Manages app-wide state: theme (HaThemeState), SEO structured data (HaJsonLdState),
 *   and current page tracking (HaCurrentPageState).
 * - Initializes Google Analytics after cookie consent.
 * - Activates the Ragflow chatbot bubble if the backend reports it as active.
 * - Listens for Ctrl+K to open the instant search dialog (Algolia-powered).
 *
 * Note: /login and /cli-auth do NOT go through this component (see ha-main-routes.ts).
 */
@Component({
  selector: 'ha-main',
  templateUrl: './ha-main.component.html',
  styleUrls: ['./ha-main.component.scss'],
  providers: [HaThemeState, HaJsonLdState, HaCurrentPageState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, CoRagflowChatbotBubbleComponent, AsyncPipe],
})
export class HaMainComponent implements OnInit, AfterContentInit, OnDestroy {
  currentLanguage: ClSupportedLanguage;

  isSmallScreen = false;
  isBrowser = false;
  isChatbotActive = false;

  private http: HttpClient = inject(HttpClient);
  private authUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);

  readonly user$ = this.authUserService.getUser();
  private cookieService: FlCookieService = inject(FlCookieService);
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private themeState: HaThemeState = inject(HaThemeState);
  private dialogService: FlDialogService = inject(FlDialogService);
  private currentPageState: HaCurrentPageState = inject(HaCurrentPageState);
  private platformId: any = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  @HostListener('window:keydown', ['$event'])
  onCtrlK(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      ClHelpService.stopEventPropagation(event);
      if (!this.dialogService.isDialogComponentOpened(HaInstantSearchDialogComponent))
        this.dialogService.openMediumDialog(HaInstantSearchDialogComponent, {
          position: { top: '5%' },
        });
    }
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.themeState.init();

    if (this.isBrowser) {
      this.http
        .get<{ active: boolean }>(`${HaEnvironmentHelper.getApiUrl()}/ragflow-chatbot/status`)
        .subscribe({
          next: (res) => (this.isChatbotActive = res.active),
          error: () => (this.isChatbotActive = false),
        });
    }
    this.currentPageState.init();

    this.authUserService
      .getUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.currentLanguage = user != null ? user.lang : ClSupportedLanguage.en;
      });

    this.breakpointObserver
      .observe('(max-width: 965px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateIsSmallScreen();
      });
  }

  private updateIsSmallScreen(): void {
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 965px)');
  }

  ngAfterContentInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService
        .checkCookiesAcceptance({
          version: 1,
          displayMode: 'snackbar',
          component: HaCookieConsentComponent,
        })
        .subscribe((res) => {
          if (res) {
            this.setGoogleAnalytics();
          }
        });
    }
  }

  private setGoogleAnalytics(): void {
    if (document.getElementById('google-analytics-script') != null) {
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.id = 'google-analytics-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${HaEnvironmentHelper.getGoogleAnalyticsId()}`;
    document.body.appendChild(script);

    const windowObj = window as any;
    windowObj['dataLayer'] = windowObj['dataLayer'] || [];
    windowObj['gtag'] = function () {
      // eslint-disable-next-line prefer-rest-params
      windowObj['dataLayer'].push(arguments);
    };
    windowObj['gtag']('js', new Date());
    windowObj['gtag']('config', HaEnvironmentHelper.getGoogleAnalyticsId());
  }

  ngOnDestroy(): void {
    this.themeState.destroy();
  }
}
