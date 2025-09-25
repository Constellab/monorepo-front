import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { HaConstellabHelper } from '../../../ha-model/ha-config/ha-constellab.helper';
import { HaRouterService } from '../../../ha-service/ha-router.service';
import { HaFooterSocialsComponent } from '../ha-footer-socials/ha-footer-socials.component';

@Component({
  selector: 'ha-footer',
  templateUrl: './ha-footer.component.html',
  imports: [
    MatIconModule,
    FlIconModule,
    NgOptimizedImage,
    HaFooterSocialsComponent,
    NgTemplateOutlet,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    TranslatePipe,
    RouterLink,
  ],
  styleUrls: ['./ha-footer.component.scss'],
})
export class HaFooterComponent {
  isHomePage = input<boolean>(false);

  storiesListRoute = HaRouterService.getStoriesListRoute();
  appsListRoute = HaRouterService.getCommunityAppListRoute();
  agentsListRoute = HaRouterService.getAgentsListRoute();
  bricksListRoute = HaRouterService.getBrickListRoute();
  tagsListRoute = HaRouterService.getTagsListRoute();
  constellabUrl = HaConstellabHelper.getConstellabUrl();
}
