import { Component, Input, OnInit, Signal } from '@angular/core';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';
import { Observable } from 'rxjs';
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { FlDialogService, FlSnackBarService, FlTranslateService } from '@monorepo/front-core-lib';
import { HaAuthService } from '../../ha-core/ha-service/ha-auth.service';
import { HaThemeState } from '../../ha-core/ha-state/ha-theme.state';
import { HaInstantSearchDialogComponent } from '../../ha-core/ha-component/ha-instant-search-dialog/ha-instant-search-dialog.component';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';

@Component({
  selector: 'ha-big-screen-main',
  templateUrl: './ha-big-screen-main.component.html',
  styleUrls: ['./ha-big-screen-main.component.scss'],
})
export class HaBigScreenMainComponent implements OnInit {
  @Input({ required: true })
  currentLanguage: ClSupportedLanguage;

  loginRoute: string = HaRouterService.getLoginRoute();

  adminRoute: string = HaRouterService.getAdminRoute();

  storyListRoute = HaRouterService.getStoriesListRoute();

  brickListRoute = HaRouterService.getBrickListRoute();

  productDocRoute = HaRouterService.getProductDocRoute();

  techDocRoute = HaRouterService.getTechDocRoute();

  agentsRoute = HaRouterService.getAgentsListRoute();

  profileRoute = HaRouterService.getProfileRoute();

  constellabRoute = HaConstellabHelper.getConstellabUrl();

  iconsPageRoute = HaRouterService.getIconsRoute();

  foaPageRoute = HaRouterService.getFairOpenAccessRoute();

  currentTheme: Signal<ClTheme> = this.themeState.getCurrentTheme();

  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  userConnected$: Observable<HaUser> = this.authUserService.getUser();

  communityLogo: string;

  protected readonly theme = ClTheme;

  constructor(
    private authUserService: HaAuthenticatedUserService,
    private themeState: HaThemeState,
    private translateService: FlTranslateService,
    private snackBarService: FlSnackBarService,
    private authService: HaAuthService,
    private dialogService: FlDialogService
  ) {}

  ngOnInit(): void {
    this.setCommunityLogo();
  }

  selectTheme(theme: ClTheme): void {
    if (this.currentTheme() !== theme) {
      this.themeState.changeTheme(theme);
      this.setCommunityLogo();
    }
  }

  setCommunityLogo(): void {
    this.communityLogo = this.isDarkTheme()
      ? 'assets/fl-logo/community-logo-text-white.svg'
      : 'assets/fl-logo/community-logo-text-black.svg';
  }

  changeLanguage(): void {
    const newLang =
      this.currentLanguage == ClSupportedLanguage.fr ? ClSupportedLanguage.en : ClSupportedLanguage.fr;
    this.translateService.changeAppLanguage(newLang);
    this.currentLanguage = newLang;
    this.snackBarService.openSuccessMessage({
      text: 'language_changed',
      translateText: true,
      translateParam: {
        param: {
          lang: newLang == ClSupportedLanguage.fr ? 'Français' : 'English',
        },
      },
    });
  }

  openInstantSearchDialog(): void {
    this.dialogService.openMediumDialog(HaInstantSearchDialogComponent, {
      position: { top: '5%' },
      data: { theme: this.theme },
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
