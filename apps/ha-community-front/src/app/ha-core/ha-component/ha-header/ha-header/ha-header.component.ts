import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { HaConstellabHelper } from '../../../ha-model/ha-config/ha-constellab.helper';
import { HaIsAdminDirective } from '../../../ha-module/ha-core-directive/ha-is-admin/ha-is-admin.directive';
import { HaAuthService } from '../../../ha-service/ha-auth.service';
import { HaAuthenticatedUserService } from '../../../ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../../ha-service/ha-router.service';
import { HaInstantSearchDialogComponent } from '../../ha-instant-search-dialog/ha-instant-search-dialog.component';

@Component({
  selector: 'ha-header',
  templateUrl: './ha-header.component.html',
  styleUrls: ['./ha-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NgClass,
    RouterLink,
    NgOptimizedImage,
    TranslatePipe,
    MatButton,
    FlUserModule,
    MatMenu,
    MatMenuItem,
    MatIcon,
    MatMenuTrigger,
    FlIconModule,
    MatDivider,
    MatTooltip,
    HaIsAdminDirective,
  ],
})
export class HaHeaderComponent {
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private authService = inject(HaAuthService);
  private dialogService = inject(FlDialogService);
  private translateService = inject(FlTranslateService);

  isHomePage = input<boolean>(false);

  fullHeight = input<boolean>(false);

  homeRoute: string = HaRouterService.getHomeRoute();

  loginRoute: string = HaRouterService.getLoginRoute();

  adminRoute: string = HaRouterService.getAdminPanelRoute();

  storyListRoute = HaRouterService.getStoriesListRoute();

  brickListRoute = HaRouterService.getBrickListRoute();

  partnerListRoute = HaRouterService.getPartnerListRoute();

  appsListRoute = HaRouterService.getCommunityAppListRoute();

  productDocRoute = HaRouterService.getProductDocRoute();

  techDocRoute = HaRouterService.getTechDocRoute();

  iconsPageRoute = HaRouterService.getIconsRoute();

  tagsListRoute = HaRouterService.getTagsListRoute();

  agentListRoute = HaRouterService.getAgentsListRoute();

  profileRoute = HaRouterService.getProfileRoute();

  aiIntegrationRoute = HaRouterService.getAiIntegrationRoute();

  constellabRoute = HaConstellabHelper.getConstellabUrl();

  signupUrl = HaConstellabHelper.getConstellabSignupUrl();

  currentUser = toSignal(this.authenticatedUserService.getUser());

  isAdminUser = toSignal(this.authenticatedUserService.isAdmin());

  currentLanguage: WritableSignal<ClSupportedLanguage> = signal(this.translateService.getUserLanguage());

  constructor() {
    effect(() => {
      const user = this.currentUser();
      const currentLang = user?.lang ?? this.translateService.getUserLanguage();
      this.currentLanguage.set(currentLang ?? this.translateService.getDefaultLanguage());
    });
  }

  setLanguage(lang: ClSupportedLanguage): void {
    if (lang == this.currentLanguage()) return;
    this.currentLanguage.set(this.authenticatedUserService.changeLang(lang));
  }

  openInstantSearchDialog(): void {
    this.dialogService.openMediumDialog(HaInstantSearchDialogComponent, {
      position: { top: '5%' },
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      window.location.reload();
    });
  }

  protected readonly ClSupportedLanguage = ClSupportedLanguage;
}
