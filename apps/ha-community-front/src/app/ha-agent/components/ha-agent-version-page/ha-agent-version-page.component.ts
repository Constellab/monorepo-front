import { ChangeDetectorRef, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import {
  FlDialogService,
  FlWarningDialogComponent,
  FlWarningDialogData,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';
import { HaTdServiceConfig } from '../../../ha-core/ha-model/ha-config/ha-td-service.config';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import {
  HaAgentEditStyleDialogComponent,
  HaAgentEditStyleDialogInputData,
} from '../ha-agent-edit-style-dialog/ha-agent-edit-style-dialog.component';
import { HaAgentVersionDetailComponent } from '../ha-agent-version-detail/ha-agent-version-detail.component';

@Component({
  selector: 'ha-agent-version-page',
  templateUrl: './ha-agent-version-page.component.html',
  styleUrls: ['./ha-agent-version-page.component.scss'],
  imports: [
    CoCommunityLibModule,
    MatButton,
    MatIconButton,
    MatTooltip,
    MatIcon,
    HaAgentVersionDetailComponent,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class HaAgentVersionPageComponent extends HaCommunityPageDirective implements OnInit {
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
    const warnings: FlTranslatableText[] = [];
    if (this.agentVersion().versionInfos?.isEmpty()) {
      warnings.push('agent_version_publish_no_version_info_warning');
    }
    if (this.agentVersion().agent?.description?.isEmpty()) {
      warnings.push('agent_no_description_warning');
    }

    if (warnings.length == 0) {
      this.agentPageState.publishAgentVersion(agentVersionId);
      return;
    }
    const data: FlWarningDialogData = {
      title: 'publish_agent_version',
      warnings: warnings,
      confirmText: 'publish',
    };

    this.dialogService
      .openSmallDialog(FlWarningDialogComponent, { data: data })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.agentPageState.publishAgentVersion(agentVersionId);
      });
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
