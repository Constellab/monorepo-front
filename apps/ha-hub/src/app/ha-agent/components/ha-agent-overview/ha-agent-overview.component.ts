import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { HaAgentTextEditorConfig } from '../ha-agent-core/ha-agent-text-editor.config';
import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TeRichText } from '@monorepo/text-editor';
import { HaLikeType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import { HaLikeService } from '../../../ha-core/ha-service/ha-like.service';
import { HaAuthService } from '../../../ha-core/ha-service/ha-auth.service';
import {
  HaCommentsPortalComponent,
  HaCommentsPortalData,
} from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-portal/ha-comments-portal.component';
import { HaCommentType } from '../../../ha-core/entity-module/ha-comments-core/model/ha-abstract-comment.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  HaAgentEditStyleDialogComponent,
  HaAgentEditStyleDialogInputData,
} from '../ha-agent-edit-style-dialog/ha-agent-edit-style-dialog.component';
import { HaCommunityPage } from '../../../ha-core/utils/ha-community.page';
import { HaTdServiceConfig } from '../../../ha-core/ha-model/ha-config/ha-td-service.config';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaRunStatAggregate } from '../../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { CoCommunityLibModule } from '../../../../../../../libs/community-lib/src/lib/co-community-lib.module';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { HaLikeButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-like-button/ha-like-button.component';
import { HaCommentButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-comment-button/ha-comment-button.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { HaRunStatAggregatePanelComponent } from '../../../ha-core/ha-component/ha-run-stat-aggregate-panel/ha-run-stat-aggregate-panel.component';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TeTextEditorModule } from '../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { HaAgentVersionDetailComponent } from '../ha-agent-version-detail/ha-agent-version-detail.component';
import { TranslatePipe } from '@ngx-translate/core';

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
    NgTemplateOutlet,
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
  ],
})
export class HaAgentOverviewComponent extends HaCommunityPage implements OnInit {
  private agentService: HaAgentService = inject(HaAgentService);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private authService: HaAuthService = inject(HaAuthService);
  private likeService: HaLikeService = inject(HaLikeService);
  private portalService: FlPortalService = inject(FlPortalService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private router: Router = inject(Router);
  private agentPageState: HaAgentPageState = inject(HaAgentPageState);
  private tdService: HaTdServiceConfig = inject(HaTdServiceConfig);

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

  agentIsLiked: Signal<boolean> = this.agentPageState.getIsLiked();

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

  openCommentsPanel(): void {
    this.portalService
      .createPortal(HaCommentsPortalComponent, this.portalService.getRightSidePortalConfig(), {
        user: this.agentPageState.getCurrentUser()(),
        entity: this.agent(),
        commentType: HaCommentType.AGENT_COMMENT,
      } as HaCommentsPortalData)
      .detachments();
  }

  toggleLikeAgentButton(): void {
    if (this.agentIsLiked()) {
      this.unlikeAgent();
    } else {
      this.likeAgent();
    }
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

  private unlikeAgent(): void {
    if (!this.authService.hasAuthorizationCookie()) {
      // navigate to login page
      this.router.navigate(['/login']);
      return;
    }
    this.likeService.unlike(HaLikeType.AGENT_LIKE, this.agent().id, HaAgent).subscribe((agent: HaAgent) => {
      if (agent != null) {
        this.agentPageState.setIsLiked(false);
        this.agentPageState.setAgent(agent);
      }
    });
  }

  private likeAgent(): void {
    if (!this.authService.hasAuthorizationCookie()) {
      // navigate to login page
      this.router.navigate(['/login']);
      return;
    }
    this.likeService.like(HaLikeType.AGENT_LIKE, this.agent().id, HaAgent).subscribe((agent: HaAgent) => {
      if (agent != null) {
        this.agentPageState.setIsLiked(true);
        this.agentPageState.setAgent(agent);
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
