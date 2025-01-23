import { Component, inject, OnInit } from '@angular/core';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { Observable } from 'rxjs';
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import {
  HaStoryDatasourcePaginated,
  HaStoryFilters,
} from '../../ha-core/ha-model/ha-entities/ha-story.class';
import {
  HaAgentDatasourceFilters,
  HaAgentDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-agent.class';
import {
  HaBrickDatasourceFilters,
  HaBrickDatasourcePaginated,
} from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaStoryService } from '../../ha-core/ha-service/ha-story.service';
import { HaAgentService } from '../../ha-core/ha-service/ha-agent.service';
import { HaBrickService } from '../../ha-core/ha-service/ha-brick.service';
import { HaLoggedInHomeComponent } from '../ha-logged-in-home/ha-logged-in-home.component';
import { HaNotLoggedInHomeComponent } from '../ha-not-logged-in-home/ha-not-logged-in-home.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ha-ha-home',
  templateUrl: './ha-home.component.html',
  styleUrls: ['./ha-home.component.scss'],
  imports: [HaLoggedInHomeComponent, HaNotLoggedInHomeComponent, AsyncPipe],
})
export class HaHomeComponent implements OnInit {
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private storyService: HaStoryService = inject(HaStoryService);
  private agentService: HaAgentService = inject(HaAgentService);
  private brickService: HaBrickService = inject(HaBrickService);

  user$: Observable<HaUser> = this.authenticatedUserService.getUser();

  stories$: HaStoryDatasourcePaginated<HaStoryFilters>;
  agents$: HaAgentDatasourcePaginated<HaAgentDatasourceFilters>;
  bricks$: HaBrickDatasourcePaginated<HaBrickDatasourceFilters>;

  ngOnInit(): void {
    this.stories$ = this.storyService.getAllPaginatedFiltered(4);
    this.stories$.getFirstPage({ title: '', categories: [], topics: [] });

    this.agents$ = this.agentService.getAllWithFiltersPaginated(4);
    this.agents$.getFirstPage({ spacesFilter: [], titleFilter: '' });

    this.bricks$ = this.brickService.getAllWithFiltersPaginated(4);
    this.bricks$.getFirstPage({ spacesFilter: [], titleFilter: '' });
  }
}
