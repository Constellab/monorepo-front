import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { ActivatedRoute } from '@angular/router';
import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput,
} from '../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { first } from 'rxjs';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';

@Component({
    selector: 'ha-agent-page',
    templateUrl: './ha-agent-page.component.html',
    styleUrls: ['./ha-agent-page.component.scss'],
    providers: [HaAgentPageState],
    standalone: false
})
export class HaAgentPageComponent implements OnInit, OnDestroy {
  profileRoute = HaRouterService.getProfileRoute();
  agentsListRoute = HaRouterService.getAgentsListRoute();

  agent: Signal<HaAgent> = this.agentPageState.getAgent();
  notFound: Signal<boolean> = this.agentPageState.isAgentError;
  isLoading: Signal<boolean> = this.agentPageState.getIsLoading();
  isAuthor: Signal<boolean> = this.agentPageState.isAuthor;
  agentCoAuthors: Signal<HaUser[]> = this.agentPageState.getAgentCoAuthors();

  constructor(
    private agentService: HaAgentService,
    private activeRoute: ActivatedRoute,
    private dialogService: FlDialogService,
    private agentPageState: HaAgentPageState,
    private jsonLdState: HaJsonLdState
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.pipe(first()).subscribe((params) => {
      if (!params.id) {
        return;
      }
      this.agentPageState.init(params.id, params.title);
    });
  }

  openLtCoAuthorsDialog(): void {
    const input: HaCoAuthorsDialogInput = {
      id: this.agent().id,
      service: this.agentService,
      inviteText: 'invite_agent_coauthor_information',
    };

    this.dialogService
      .openSmallDialog(HaCoAuthorDialogComponent, { data: input })
      .afterClosed()
      .subscribe(() => {
        if (this.agent()) {
          this.agentPageState.initCoAuthors();
        }
      });
  }

  ngOnDestroy(): void {
    // this.jsonLdState.clearJsonLdContent();
  }
}
