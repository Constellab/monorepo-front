import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CoCommunityLibModule, CoListFiltersComponent } from '@monorepo/community-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';

import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import {
  HaAgentDatasourceFilters,
  HaAgentDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { FlDatasourceSortCriteria } from '@monorepo/front-core-lib/fl-core';

@Component({
  selector: 'ha-agent-list',
  templateUrl: './ha-agent-list.component.html',
  styleUrls: ['./ha-agent-list.component.scss'],
  imports: [
    FlTextIconModule,
    FlInfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    CoCommunityLibModule,
    AsyncPipe,
    FlCorePipeModule,
    HaDetailRoutePipe,
    HaListOfItemsComponent,
    HaPageComponent,
    CoListFiltersComponent,
  ],
})
export class HaAgentListComponent extends HaCommunityPageDirective implements OnInit {
  private agentService: HaAgentService = inject(HaAgentService);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);

  agentsPaginated: HaAgentDatasourcePaginated<HaAgentDatasourceFilters>;
  user: HaUser;
  spacesFilter: string[] = [];
  titleFilter: string = '';
  sortsCriteria: FlDatasourceSortCriteria[] = [];

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.user = user;
    });
    this.agentsPaginated = this.agentService.getAllWithFiltersPaginated();
    this.updateAgents();
    super.setMetaTags(
      'ha.agents.title',
      'ha.agents.description',
      null,
      HaRouterService.getFullRoute(HaRouterService.getAgentsListRoute())
    );
  }

  onTitleFilterChanged(title: string): void {
    this.titleFilter = title;
    this.updateAgents();
  }

  onSpacesFilterChanged(spaces: string[]): void {
    this.spacesFilter = spaces;
    this.updateAgents();
  }

  onSortsCriteriaChanged(sortsCriteria: FlDatasourceSortCriteria[]): void{
    this.sortsCriteria = sortsCriteria;
    this.updateAgents();
  }

  updateAgents(): void {
    this.agentsPaginated.getFirstPage({
      spacesFilter: this.spacesFilter,
      titleFilter: this.titleFilter,
    }, this.sortsCriteria);
  }

  onMyEntitiesChanged(myEntities: boolean): void{
    if (myEntities && !this.spacesFilter.includes('my-agents'))
      this.spacesFilter.push('my-agents');
    else if (!myEntities && this.spacesFilter.includes('my-agents'))
      this.spacesFilter = this.spacesFilter.filter((id) => id != 'my-agents');
    this.updateAgents();
  }
}
