import { Component, computed, OnInit, Signal } from '@angular/core';
import { HaAgentTextEditorConfig } from '../ha-agent-core/ha-agent-text-editor.config';
import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TeRichText, TeRichTextContent } from '@monorepo/text-editor';
import { HaLikeType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import { HaLikeService } from '../../../ha-core/ha-service/ha-like.service';
import { HaAuthService } from '../../../ha-core/ha-service/ha-auth.service';
import {
  HaCommentsPortalComponent,
  HaCommentsPortalData
} from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-portal/ha-comments-portal.component';
import { HaCommentType } from '../../../ha-core/entity-module/ha-comments-core/model/ha-abstract-comment.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalService
} from '@monorepo/front-core-lib';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ha-agent-overview',
  templateUrl: './ha-agent-overview.component.html',
  styleUrls: ['./ha-agent-overview.component.scss'],
})
export class HaAgentOverviewComponent implements OnInit {

  profileRoute = HaRouterService.getProfileRoute();

  descriptionEditorDisabled: boolean = true;


  agent: Signal<HaAgent> = this.agentPageState.getAgent();
  isAgentVersionError: Signal<boolean> = this.agentPageState.isAgentVersionError;
  isAgentVersionLoading: Signal<boolean> = this.agentPageState.isAgentVersionLoading;
  canEditAgent: Signal<boolean> = this.agentPageState.canEditAgent;
  agentIsLiked: Signal<boolean> = this.agentPageState.getIsLiked();
  isLoading: Signal<boolean> = this.agentPageState.getIsLoading();
  isAuthor: Signal<boolean> = this.agentPageState.isAuthor;
  agentDescription: Signal<TeRichTextContent> = this.agentPageState.getAgentDescription();
  descriptionFormControl: Signal<FormControl<TeRichTextContent>> = computed(() => {
    const formControl = new FormControl<TeRichTextContent>(null);
    if (this.agentDescription()) {
      formControl.patchValue(this.agentDescription());
    } else {
      formControl.patchValue(TeRichText.emptyContent());
    }
    formControl.disable();
    return formControl;
  });
  agentDescriptionEmpty: Signal<boolean> = computed(() => {
    return TeRichText.isEmpty(this.agentDescription());
  });
  textEditorConfig: Signal<HaAgentTextEditorConfig> = computed(() => {
    return new HaAgentTextEditorConfig(this.agentService, this.agent().id);
  });

  constructor(
    private agentService: HaAgentService,
    private activeRoute: ActivatedRoute,
    private authService: HaAuthService,
    private likeService: HaLikeService,
    private portalService: FlPortalService,
    private dialogService: FlDialogService,
    private router: Router,
    private agentPageState: HaAgentPageState) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      if (params['id'] != null) {
        this.setupLatestAgentVersion(params['id']);
      }
    });

  }

  setupLatestAgentVersion(id: string): void {
    this.agentPageState.setLatestAgentVersion(id);
  }

  onDescriptionChange(description: TeRichTextContent): void {
    this.descriptionFormControl().setValue(description);
  }


  onDescriptionEditorButtonClick(): void {
    if (this.descriptionEditorDisabled) {
      this.descriptionEditorDisabled = false;
      this.descriptionFormControl().enable();
      return;
    }

    this.agentService.saveAgentDescription(this.agent().id, this.descriptionFormControl().value)
      .subscribe((agent: HaAgent) => {
        this.descriptionEditorDisabled = true;
        if (agent != null) {
          this.agentPageState.setAgent(agent);
        }
        this.descriptionFormControl().disable();
      })
  }

  onTitleChange(title: string): void {
    this.agentService.updateTitle(this.agent().id, title).subscribe();
  }

  openCommentsPanel(): void {
    this.portalService.createPortal(HaCommentsPortalComponent, this.portalService.getRightSidePortalConfig(), {
      user: this.agentPageState.getCurrentUser()(),
      entity: this.agent(),
      commentType: HaCommentType.AGENT_COMMENT
    } as HaCommentsPortalData).detachments();

  }

  toggleLikeAgentButton(): void{
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
      observable: this.agentService.deleteAgent(this.agent().id)
    };
    this.dialogService.openConfirmDialog(confirmDeleteDialogInput).afterClosed().subscribe((res: FlConfirmDialogResult) => {
      if (res.choice) {
        this.router.navigate(['../'], {relativeTo: this.activeRoute});
      }
    });
  }

  private unlikeAgent(): void {
    if (!this.authService.hasAuthorizationCookie()) {
      // navigate to login page
      this.router.navigate(['/login']);
      return;
    }
    this.likeService.unlike(HaLikeType.AGENT_LIKE, this.agent().id).subscribe((agent: HaAgent) => {
      if (agent != null) {
        this.agentPageState.setIsLiked(false);
        this.agentPageState.setAgent(agent);
      }
    });
  }

  private likeAgent(): void {
    if (!this.authService.hasAuthorizationCookie()){
      // navigate to login page
      this.router.navigate(['/login']);
      return;
    }
    this.likeService.like(HaLikeType.AGENT_LIKE, this.agent().id).subscribe((agent: HaAgent) => {
      if (agent != null) {
        this.agentPageState.setIsLiked(true);
        this.agentPageState.setAgent(agent);
      }
    });
  }
}
