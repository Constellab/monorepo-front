import { ChangeDetectorRef, Component, OnInit, Signal } from '@angular/core';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlDialogService, FlSnackBarService } from '@monorepo/front-core-lib';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import {
  HaAgentEditStyleDialogComponent,
  HaAgentEditStyleDialogInputData,
} from '../ha-agent-edit-style-dialog/ha-agent-edit-style-dialog.component';

@Component({
  selector: 'ha-agent-version-page',
  templateUrl: './ha-agent-version-page.component.html',
  styleUrls: ['./ha-agent-version-page.component.scss'],
})
export class HaAgentVersionPageComponent implements OnInit {
  agentVersion: Signal<HaAgentVersion> = this.agentPageState.agentVersion;
  canEdit: Signal<boolean> = this.agentPageState.canEditAgent;
  isAgentVersionError: Signal<boolean> = this.agentPageState.isAgentVersionError;
  isAgentVersionLoading: Signal<boolean> = this.agentPageState.isAgentVersionLoading;
  currentVersion: any = null;

  constructor(
    private agentService: HaAgentService,
    private activatedRoute: ActivatedRoute,
    private dialogService: FlDialogService,
    private snackBarService: FlSnackBarService,
    private router: Router,
    private agentPageState: HaAgentPageState,
    private changeDetector: ChangeDetectorRef
  ) {}

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
