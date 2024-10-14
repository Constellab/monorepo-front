import { ChangeDetectorRef, Component, OnInit, Signal } from '@angular/core';
import {HaAgentVersion} from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import {HaAgentService} from '../../../ha-core/ha-service/ha-agent.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {HaAgentPageState} from '../../state/ha-agent-page.state';

@Component({
  selector: 'ha-agent-version-page',
  templateUrl: './ha-agent-version-page.component.html',
  styleUrls: ['./ha-agent-version-page.component.scss']
})
export class HaAgentVersionPageComponent implements OnInit {


  agentVersion: Signal<HaAgentVersion> = this.agentPageState.agentVersion;
  canEdit: Signal<boolean> = this.agentPageState.canEditAgent;
  isAgentVersionError: Signal<boolean> = this.agentPageState.isAgentVersionError;
  isAgentVersionLoading: Signal<boolean> = this.agentPageState.isAgentVersionLoading;
  currentVersion: any = null;

  constructor(private agentService: HaAgentService,
              private activatedRoute: ActivatedRoute,
              private dialogService: FlDialogService,
              private snackBarService: FlSnackBarService,
              private router: Router,
              private agentPageState: HaAgentPageState,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.currentVersion = null;
      this.changeDetector.detectChanges();
      this.currentVersion = params['versionNumber'];
      this.agentPageState.setAgentVersionByVersionNumber(params['id'], params['versionNumber']);
    });
  }

  publishAgentVersion(): void {
    if (this.agentVersion().versionState === 'PUBLISHED') return;
    if (this.agentVersion().code == null || this.agentVersion().code === '') {
      this.snackBarService.openErrorMessage({
        text: 'cannot_publish_agent_version_without_code',
        translateText: true
      })
      return;
    }
    this.dialogService.openConfirmDialog({
      title: 'publish_agent_version',
      content: 'publish_agent_version_confirmation',
      successMessage: 'agent_version_published',
      observable: this.agentService.publishAgentVersion(this.agentVersion().id)
    }).afterClosed().subscribe((result) => {
      if (result.choice && result.result != null) {
        this.agentPageState.updateAgentVersion(result.result);
        this.router.navigate([HaRouterService.getAgentRoute(this.agentVersion().agent.id, this.agentVersion().agent.title)]);
      }
    });
  }

  updateAgentVersion(agentVersion: HaAgentVersion): void {
    this.agentPageState.setAgentVersion(agentVersion);
  }

  deleteAgentVersion(): void {
    //TODO: Check if last version with the state
    this.dialogService.openConfirmDialog({
      title: 'delete_agent_version',
      content: 'delete_agent_version_confirmation',
      successMessage: 'agent_version_deleted',
      observable: this.agentService.deleteAgentVersion(this.agentVersion().id)
    }).afterClosed().subscribe((result) => {
      if (result.choice) {
        this.router.navigate(
          [
            HaRouterService.getAgentRoute(this.agentVersion().agent.id,
              this.agentVersion().agent.title)
          ]).then(()=>{
          this.agentPageState.removeAgentVersionToList(this.agentVersion());
        });
      }
    });
  }
}
