import {Component, Signal} from '@angular/core';
import {
  HaAgentVersion,
  HaAgentVersionFileInput
} from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import {HaAgentService} from '../../../ha-core/ha-service/ha-agent.service';
import {FlConfirmDialogInput, FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {Router} from '@angular/router';
import {HaAgentPageState} from '../../state/ha-agent-page.state';
import {HaAgent} from '../../../ha-core/ha-model/ha-entities/ha-agent.class';

@Component({
  selector: 'ha-agent-versions-panel',
  templateUrl: './ha-agent-versions-panel.component.html',
  styleUrls: ['./ha-agent-versions-panel.component.scss']
})
export class HaAgentVersionsPanelComponent {

  canEditAgent: Signal<boolean> = this.agentPageState.canEditAgent;
  agent: Signal<HaAgent> = this.agentPageState.getAgent();
  agentVersions: Signal<HaAgentVersion[]> = this.agentPageState.getAgentVersionsList();
  inputFile: any;

  constructor(private agentService: HaAgentService,
              private snackBarService: FlSnackBarService,
              private dialogService: FlDialogService,
              private router: Router,
              private agentPageState: HaAgentPageState) {
  }

  onFileSelected(event: any): void {
    this.inputFile = null;
    if (event == null) {
      return;
    }
    if (!event.name.endsWith('.json')) {
      this.snackBarService.openErrorMessage({text: 'file_wrong_type', translateText: true});
      return;
    }

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
      let isReplace = false;
      reader.onload = (e: any) => {
        const srcResult: HaAgentVersionFileInput = JSON.parse(e.target.result);
        if(!HaAgentVersionFileInput.isValid(srcResult)){
          this.snackBarService.openErrorMessage({text: 'file_wrong_format', translateText: true});
          return;
        }
        let inputData: FlConfirmDialogInput;
        if (this.agentVersions() && this.agentVersions()[0].versionState == 'PUBLISHED') {
          inputData = {
            title: 'create_new_agent_version',
            content: 'create_new_agent_version_content',
            successMessage: 'agent_version_created',
            observable: this.agentService.createNewDraftVersion(this.agent().id, srcResult)
          }
        } else {
          isReplace = true;
          inputData = {
            title: 'replace_not_published_agent_version',
            content: 'replace_not_published_agent_version_content',
            successMessage: 'agent_version_replaced',
            observable: this.agentService.replaceDraftVersion(this.agent().id, srcResult)
          }
        }
        this.dialogService.openConfirmDialog(inputData).afterClosed().subscribe((result) => {
          if (result.result) {
            if(!isReplace){
              this.agentPageState.addAgentVersionToList(result.result);
            }
            this.router.navigate([HaRouterService.getAgentVersionRoute(result.result)]);
          }
        });
      }

      reader.readAsText(event);
    }
  }
}
