import { Component, OnInit } from '@angular/core';
import { LabScenario } from '../../../../lab-core/model/entities/lab-scenario.entity';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  LabSelectTypeDialogComponent,
  LabSelectTypeDialogInput
} from '../../../../lab-core/entity-module/lab-type-core/component/lab-select-type-dialog/lab-select-type-dialog.component';
import { LabTypeEntity } from '../../../../lab-core/model/entities/lab-type/lab-type.entity';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { Observable } from 'rxjs';
import { LabResource } from '../../../../lab-core/model/entities/resource/lab-resource.entity';
import {
  LabSelectResourceDialogComponent
} from '../../../../lab-core/entity-module/lab-resource-core/component/lab-select-resource-dialog/lab-select-resource-dialog.component';
import { LabWorkflowEditConfig } from '../../model/lab-workflow-edit-config.class';
import {
  LabSelectCommunityLiveTaskDialogComponent
} from '../../../../lab-core/entity-module/lab-type-core/component/lab-select-community-live-task-dialog/lab-select-community-live-task-dialog.component';
import { LabLiveTask } from '../../../../lab-core/model/entities/lab-live-task.entity';
import {
  LabSelectProtocolTemplateDialogComponent,
  LabSelectProtocolTemplateDialogInput
} from '../../../../lab-core/entity-module/lab-protocol-template-core/component/lab-select-protocol-template-dialog/lab-select-protocol-template-dialog.component';
import { LabProtocolTemplate } from '../../../../lab-core/model/entities/process/lab-protocol-template.entity';

/**
 * Actions button for the workflow
 */
@Component({
  selector: 'lab-workflow-actions',
  templateUrl: './lab-workflow-actions.component.html',
  styleUrls: ['./lab-workflow-actions.component.scss']
})
export class LabWorkflowActionsComponent implements OnInit {
  scenario$: Observable<LabScenario>;

  constructor(private workflowEditState: LabWorkflowEditConfig,
              private dialogService: FlDialogService,
              private scenarioState: LabScenarioDetailPageState) {
  }

  ngOnInit(): void {
    this.scenario$ = this.scenarioState.getScenario$();
  }


  addProcess(): void {
    const data: LabSelectTypeDialogInput = {
      searchConfig: { mode: 'process' }
    };
    this.dialogService.openBigDialog(LabSelectTypeDialogComponent, { data: data }).afterClosed().subscribe(
      processType => this.onSelectTypeClosed(processType)
    );
  }

  private onSelectTypeClosed(processType?: LabTypeEntity): void {
    if (processType) {
      this.workflowEditState.addNode(processType.typingName, processType.name);
    }
  }

  addResource(): void {
    this.dialogService.openBigDialog(LabSelectResourceDialogComponent).afterClosed().subscribe(
      resource => this.onSelectResourceClosed(resource)
    );
  }

  private onSelectResourceClosed(resource?: LabResource): void {
    if (resource) {
      this.workflowEditState.addSource(resource.id, resource.name);
    }
  }

  addProtocolTemplate(): void {
    const data: LabSelectProtocolTemplateDialogInput = {
      rowSelectable: true
    };
    this.dialogService.openBigDialog(LabSelectProtocolTemplateDialogComponent, { data: data }).afterClosed().subscribe(
      protocolTemplate => this.onSelectProtocolTemplateClosed(protocolTemplate)
    );
  }

  private onSelectProtocolTemplateClosed(protocolTemplate?: LabProtocolTemplate): void {
    if (protocolTemplate) {
      this.workflowEditState.addProtocolTemplate(protocolTemplate.id, protocolTemplate.name);
    }
  }

  addCommunityLiveTask(): void {
    this.dialogService.openMediumDialog(LabSelectCommunityLiveTaskDialogComponent).afterClosed().subscribe(
      (liveTaskVersion: LabLiveTask) => {
        if (liveTaskVersion) {
          this.workflowEditState.addCommunityLiveTask(liveTaskVersion.id, liveTaskVersion.title);
        }
      }
    );
  }

  addEmptyProtocol(): void {
    this.workflowEditState.addEmptyProtocol();
  }

  start(): void {
    this.scenarioState.start();
  }

  stopScenario(): void {
    this.scenarioState.stopScenario();
  }
}
