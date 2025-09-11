import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { HaConstellabHelper } from '../../../ha-model/ha-config/ha-constellab.helper';
import { HaIsAdminDirective } from '../../../ha-module/ha-core-directive/ha-is-admin/ha-is-admin.directive';
import { HaAuthService } from '../../../ha-service/ha-auth.service';
import { HaAuthenticatedUserService } from '../../../ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../../ha-service/ha-router.service';

@Component({
  selector: 'ha-header',
  templateUrl: './ha-header.component.html',
  styleUrls: ['./ha-header.component.scss'],
  imports: [
    NgClass,
    RouterLink,
    NgOptimizedImage,
    TranslatePipe,
    MatButton,
    FlUserModule,
    MatMenu,
    MatMenuItem,
    HaIsAdminDirective,
    MatIcon,
    MatMenuTrigger,
    FlIconModule,
  ],
})
export class HaHeaderComponent {
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private authService = inject(HaAuthService);

  isHomePage = input<boolean>(false);

  homeRoute: string = HaRouterService.getHomeRoute();

  loginRoute: string = HaRouterService.getLoginRoute();

  adminRoute: string = HaRouterService.getAdminPanelRoute();

  storyListRoute = HaRouterService.getStoriesListRoute();

  brickListRoute = HaRouterService.getBrickListRoute();

  appsListRoute = HaRouterService.getCommunityAppListRoute();

  productDocRoute = HaRouterService.getProductDocRoute();

  techDocRoute = HaRouterService.getTechDocRoute();

  iconsPageRoute = HaRouterService.getIconsRoute();

  tagsListRoute = HaRouterService.getTagsListRoute();

  agentListRoute = HaRouterService.getAgentsListRoute();

  profileRoute = HaRouterService.getProfileRoute();

  constellabRoute = HaConstellabHelper.getConstellabUrl();

  signupUrl = HaConstellabHelper.getConstellabSignupUrl();

  currentUser = toSignal(this.authenticatedUserService.getUser());

  logout(): void {
    this.authService.logout().subscribe();
  }
}
