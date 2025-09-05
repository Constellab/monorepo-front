import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { HaConstellabHelper } from '../../ha-model/ha-config/ha-constellab.helper';
import { HaRouterService } from '../../ha-service/ha-router.service';
import { HaButtonComponent } from '../ha-button/ha-button.component';

@Component({
  selector: 'ha-header',
  templateUrl: './ha-header.component.html',
  styleUrls: ['./ha-header.component.scss'],
  imports: [NgClass, RouterLink, NgOptimizedImage, TranslatePipe, HaButtonComponent],
})
export class HaHeaderComponent {

  isHomePage = input<boolean>(false);

  homeRoute: string = HaRouterService.getHomeRoute();

  loginRoute: string = HaRouterService.getLoginRoute();

  adminRoute: string = HaRouterService.getAdminPanelRoute();

  storyListRoute = HaRouterService.getStoriesListRoute();

  brickListRoute = HaRouterService.getBrickListRoute();

  appsListRoute = HaRouterService.getCommunityAppListRoute();

  productDocRoute = HaRouterService.getProductDocRoute();

  techDocRoute = HaRouterService.getTechDocRoute();

  agentListRoute = HaRouterService.getAgentsListRoute();

  profileRoute = HaRouterService.getProfileRoute();

  constellabRoute = HaConstellabHelper.getConstellabUrl();
}
