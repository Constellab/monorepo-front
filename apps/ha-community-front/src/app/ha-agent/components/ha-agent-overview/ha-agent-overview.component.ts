import { NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaCommentButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-comment-button/ha-comment-button.component';
import { HaLikeButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-like-button/ha-like-button.component';
import { HaRunStatAggregatePanelComponent } from '../../../ha-core/ha-component/ha-run-stat-aggregate-panel/ha-run-stat-aggregate-panel.component';
import { HaTdServiceConfig } from '../../../ha-core/ha-model/ha-config/ha-td-service.config';
import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaRunStatAggregate } from '../../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import { HaAgentTextEditorConfig } from '../ha-agent-core/ha-agent-text-editor.config';
import {
  HaAgentEditStyleDialogComponent,
  HaAgentEditStyleDialogInputData,
} from '../ha-agent-edit-style-dialog/ha-agent-edit-style-dialog.component';
import { HaAgentVersionDetailComponent } from '../ha-agent-version-detail/ha-agent-version-detail.component';

@Component({
  selector: 'ha-agent-overview',
  templateUrl: './ha-agent-overview.component.html',
  styleUrls: ['./ha-agent-overview.component.scss'],
  imports: [
    CoCommunityLibModule,
    FlFormModule,
    RouterLink,
    FlUserModule,
    FlDateModule,
    HaLikeButtonComponent,
    HaCommentButtonComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
    HaRunStatAggregatePanelComponent,
    FlLoaderModule,
    MatButton,
    TeTextEditorModule,
    NgClass,
    ReactiveFormsModule,
    HaAgentVersionDetailComponent,
    TranslatePipe,
    HaCommentsSectionComponent,
  ],
})
export class HaAgentOverviewComponent extends HaCommunityPageDirective implements OnInit {
  private agentService: HaAgentService = inject(HaAgentService);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private dialogService: FlDialogService = inject(FlDialogService);
  private router: Router = inject(Router);
  private agentPageState: HaAgentPageState = inject(HaAgentPageState);
  private tdService: HaTdServiceConfig = inject(HaTdServiceConfig);

  commentType: HaEntityType = HaEntityType.AGENT;

  profileRoute = HaRouterService.getProfileRoute();

  descriptionEditorDisabled: boolean = true;

  agent: Signal<HaAgent> = computed(() => {
    const agent_ = this.agentPageState.getAgent()();
    const agentImage: string =
      agent_.latestStyle.icon_type === 'COMMUNITY_IMAGE'
        ? this.tdService.getCommunityIconBaseApiUrl() + `/${agent_.latestStyle.icon_technical_name}`
        : null;
    super.setMetaTags(
      { text: 'ha.agent.title', translateParam: { param: { title: agent_.title } } },
      { text: 'ha.agent.description', translateParam: { param: { title: agent_.title } } },
      agentImage,
      HaRouterService.getFullRoute(
        HaRouterService.getAgentRoute(agent_.id, ClStringHelper.getCleanUrlPath(agent_.title))
      )
    );
    return agent_;
  });

  canEditAgent: Signal<boolean> = this.agentPageState.canEditAgent;

  currentUser: Signal<HaUser> = this.agentPageState.getCurrentUser();

  isLoading: Signal<boolean> = this.agentPageState.getIsLoading();

  isAuthor: Signal<boolean> = this.agentPageState.isAuthor;

  agentDescription: Signal<TeRichText> = this.agentPageState.getAgentDescription();

  descriptionFormControl: Signal<FormControl<TeRichText>> = computed(() => {
    const formControl = new FormControl<TeRichText>(null);
    if (this.agentDescription()) {
      formControl.patchValue(this.agentDescription());
    } else {
      formControl.patchValue(new TeRichText());
    }
    formControl.disable();
    return formControl;
  });

  agentDescriptionEmpty: Signal<boolean> = computed(() => {
    const richText = this.agentDescription();
    return richText == null || richText.isEmpty();
  });

  textEditorConfig: Signal<HaAgentTextEditorConfig> = computed(() => {
    return new HaAgentTextEditorConfig(this.agentService, this.agent().id);
  });

  agentRunStatAggregate: Signal<HaRunStatAggregate> = this.agentPageState.agentRunStatAggregate;

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      if (params['id'] != null) {
        this.setupLatestAgentVersion(params['id']);
      }
    });
  }

  setupLatestAgentVersion(id: string): void {
    this.agentPageState.setLatestAgentVersion(id);
  }

  onDescriptionChange(description: TeRichText): void {
    this.descriptionFormControl().setValue(description);
  }

  onDescriptionEditorButtonClick(): void {
    if (this.descriptionEditorDisabled) {
      this.descriptionEditorDisabled = false;
      this.descriptionFormControl().enable();
      return;
    }

    this.agentService
      .saveAgentDescription(this.agent().id, this.descriptionFormControl().value)
      .subscribe((agent: HaAgent) => {
        this.descriptionEditorDisabled = true;
        if (agent != null) {
          this.agentPageState.setAgent(agent);
        }
        this.descriptionFormControl().disable();
      });
  }

  onTitleChange(title: string): void {
    this.agentService.updateTitle(this.agent().id, title).subscribe((agent) => {
      if (agent != null) {
        this.agentPageState.setAgent(agent);
      }
    });
  }

  scrollToComments(commentsSection: any): void {
    commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  deleteAgent(): void {
    const confirmDeleteDialogInput: FlConfirmDialogInput = {
      title: 'delete_agent',
      content: 'delete_agent_content',
      successMessage: 'agent_deleted',
      observable: this.agentService.deleteAgent(this.agent().id),
    };
    this.dialogService
      .openConfirmDialog(confirmDeleteDialogInput)
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult) => {
        if (res.choice) {
          this.router.navigate(['../'], { relativeTo: this.activeRoute });
        }
      });
  }

  openAgentEditStyleDialog(): void {
    const dialogData: HaAgentEditStyleDialogInputData = {
      mode: 'update',
      object: {
        style: this.agent().latestStyle,
        isVersion: false,
        entityId: this.agent().id,
      },
    };
    this.dialogService
      .openSmallDialog(HaAgentEditStyleDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe((result: HaAgent) => {
        if (result) {
          this.agentPageState.setAgent(result);
        }
      });
  }
}
