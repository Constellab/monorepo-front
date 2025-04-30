import { Component, computed, inject, Input, Signal } from '@angular/core';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';
import { Observable } from 'rxjs';
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { HaAuthService } from '../../ha-core/ha-service/ha-auth.service';
import { HaThemeState } from '../../ha-core/ha-state/ha-theme.state';
import { HaInstantSearchDialogComponent } from '../../ha-core/ha-component/ha-instant-search-dialog/ha-instant-search-dialog.component';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { HaIsAdminDirective } from '../../ha-core/ha-module/ha-core-directive/ha-is-admin/ha-is-admin.directive';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-big-screen-main',
  templateUrl: './ha-big-screen-main.component.html',
  styleUrls: ['./ha-big-screen-main.component.scss'],
  imports: [
    RouterLink,
    MatFormField,
    MatIcon,
    MatPrefix,
    MatSuffix,
    MatInput,
    FlTextIconModule,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    NgOptimizedImage,
    MatIconButton,
    FlUserModule,
    MatAnchor,
    FlCoreDirectiveModule,
    HaIsAdminDirective,
    CdkScrollable,
    RouterOutlet,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class HaBigScreenMainComponent {
  private authUserService = inject(HaAuthenticatedUserService);
  private themeState = inject(HaThemeState);
  private authService = inject(HaAuthService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true })
  currentLanguage: ClSupportedLanguage;

  loginRoute: string = HaRouterService.getLoginRoute();

  adminRoute: string = HaRouterService.getAdminPanelRoute();

  storyListRoute = HaRouterService.getStoriesListRoute();

  brickListRoute = HaRouterService.getBrickListRoute();

  appsListRoute = HaRouterService.getCommunityAppListRoute();

  productDocRoute = HaRouterService.getProductDocRoute();

  techDocRoute = HaRouterService.getTechDocRoute();

  agentsRoute = HaRouterService.getAgentsListRoute();

  profileRoute = HaRouterService.getProfileRoute();

  constellabRoute = HaConstellabHelper.getConstellabUrl();

  iconsPageRoute = HaRouterService.getIconsRoute();

  currentTheme: Signal<ClTheme> = this.themeState.getCurrentTheme();

  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  userConnected$: Observable<HaUser> = this.authUserService.getUser();

  communityLogo = computed(() => {
    return this.isDarkTheme()
      ? 'assets/fl-logo/community-logo-text-white.svg'
      : 'assets/fl-logo/community-logo-text-black.svg';
  });

  protected readonly theme = ClTheme;

  selectTheme(theme: ClTheme): void {
    if (this.currentTheme() !== theme) {
      this.themeState.changeTheme(theme);
    }
  }

  changeLanguage(): void {
    const newLang =
      this.currentLanguage == ClSupportedLanguage.fr ? ClSupportedLanguage.en : ClSupportedLanguage.fr;
    this.currentLanguage = this.authUserService.changeLang(newLang);
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
