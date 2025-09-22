import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';

import { HaEntityType } from '../../../ha-model/ha-entities/ha-entity-type';
import { HaTreePath } from '../../../ha-model/ha-entities/ha-path-tree.class';
import { HaRouterService } from '../../../ha-service/ha-router.service';
import { HaCurrentPageState } from '../../../ha-state/ha-current-page.state';
import { HaHeaderComponent } from '../ha-header/ha-header.component';

@Component({
  selector: 'ha-page-header',
  templateUrl: './ha-page-header.component.html',
  styleUrls: ['./ha-page-header.component.scss'],
  imports: [HaHeaderComponent, TranslatePipe, RouterLink, FlTranslateModule, AsyncPipe],
})
export class HaPageHeaderComponent {
  private currentPageState = inject(HaCurrentPageState);

  title = input.required<FlTranslatableText>();

  description = input<string>(null);

  completeTreePaths = computed(() => {
    const urls = this.currentPageState.getUrls()();
    const pathTree: HaTreePath[] = [{ name: { text: 'home', translateText: true }, route: '/' }];
    if (urls.length === 0) return pathTree;
    pathTree.push({
      name: { text: urls[0].path, translateText: true },
      route: `/${urls[0].path}`,
    });
    if (urls.length < 3) return pathTree;
    const entityType = this.currentPageState.getCurrentEntityType()();
    let entityRoute: string;
    switch (entityType) {
      case HaEntityType.STORY:
        entityRoute = HaRouterService.getStoryRoute(urls[1].path, urls[2].path);
        break;
      case HaEntityType.APP:
        entityRoute = HaRouterService.getCommunityAppRoute(urls[1].path, urls[2].path);
        break;
      case HaEntityType.AGENT:
        entityRoute = HaRouterService.getAgentRoute(urls[1].path, urls[2].path);
        break;
      case HaEntityType.BRICK:
        entityRoute = HaRouterService.getBrickPageRoute(urls[1].path, urls[2].path);
        break;
      default:
        return pathTree;
    }
    pathTree.push({
      name: this.title(),
      route: entityRoute,
    });
    return pathTree;
  });
}
