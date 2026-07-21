import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiAgent, LiResource, LiScenario, LiScenarioTemplate, LiTypeEntity } from '@monorepo/lab-lib/li-core';
import { LiSelectResourceDialogComponent } from '@monorepo/lab-lib/li-resource';
import {
  LiSelectScenarioTemplateDialogComponent,
  LiSelectScenarioTemplateDialogInput,
} from '@monorepo/lab-lib/li-scenario-template';
import {
  LiSelectCommunityAgentDialogComponent,
  LiSelectTypeDialogComponent,
  LiSelectTypeDialogInput,
} from '@monorepo/lab-lib/li-type';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LabWorkflowEditConfig } from '../../model/lab-workflow-edit-config.class';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';

/**
 * Actions button for the workflow
 */
@Component({
  selector: 'lab-workflow-actions',
  templateUrl: './lab-workflow-actions.component.html',
  styleUrls: ['./lab-workflow-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatButton,
    MatMenuTrigger,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatMenu,
    MatMenuItem,
    FlIconModule,
    MatDivider,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LabWorkflowActionsComponent implements OnInit {
  private workflowEditState = inject(LabWorkflowEditConfig);
  private dialogService = inject(FlDialogService);
  private scenarioState = inject(LabScenarioDetailPageState);

  scenario$: Observable<LiScenario>;

  ngOnInit(): void {
    this.scenario$ = this.scenarioState.getScenario$();
  }

  addProcess(): void {
    const data: LiSelectTypeDialogInput = {
      searchConfig: { mode: 'process' },
    };
    this.dialogService
      .openBigDialog(LiSelectTypeDialogComponent, { data: data })
      .afterClosed()
      .subscribe((processType) => this.onSelectTypeClosed(processType));
  }

  private onSelectTypeClosed(processType?: LiTypeEntity): void {
    if (processType) {
      this.workflowEditState.addNode(processType.typingName, processType.name);
    }
  }

  addResource(): void {
    this.dialogService
      .openBigDialog(LiSelectResourceDialogComponent)
      .afterClosed()
      .subscribe((resource) => this.onSelectResourceClosed(resource));
  }

  private onSelectResourceClosed(resource?: LiResource): void {
    if (resource) {
      this.workflowEditState.addSource(resource.id, resource.name);
    }
  }

  addScenarioTemplate(): void {
    const data: LiSelectScenarioTemplateDialogInput = {
      rowSelectable: true,
    };
    this.dialogService
      .openBigDialog(LiSelectScenarioTemplateDialogComponent, { data: data })
      .afterClosed()
      .subscribe((scenarioTemplate) => this.onSelectScenarioTemplateClosed(scenarioTemplate));
  }

  private onSelectScenarioTemplateClosed(scenarioTemplate?: LiScenarioTemplate): void {
    if (scenarioTemplate) {
      this.workflowEditState.addScenarioTemplate(scenarioTemplate.id, scenarioTemplate.name);
    }
  }

  addCommunityAgent(): void {
    this.dialogService
      .openMediumDialog(LiSelectCommunityAgentDialogComponent)
      .afterClosed()
      .subscribe((agentVersion: LiAgent) => {
        if (agentVersion) {
          this.workflowEditState.addCommunityAgent(agentVersion.id, agentVersion.title);
        }
      });
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
