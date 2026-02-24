import { Component, computed, inject, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { TranslatePipe } from '@ngx-translate/core';

import { HaGithubStarButtonComponent } from '../../../ha-core/ha-component/ha-github-star-button/ha-github-star-button.component';
import { HaRunStatAggregatePanelComponent } from '../../../ha-core/ha-component/ha-run-stat-aggregate-panel/ha-run-stat-aggregate-panel.component';
import { HaBrick } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaBrickVersion } from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaRunStatAggregate } from '../../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaReferenceDTO } from '../../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaBrickPageState } from '../../state/ha-brick-page.state';

@Component({
  selector: 'ha-brick-description-page',
  templateUrl: './ha-brick-description-page.component.html',
  styleUrls: ['./ha-brick-description-page.component.scss'],
  imports: [
    CoCommunityLibModule,
    HaRunStatAggregatePanelComponent,
    FlKeyValueModule,
    HaGithubStarButtonComponent,
    RouterLink,
    TranslatePipe,
  ],
})
export class HaBrickDescriptionPageComponent extends HaCommunityPageDirective {
  private router: Router = inject(Router);
  private brickPageState: HaBrickPageState = inject(HaBrickPageState);

  brick: Signal<HaBrick> = computed(() => {
    const brick = this.brickPageState.brick();
    if (brick) {
      this.onBrick(brick);
    }
    return brick;
  });
  latestBrickVersion: Signal<HaBrickVersion> = this.brickPageState.latestBrickVersion;
  directReferences: Signal<HaReferenceDTO[]> = this.brickPageState.directReferences;
  brickRunStatAggregate: Signal<HaRunStatAggregate> = this.brickPageState.brickRunStatAggregate;

  entityType = HaEntityType.BRICK;

  private onBrick(brick: HaBrick): void {
    this.metadataService.setPageTitle('ha.brick.title', true, {
      title: brick.name,
    });
    this.metadataService.addMetaTag('description', 'ha.brick.description', true, { description: brick.name });
    super.setMetaTags(
      {
        text: 'ha.brick.title',
        translateParam: { param: { title: brick.name } },
      },
      {
        text: 'ha.brick.description',
        translateParam: { param: { title: brick.name } },
      },
      brick.imageLink,
      HaRouterService.getFullRoute(this.router.url)
    );
  }
}
