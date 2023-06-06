import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HaUser} from '../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../ha-core/ha-service/ha-authenticated-user.service';
import {FlDialogService, FlThemeService} from '@monorepo/front-core-lib';
import {HaAuthService} from '../../ha-core/ha-service/ha-auth.service';
import {HaApiServiceConfig} from '../../ha-core/ha-model/ha-config/ha-api-module.config';
import {HaRouterService} from '../../ha-core/ha-service/ha-router.service';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {ClSupportedLanguage, ClTheme} from '@monorepo/core-lib';
import {HaEnvironmentHelper} from '../../ha-core/ha-model/ha-config/ha-environment.helper';

@Component({
  selector: 'ha-main',
  templateUrl: './ha-main.component.html',
  styleUrls: ['./ha-main.component.scss']
})
export class HaMainComponent implements OnInit {

  userConnected$: Observable<HaUser> = this.authUserService.getUser();

  loginRoute: string = HaRouterService.getLoginRoute();

  currentUrlSegment: UrlSegment[];

  currentTheme: ClTheme;

  currentLanguage: ClSupportedLanguage;

  theme = ClTheme;

  lang = ClSupportedLanguage;

  isDarkTheme: boolean;


  constructor(private authUserService: HaAuthenticatedUserService,
              private authService: HaAuthService,
              private dialogService: FlDialogService,
              private apiService: HaApiServiceConfig,
              private activatedRoute: ActivatedRoute,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(url => {
      this.currentUrlSegment = url;
    });
    this.currentTheme = this.themeService.getCurrentTheme();
    this.isDarkTheme = this.currentTheme === ClTheme.DARK_THEME;
    this.authUserService.getUser().subscribe(user => {
      if(user != null){
        this.themeService.changeTheme(user.theme);
        this.currentTheme = user.theme;
        this.isDarkTheme = this.currentTheme === ClTheme.DARK_THEME;
      }
      this.currentLanguage = user != null ? user.lang : ClSupportedLanguage.en;
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  getStoryListRoute(): string {
    return HaRouterService.getStoryListRoute();
  }

  getBrickListRoute(): string {
    return HaRouterService.getBrickListRoute();
  }

  getProductDocRoute(): string {
    return HaRouterService.getProductDocRoute();
  }

  getTechDocRoute(): string {
    return HaRouterService.getTechDocRoute();
  }

  isHome(): boolean {
    return this.currentUrlSegment.length === 0;
  }

  selectTheme(theme: ClTheme): void {
    if(this.currentTheme !== theme) {
      this.themeService.changeTheme(theme);
      this.currentTheme = theme;
      this.isDarkTheme = this.currentTheme === ClTheme.DARK_THEME;
      this.authUserService.changeTheme(theme).subscribe();
    }
  }

  selectLanguage(event: ClSupportedLanguage): void {
    const lang = event;
    if(this.currentLanguage !== lang) {
      this.authUserService.changeLang(lang).subscribe();
      this.currentLanguage = lang;
    }
  }

  getCommunityLogo(): string {
    return this.currentTheme === this.theme.LIGHT_THEME ? 'assets/fl-logo/community-logo-text-black.svg' :
      'assets/fl-logo/community-logo-text-white.svg';
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected readonly ClSupportedLanguage = ClSupportedLanguage;
}
