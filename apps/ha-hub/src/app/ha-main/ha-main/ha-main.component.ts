import {AfterContentInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Observable} from 'rxjs';
import {HaUser} from '../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../ha-core/ha-service/ha-authenticated-user.service';
import {FlCookieService, FlSnackBarService, FlThemeService, FlTranslateService} from '@monorepo/front-core-lib';
import {HaAuthService} from '../../ha-core/ha-service/ha-auth.service';
import {HaRouterService} from '../../ha-core/ha-service/ha-router.service';
import {ActivatedRoute, UrlSegment} from '@angular/router';
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

  userConnected$: Observable<HaUser> = this.authUserService.getUser();

  loginRoute: string = HaRouterService.getLoginRoute();

  adminRoute: string = HaRouterService.getAdminRoute();

  currentUrlSegment: UrlSegment[];

  currentTheme: ClTheme;

  currentLanguage: ClSupportedLanguage;

  theme = ClTheme;

  isDarkTheme: boolean;

  storyListRoute = HaRouterService.getStoriesListRoute();

  brickListRoute = HaRouterService.getBrickListRoute();

  productDocRoute = HaRouterService.getSimpleProductDocRoute();

  techDocRoute = HaRouterService.getSimpleTechDocRoute();

  liveTaskRoute = HaRouterService.getLiveTaskListRoute();

  communityLogo: string;


  constructor(private authUserService: HaAuthenticatedUserService,
              private authService: HaAuthService,
              private activatedRoute: ActivatedRoute,
              private themeService: FlThemeService,
              private cookieService: FlCookieService,
              private translateService: FlTranslateService,
              private snackBarService: FlSnackBarService,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(url => {
      this.currentUrlSegment = url;
    });
    this.currentTheme = this.themeService.getCurrentTheme();
    this.isDarkTheme = this.currentTheme === ClTheme.DARK_THEME;
    this.setCommunityLogo();
    this.authUserService.getUser().subscribe(user => {
      if (user != null) {
        this.authUserService.changeTheme(this.currentTheme).subscribe();
        this.isDarkTheme = this.currentTheme === ClTheme.DARK_THEME;
      }
      this.currentLanguage = user != null ? user.lang : ClSupportedLanguage.en;
    });
  }

  setCommunityLogo(): void{
    this.communityLogo = this.isDarkTheme ?
      'assets/fl-logo/community-logo-text-white.svg':
      'assets/fl-logo/community-logo-text-black.svg';
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

  logout(): void {
    this.authService.logout().subscribe();
  }

  changeLanguage(): void {
    const newLang = this.currentLanguage == ClSupportedLanguage.fr ?
      ClSupportedLanguage.en : ClSupportedLanguage.fr;
    this.translateService.changeAppLanguage(newLang);
    this.currentLanguage = newLang;
    this.snackBarService.openSuccessMessage(
      {
        text:'language_changed',
        translateText: true,
        translateParam: {
          param: {
            lang: newLang == ClSupportedLanguage.fr ? 'Français' : 'English'
          }
        }
      });
  }

  selectTheme(theme: ClTheme): void {
    if (this.currentTheme !== theme) {
      this.themeService.changeTheme(theme);
      this.currentTheme = theme;
      this.isDarkTheme = this.currentTheme === ClTheme.DARK_THEME;
      this.setCommunityLogo();
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
