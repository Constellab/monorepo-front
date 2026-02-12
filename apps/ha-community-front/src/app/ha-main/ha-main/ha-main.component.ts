import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
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

@Component({
  selector: 'ha-main',
  templateUrl: './ha-main.component.html',
  styleUrls: ['./ha-main.component.scss'],
  providers: [HaThemeState, HaJsonLdState, HaCurrentPageState],
  imports: [RouterOutlet, CoRagflowChatbotBubbleComponent],
})
export class HaMainComponent implements OnInit, AfterContentInit, OnDestroy {
  currentLanguage: ClSupportedLanguage;

  isSmallScreen = false;
  isBrowser = false;
  isChatbotActive = false;

  private http: HttpClient = inject(HttpClient);
  private authUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private cookieService: FlCookieService = inject(FlCookieService);
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private themeState: HaThemeState = inject(HaThemeState);
  private dialogService: FlDialogService = inject(FlDialogService);
  private currentPageState: HaCurrentPageState = inject(HaCurrentPageState);
  private platformId: any = inject(PLATFORM_ID);

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

    this.authUserService.getUser().subscribe((user) => {
      this.currentLanguage = user != null ? user.lang : ClSupportedLanguage.en;
    });

    this.breakpointObserver.observe('(max-width: 965px)').subscribe(() => {
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
