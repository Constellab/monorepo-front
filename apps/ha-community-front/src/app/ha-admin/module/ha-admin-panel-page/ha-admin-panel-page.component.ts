import { Component } from '@angular/core';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import {
  FlHorizontalNavBarItem,
  FlHorizontalNavBarModule,
} from '@monorepo/front-core-lib/fl-horizontal-nav-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-admin-panel-page',
  templateUrl: './ha-admin-panel-page.component.html',
  styleUrls: ['./ha-admin-panel-page.component.scss'],
  imports: [FlLoaderModule, FlHorizontalNavBarModule, FlTextIconModule, MatIcon, RouterOutlet, TranslatePipe],
})
export class HaAdminPanelPageComponent {
  routes: FlHorizontalNavBarItem[] = [
    {
      label: { text: 'bricks', translateText: true },
      icon: 'brick',
      route: HaRouterService.getAdminPanelBricksRoute(),
    },
    {
      label: { text: 'stories', translateText: true },
      icon: 'description',
      route: HaRouterService.getAdminPanelStoriesRoute(),
    },
  ];
}
