import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { first } from 'rxjs';

import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaEntityPageInfosComponent } from '../../../ha-core/ha-component/ha-entity-page-infos/ha-entity-page-infos.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import {
  HaAgentVersion,
  HaAgentVersionFileInput,
} from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaEntityCommentState } from '../../../ha-core/ha-state/ha-entity-comment.state';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import {
  HaAgentEditStyleDialogComponent,
  HaAgentEditStyleDialogInputData,
} from '../ha-agent-edit-style-dialog/ha-agent-edit-style-dialog.component';

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
    FlCoreDirectiveModule,
    FlInputFileModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    HaDetailRoutePipe,
    MatButton,
  ],
})
export class HaAgentPageComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private agentPageState = inject(HaAgentPageState);
  private entityCommentState: HaEntityCommentState = inject(HaEntityCommentState);
  private snackBarService = inject(FlSnackBarService);
  private agentService = inject(HaAgentService);
  private dialogService = inject(FlDialogService);
  private router = inject(Router);

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
  canEdit = this.agentPageState.canEditAgent;
  currentVersion = this.agentPageState.agentVersion;

  tempTitle: string;
  entityType = HaEntityType.AGENT;
  inputFile: any;

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

  openEditAgentDialog(): void {
    const dialogData: HaAgentEditStyleDialogInputData = {
      mode: 'update',
      object: {
        style: this.currentVersion().style,
        isVersion: true,
        entityId: this.currentVersion().id,
      },
    };

    this.dialogService
      .openMediumDialog(HaAgentEditStyleDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe((result: HaAgentVersion) => {
        if (result) {
          this.agentPageState.setAgent(result.agent);
          this.agentPageState.setAgentVersion(result);
        }
      });
  }

  onFileSelected(event: any): void {
    this.inputFile = null;
    if (event == null) {
      return;
    }
    if (!event.name.endsWith('.json')) {
      this.snackBarService.openErrorMessage({ text: 'file_wrong_type', translateText: true });
      return;
    }

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      let isReplace = false;
      reader.onload = (e: any) => {
        const srcResult: HaAgentVersionFileInput = JSON.parse(e.target.result);
        if (!HaAgentVersionFileInput.isValid(srcResult)) {
          this.snackBarService.openErrorMessage({ text: 'file_wrong_format', translateText: true });
          return;
        }
        let inputData: FlConfirmDialogInput;
        if (this.versions() && this.versions()[0].versionState == 'PUBLISHED') {
          inputData = {
            title: 'create_new_agent_version',
            content: 'create_new_agent_version_content',
            successMessage: 'agent_version_created',
            observable: this.agentService.createNewDraftVersion(this.agent().id, srcResult),
          };
        } else {
          isReplace = true;
          inputData = {
            title: 'replace_not_published_agent_version',
            content: 'replace_not_published_agent_version_content',
            successMessage: 'agent_version_replaced',
            observable: this.agentService.replaceDraftVersion(this.agent().id, srcResult),
          };
        }
        this.dialogService
          .openConfirmDialog(inputData)
          .afterClosed()
          .subscribe((result) => {
            if (result.result) {
              if (!isReplace) {
                this.agentPageState.addAgentVersionToList(result.result);
              }
              this.router.navigate([HaRouterService.getAgentVersionRoute(result.result)]);
            }
          });
      };

      reader.readAsText(event);
    }
  }
}
