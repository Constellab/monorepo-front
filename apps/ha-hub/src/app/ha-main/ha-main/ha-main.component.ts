import {AfterContentInit, Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {HaAuthenticatedUserService} from '../../ha-core/ha-service/ha-authenticated-user.service';
import {FlCookieService, FlThemeService} from '@monorepo/front-core-lib';
import {ClSupportedLanguage, ClTheme} from '@monorepo/core-lib';
import {HaEnvironmentHelper} from '../../ha-core/ha-model/ha-config/ha-environment.helper';
import {isPlatformBrowser} from '@angular/common';
import {HaCookieConsentComponent} from '../ha-cookie-consent/ha-cookie-consent.component';

@Component({
  selector: 'ha-main',
  templateUrl: './ha-main.component.html',
  styleUrls: ['./ha-main.component.scss']
})
export class HaMainComponent implements OnInit, AfterContentInit {

  currentTheme: ClTheme;

  currentLanguage: ClSupportedLanguage;

  theme = ClTheme;

  isDarkTheme: boolean;

  isSmallScreen = false;


  constructor(private authUserService: HaAuthenticatedUserService,
              private themeService: FlThemeService,
              private cookieService: FlCookieService,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.isDarkTheme = this.themeService.isDarkTheme();
    this.authUserService.getUser().subscribe(user => {
      if (user != null) {
        this.authUserService.changeTheme(this.currentTheme).subscribe();
        this.isDarkTheme = this.currentTheme === ClTheme.DARK_THEME;
      }
      this.currentLanguage = user != null ? user.lang : ClSupportedLanguage.en;
    });

    this.updateIsSmallScreen();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.updateIsSmallScreen();
  }

  private updateIsSmallScreen(): void {
    if(window && window.innerWidth < 965) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
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
}
