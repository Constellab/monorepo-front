import {AfterContentInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Signal} from '@angular/core';
import {HaAuthenticatedUserService} from '../../ha-core/ha-service/ha-authenticated-user.service';
import {FlCookieService} from '@monorepo/front-core-lib';
import {ClSupportedLanguage, ClTheme} from '@monorepo/core-lib';
import {HaEnvironmentHelper} from '../../ha-core/ha-model/ha-config/ha-environment.helper';
import {isPlatformBrowser} from '@angular/common';
import {HaCookieConsentComponent} from '../ha-cookie-consent/ha-cookie-consent.component';
import {BreakpointObserver} from '@angular/cdk/layout';
import {HaThemeState} from '../../ha-core/ha-state/ha-theme.state';

@Component({
  selector: 'ha-main',
  templateUrl: './ha-main.component.html',
  styleUrls: ['./ha-main.component.scss'],
  providers: [HaThemeState]
})
export class HaMainComponent implements OnInit, AfterContentInit, OnDestroy {

  currentLanguage: ClSupportedLanguage;

  isSmallScreen = false;

  currentTheme: Signal<ClTheme> = this.themeState.getCurrentTheme();

  constructor(private authUserService: HaAuthenticatedUserService,
              private cookieService: FlCookieService,
              private breakpointObserver: BreakpointObserver,
              private themeState: HaThemeState,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    this.themeState.init();
    this.authUserService.getUser().subscribe(user => {
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
      this.cookieService.checkCookiesAcceptance({
        version: 1,
        displayMode: 'snackbar',
        component: HaCookieConsentComponent,
      }).subscribe(res => {
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
    document.head.appendChild(script);

    const windowObj = window as any;
    windowObj['dataLayer'] = windowObj['dataLayer'] || [];
    windowObj['gtag'] = function () {
      // eslint-disable-next-line prefer-rest-params
      (windowObj['dataLayer']).push(arguments);
    };
    windowObj['gtag']('js', new Date());
    windowObj['gtag']('config', HaEnvironmentHelper.getGoogleAnalyticsId());
  }

  ngOnDestroy(): void {
    this.themeState.destroy();
  }
}
