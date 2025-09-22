import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { first } from 'rxjs';

import {
  HaCommentsSectionComponent
} from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import {
  HaEntityPageInfosComponent
} from '../../../ha-core/ha-component/ha-entity-page-infos/ha-entity-page-infos.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaEntityCommentState } from '../../../ha-core/ha-state/ha-entity-comment.state';
import { HaAgentPageState } from '../../state/ha-agent-page.state';

@Component({
  selector: 'ha-agent-page',
  templateUrl: './ha-agent-page.component.html',
  styleUrls: ['./ha-agent-page.component.scss'],
  providers: [HaAgentPageState, HaEntityCommentState],
  imports: [
    FlTextIconModule,
    FlLoaderModule,
    FlUserModule,
    HaPageComponent,
    HaEntityPageInfosComponent,
    HaCommentsSectionComponent,
    TeTextEditorModule,
    ReactiveFormsModule,
    RouterOutlet,
    FlDateModule,
    TranslatePipe,
    RouterLink,
  ],
})
export class HaAgentPageComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private agentPageState = inject(HaAgentPageState);
  private entityCommentState: HaEntityCommentState = inject(HaEntityCommentState);

  profileRoute = HaRouterService.getProfileRoute();

  agent: Signal<HaAgent> = this.agentPageState.getAgent();
  notFound: Signal<boolean> = this.agentPageState.isAgentError;
  isLoading: Signal<boolean> = this.agentPageState.getIsLoading();
  agentCoAuthors: Signal<HaUser[]> = this.agentPageState.getAgentCoAuthors();
  contributors: Signal<HaUser[]> = computed(() => {
    if (!this.agent()) return [];
    if (!this.agentCoAuthors()) return [this.agent().createdBy];
    return [this.agent().createdBy, ...this.agentCoAuthors()];
  });
  currentUser: Signal<HaUser> = this.agentPageState.getCurrentUser();
  brickDependencies = this.agentPageState.getBrickDependencies();
  versions = this.agentPageState.getAgentVersionsList();
  isAuthor = computed(() => {
    if (!this.currentUser() || !this.agent()) return false;
    return this.currentUser().id === this.agent().createdBy.id;
  });

  tempTitle: string;
  entityType = HaEntityType.AGENT;

  ngOnInit(): void {
    this.activeRoute.params.pipe(first()).subscribe((params) => {
      if (!params.id) {
        return;
      }
      this.agentPageState.init(params.id, params.title);
      this.agentPageState.setLatestAgentVersion(params.id);
      this.tempTitle = ClStringHelper.fromKebabCaseToSentence(params.title);
      this.entityCommentState.init(this.entityType, params.id);
    });
  }
}
