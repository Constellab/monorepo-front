import {Component, Input, OnInit} from '@angular/core';
import {HaRouterService} from '../../ha-core/ha-service/ha-router.service';
import {ClSupportedLanguage, ClTheme} from '@monorepo/core-lib';
import {Observable} from 'rxjs';
import {HaUser} from '../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../ha-core/ha-service/ha-authenticated-user.service';
import {FlSnackBarService, FlThemeService, FlTranslateService} from '@monorepo/front-core-lib';
import {HaAuthService} from '../../ha-core/ha-service/ha-auth.service';
import {ActivatedRoute} from '@angular/router';

export enum HaSmallScreenPossibleRoute {
  STORY = 'story',
  BRICK = 'brick',
  LIVE_TASK = 'live-task',
  DOC = 'doc'
}

@Component({
  selector: 'ha-small-screen-main',
  templateUrl: './ha-small-screen-main.component.html',
  styleUrls: ['./ha-small-screen-main.component.scss']
})
export class HaSmallScreenMainComponent implements OnInit{
  userConnected$: Observable<HaUser> = this.authUserService.getUser();

  loginRoute: string = HaRouterService.getLoginRoute();

  adminRoute: string = HaRouterService.getAdminRoute();

  storyListRoute = HaRouterService.getStoriesListRoute();

  brickListRoute = HaRouterService.getBrickListRoute();

  productDocRoute = HaRouterService.getProductDocRoute();

  techDocRoute = HaRouterService.getTechDocRoute();

  liveTaskRoute = HaRouterService.getLiveTaskListRoute();

  homeRoute = HaRouterService.getHomeRoute();

  profileRoute = HaRouterService.getProfileRoute();

  communityLogo: string;

  currentRoute: HaSmallScreenPossibleRoute;

  @Input({required: true})
  currentTheme: ClTheme;

  @Input({required: true})
  currentLanguage: ClSupportedLanguage;

  @Input({required: true})
  isDarkTheme: boolean;

  protected readonly theme = ClTheme;

  constructor(private authUserService: HaAuthenticatedUserService,
              private themeService: FlThemeService,
              private translateService: FlTranslateService,
              private snackBarService: FlSnackBarService,
              private authService: HaAuthService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.setCommunityLogo();
    this.activatedRoute.url.subscribe((url) => {
      if (url.length === 0) {
        return;
      }
      switch ('/' + url[0].path + '/') {
        case this.storyListRoute:
          this.currentRoute = HaSmallScreenPossibleRoute.STORY;
          break;
        case this.brickListRoute:
          this.currentRoute = HaSmallScreenPossibleRoute.BRICK;
          break;
        case this.liveTaskRoute:
          this.currentRoute = HaSmallScreenPossibleRoute.LIVE_TASK;
          break;
        default:
          this.currentRoute = HaSmallScreenPossibleRoute.DOC;
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

  setCommunityLogo(): void{
    this.communityLogo = this.isDarkTheme ?
      'assets/fl-logo/community-logo-text-white.svg':
      'assets/fl-logo/community-logo-text-black.svg';
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

  logout(): void {
    this.authService.logout().subscribe();
  }
}
