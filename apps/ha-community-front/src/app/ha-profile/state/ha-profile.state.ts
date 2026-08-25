import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CoUser } from '@monorepo/community-lib';
import { ClSubscriptionHandler } from '@monorepo/core-lib';

import { HaAgentDatasourcePaginated } from '../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaBrickDatasourcePaginated } from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaCommunityAppDatasourcePaginated } from '../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaPartner } from '../../ha-core/ha-model/ha-entities/ha-partner';
import {
  HaRunStatAggregate,
  HaRunStatAggregateObjectType,
} from '../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaSpace } from '../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaStoryListDatasourcePaginated } from '../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaAgentService } from '../../ha-core/ha-service/ha-agent.service';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaBrickService } from '../../ha-core/ha-service/ha-brick.service';
import { HaCommunityAppService } from '../../ha-core/ha-service/ha-community-app.service';
import { HaPartnerService } from '../../ha-core/ha-service/ha-partner.service';
import { HaRunStatAggregateService } from '../../ha-core/ha-service/ha-run-stat-aggregate.service';
import { HaSpaceService } from '../../ha-core/ha-service/ha-space.service';
import { HaStoryService } from '../../ha-core/ha-service/ha-story.service';
import { HaUserService } from '../../ha-core/ha-service/ha-user.service';
import { HaProfileDatasourceFilters } from '../component/ha-profile/ha-profile.component';

@Injectable()
export class HaProfileState {
  user: WritableSignal<CoUser | null> = signal(null);
  isCurrentUser: WritableSignal<boolean> = signal(false);
  commonSpaces: WritableSignal<HaSpace[]> = signal([]);
  userRunStatAggregate: WritableSignal<HaRunStatAggregate | null> = signal(null);
  partner: WritableSignal<HaPartner | null> = signal(null);
  agents$: HaAgentDatasourcePaginated<HaProfileDatasourceFilters>;
  stories$: HaStoryListDatasourcePaginated<HaProfileDatasourceFilters>;
  bricks$: HaBrickDatasourcePaginated<HaProfileDatasourceFilters>;
  apps$: HaCommunityAppDatasourcePaginated<HaProfileDatasourceFilters>;
  subscriptionHandler: ClSubscriptionHandler = new ClSubscriptionHandler();
  private appService: HaCommunityAppService = inject(HaCommunityAppService);
  private agentService: HaAgentService = inject(HaAgentService);
  private brickService: HaBrickService = inject(HaBrickService);
  private storyService: HaStoryService = inject(HaStoryService);
  private userService = inject(HaUserService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private spaceService = inject(HaSpaceService);
  private runStateAggregateService = inject(HaRunStatAggregateService);
  private partnerService = inject(HaPartnerService);

  init(userId: string): void {
    this.apps$ = this.appService.getUserCommunityAppsPaginated();
    this.agents$ = this.agentService.getUserAgentsPaginated();
    this.bricks$ = this.brickService.getUserBricksPaginated();
    this.stories$ = this.storyService.getUserStoriesPaginated();

    const userSubscription = this.userService.getUserById(userId).subscribe((user) => {
      this.user.set(user);
    });

    const isCurrentUserSubscription = this.authenticatedUserService.getUser().subscribe((currentUser) => {
      this.isCurrentUser.set(currentUser != null && currentUser.id === userId);
    });

    const commonSpacesSubscription = this.spaceService.getUserCommonSpace(userId).subscribe((spaces) => {
      this.commonSpaces.set(spaces);
    });

    const userRunStatAggregateSubscription = this.runStateAggregateService
      .getObjectRunStatAggregate(userId, HaRunStatAggregateObjectType.USER)
      .subscribe((runStatsAggregate) => {
        this.userRunStatAggregate.set(runStatsAggregate);
      });

    const partnerSubscription = this.partnerService
      .getPartnerByUserId(userId)
      .subscribe((partner: HaPartner) => {
        this.partner.set(partner);
      });

    this.initDatasources(userId);

    this.subscriptionHandler.add(userSubscription);
    this.subscriptionHandler.add(isCurrentUserSubscription);
    this.subscriptionHandler.add(commonSpacesSubscription);
    this.subscriptionHandler.add(userRunStatAggregateSubscription);
    this.subscriptionHandler.add(partnerSubscription);
  }

  onDestroy(): void {
    this.subscriptionHandler.unsubscribe();
    this.stories$.disconnect();
    this.agents$.disconnect();
    this.bricks$.disconnect();
    this.apps$.disconnect();
  }

  private initDatasources(userId: string): void {
    this.agents$.getFirstPage({
      userId: userId,
    });
    this.bricks$.getFirstPage({
      userId: userId,
    });
    this.stories$.getFirstPage({
      userId: userId,
    });
    this.apps$.getFirstPage({
      userId: userId,
    });
  }
}
