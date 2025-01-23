import { Component, Input, OnInit, Signal, inject } from '@angular/core';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';
import { Observable } from 'rxjs';
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { FlDialogService, FlSnackBarService, FlTranslateService } from '@monorepo/front-core-lib';
import { HaAuthService } from '../../ha-core/ha-service/ha-auth.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { HaThemeState } from '../../ha-core/ha-state/ha-theme.state';
import { HaInstantSearchDialogComponent } from '../../ha-core/ha-component/ha-instant-search-dialog/ha-instant-search-dialog.component';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FlUserModule } from '../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { FlCoreDirectiveModule } from '../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass, AsyncPipe } from '@angular/common';
import { HaIsAdminDirective } from '../../ha-core/ha-module/ha-core-directive/ha-is-admin/ha-is-admin.directive';
import { TranslatePipe } from '@ngx-translate/core';

export enum HaSmallScreenPossibleRoute {
  STORY = 'story',
  BRICK = 'brick',
  AGENT = 'agent',
  DOC = 'doc',
}

@Component({
  selector: 'ha-small-screen-main',
  templateUrl: './ha-small-screen-main.component.html',
  styleUrls: ['./ha-small-screen-main.component.scss'],
  imports: [
    RouterLink,
    MatFormField,
    MatIcon,
    MatPrefix,
    MatInput,
    FlUserModule,
    MatMenuTrigger,
    MatIconButton,
    FlCoreDirectiveModule,
    CdkScrollable,
    RouterOutlet,
    NgClass,
    MatMenu,
    MatMenuItem,
    HaIsAdminDirective,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class HaSmallScreenMainComponent implements OnInit {
  private authUserService = inject(HaAuthenticatedUserService);
  private themeState = inject(HaThemeState);
  private translateService = inject(FlTranslateService);
  private snackBarService = inject(FlSnackBarService);
  private authService = inject(HaAuthService);
  private activatedRoute = inject(ActivatedRoute);
  private dialogService = inject(FlDialogService);

  @Input({ required: true })
  currentLanguage: ClSupportedLanguage;

  userConnected$: Observable<HaUser> = this.authUserService.getUser();

  loginRoute: string = HaRouterService.getLoginRoute();

  adminRoute: string = HaRouterService.getAdminRoute();

  storyListRoute = HaRouterService.getStoriesListRoute();

  brickListRoute = HaRouterService.getBrickListRoute();

  productDocRoute = HaRouterService.getProductDocRoute();

  techDocRoute = HaRouterService.getTechDocRoute();

  agentsRoute = HaRouterService.getAgentsListRoute();

  homeRoute = HaRouterService.getHomeRoute();

  profileRoute = HaRouterService.getProfileRoute();

  iconsPageRoute = HaRouterService.getIconsRoute();

  foaPageRoute = HaRouterService.getFairOpenAccessRoute();

  communityLogo: string;

  currentRoute: HaSmallScreenPossibleRoute;

  currentTheme: Signal<ClTheme> = this.themeState.getCurrentTheme();

  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  protected readonly theme = ClTheme;

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
        case this.agentsRoute:
          this.currentRoute = HaSmallScreenPossibleRoute.AGENT;
          break;
        default:
          this.currentRoute = HaSmallScreenPossibleRoute.DOC;
      }
    });
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
