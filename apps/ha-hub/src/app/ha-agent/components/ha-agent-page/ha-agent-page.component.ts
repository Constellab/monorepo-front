import { Component, OnDestroy, OnInit, Signal, inject } from '@angular/core';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
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
import { MatIcon } from '@angular/material/icon';
import { HaSidenavButtonDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-sidenav-button/ha-sidenav-button.directive';
import { FlTextIconModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { HaAgentVersionsPanelComponent } from '../ha-agent-versions-panel/ha-agent-versions-panel.component';
import { Ha404Component } from '../../../ha-public/module/ha404/ha404.component';
import { FlLoaderModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlUserModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-agent-page',
  templateUrl: './ha-agent-page.component.html',
  styleUrls: ['./ha-agent-page.component.scss'],
  providers: [HaAgentPageState],
  imports: [
    MatIcon,
    HaSidenavButtonDirective,
    RouterLink,
    FlTextIconModule,
    HaAgentVersionsPanelComponent,
    RouterOutlet,
    Ha404Component,
    FlLoaderModule,
    MatIconButton,
    MatTooltip,
    FlUserModule,
    TranslatePipe,
  ],
})
export class HaAgentPageComponent implements OnInit, OnDestroy {
  private agentService = inject(HaAgentService);
  private activeRoute = inject(ActivatedRoute);
  private dialogService = inject(FlDialogService);
  private agentPageState = inject(HaAgentPageState);
  private jsonLdState = inject(HaJsonLdState);

  profileRoute = HaRouterService.getProfileRoute();
  agentsListRoute = HaRouterService.getAgentsListRoute();

  agent: Signal<HaAgent> = this.agentPageState.getAgent();
  notFound: Signal<boolean> = this.agentPageState.isAgentError;
  isLoading: Signal<boolean> = this.agentPageState.getIsLoading();
  isAuthor: Signal<boolean> = this.agentPageState.isAuthor;
  agentCoAuthors: Signal<HaUser[]> = this.agentPageState.getAgentCoAuthors();

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
