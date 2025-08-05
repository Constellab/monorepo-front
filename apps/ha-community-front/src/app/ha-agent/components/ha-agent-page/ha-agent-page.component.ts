import { Component, inject, OnInit, Signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { first } from 'rxjs';

import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput,
} from '../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaSidenavButtonDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-sidenav-button/ha-sidenav-button.directive';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { Ha404Component } from '../../../ha-public/module/ha404/ha404.component';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import { HaAgentVersionsPanelComponent } from '../ha-agent-versions-panel/ha-agent-versions-panel.component';

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
export class HaAgentPageComponent implements OnInit {
  private agentService = inject(HaAgentService);
  private activeRoute = inject(ActivatedRoute);
  private dialogService = inject(FlDialogService);
  private agentPageState = inject(HaAgentPageState);

  profileRoute = HaRouterService.getProfileRoute();

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
}
