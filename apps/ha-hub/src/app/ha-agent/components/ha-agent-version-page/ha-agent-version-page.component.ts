import { ChangeDetectorRef, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlDialogService } from '@monorepo/front-core-lib';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import {
  HaAgentEditStyleDialogComponent,
  HaAgentEditStyleDialogInputData,
} from '../ha-agent-edit-style-dialog/ha-agent-edit-style-dialog.component';
import { HaCommunityPage } from '../../../ha-core/utils/ha-community.page';
import { HaTdServiceConfig } from '../../../ha-core/ha-model/ha-config/ha-td-service.config';
import { HaRunStatAggregate } from '../../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';

@Component({
  selector: 'ha-agent-version-page',
  templateUrl: './ha-agent-version-page.component.html',
  styleUrls: ['./ha-agent-version-page.component.scss'],
})
export class HaAgentVersionPageComponent extends HaCommunityPage implements OnInit {
  private agentService: HaAgentService = inject(HaAgentService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private dialogService: FlDialogService = inject(FlDialogService);
  private router: Router = inject(Router);
  private agentPageState: HaAgentPageState = inject(HaAgentPageState);
  private changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private tdService: HaTdServiceConfig = inject(HaTdServiceConfig);

  agentVersion: Signal<HaAgentVersion> = computed(() => {
    const agentVersion_ = this.agentPageState.agentVersion();
    if (!agentVersion_) {
      return null;
    }
    const agentVersionImage: string =
      agentVersion_.style.icon_type === 'COMMUNITY_IMAGE'
        ? this.tdService.getCommunityIconBaseApiUrl() + `/${agentVersion_.style.icon_technical_name}`
        : null;
    super.setMetaTags(
      {
        text: 'ha.agent_version.title',
        translateParam: {
          param: { title: agentVersion_.agent.title, version: agentVersion_.version },
        },
      },
      {
        text: 'ha.agent_version.description',
        translateParam: {
          param: { title: agentVersion_.agent.title, version: agentVersion_.version },
        },
      },
      agentVersionImage,
      HaRouterService.getFullRoute(HaRouterService.getAgentVersionRoute(agentVersion_))
    );
    return agentVersion_;
  });
  canEdit: Signal<boolean> = this.agentPageState.canEditAgent;
  isAgentVersionError: Signal<boolean> = this.agentPageState.isAgentVersionError;
  isAgentVersionLoading: Signal<boolean> = this.agentPageState.isAgentVersionLoading;
  agentVersionRunStatAggregate: Signal<HaRunStatAggregate> = this.agentPageState.runStatAggregate;

  currentVersion: any = null;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.currentVersion = null;
      this.changeDetector.detectChanges();
      this.currentVersion = params['versionNumber'];
      this.agentPageState.setAgentVersionByVersionNumber(params['id'], params['versionNumber']);
    });
  }

  publishAgentVersion(agentVersionId: string): void {
    this.agentPageState.publishAgentVersion(agentVersionId);
  }

  deleteAgentVersion(): void {
    //TODO: Check if last version with the state
    this.dialogService
      .openConfirmDialog({
        title: 'delete_agent_version',
        content: 'delete_agent_version_confirmation',
        successMessage: 'agent_version_deleted',
        observable: this.agentService.deleteAgentVersion(this.agentVersion().id),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.choice) {
          this.router
            .navigate([
              HaRouterService.getAgentRoute(this.agentVersion().agent.id, this.agentVersion().agent.title),
            ])
            .then(() => {
              this.agentPageState.removeAgentVersionToList(this.agentVersion());
            });
        }
      });
  }

  openAgentEditStyleDialog(): void {
    const dialogData: HaAgentEditStyleDialogInputData = {
      mode: 'update',
      object: {
        style: this.agentVersion().style,
        isVersion: true,
        entityId: this.agentVersion().id,
      },
    };
    this.dialogService
      .openSmallDialog(HaAgentEditStyleDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe((result: HaAgentVersion) => {
        if (result) {
          this.agentPageState.setAgent(result.agent);
          this.agentPageState.setAgentVersion(result);
        }
      });
  }
}
