import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabProtocolService } from '../../../../entity-service/lab-protocol.service';
import { LabAgent, LabCreateCommunityAgentVersionResDto } from '../../../../model/entities/lab-agent.entity';
import {
  LabCreateCommunityAgentDialogComponent,
  LabCreateCommunityAgentDialogMode,
} from '../lab-create-community-agent-dialog/lab-create-community-agent-dialog.component';
import { FlConfirmDialogInput, FlDialogService, FlTranslateService } from '@monorepo/front-core-lib';
import { LabAuthenticatedUserService } from '../../../../service/lab-authenticated-user.service';
import { LabUser } from '../../../../model/entities/lab-user.entity';

export interface LabShareAgentCommunityDialogData {
  processId: string;
  agentVersionId: string;
}

@Component({
  selector: 'lab-share-agent-community-dialog',
  templateUrl: './lab-share-agent-community-dialog.component.html',
  styleUrls: ['./lab-share-agent-community-dialog.component.scss'],
})
export class LabShareAgentCommunityDialogComponent implements OnInit {
  title: string = 'biox.share_agent_to_community';
  processId: string;
  agentVersionId: string;
  currentAgent: LabAgent;
  currentUser: LabUser;
  isLoading: boolean = false;
  protected readonly labCreateCommunityAgentDialogMode = LabCreateCommunityAgentDialogMode;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: LabShareAgentCommunityDialogData,
    private protocolService: LabProtocolService,
    private dialogRef: MatDialogRef<LabShareAgentCommunityDialogComponent>,
    private authUserService: LabAuthenticatedUserService,
    private dialogService: FlDialogService,
    private translateService: FlTranslateService
  ) {
    this.processId = data.processId;
    this.agentVersionId = data.agentVersionId;
  }

  ngOnInit(): void {
    if (this.agentVersionId) {
      this.isLoading = true;
      this.protocolService.getCurrentAgent(this.agentVersionId).subscribe((agent) => {
        this.currentAgent = agent;
        this.isLoading = false;
      });
    }
    this.currentUser = this.authUserService.getCurrentUser();
  }

  onSelectAgent(agent: LabAgent): void {
    this.openAddVersionConfirmDialog(agent);
  }

  openAddVersionConfirmDialog(agent?: LabAgent): void {
    if (!this.currentAgent && !agent) return;
    const content = this.translateService.translate('biox.add_version_to_community_agent_content', {
      param: { agentTitle: agent != null ? agent.title : this.currentAgent.title },
    });
    const input: FlConfirmDialogInput = {
      title: this.translateService.translate('biox.add_version_to_community_agent'),
      content: content,
      successMessage: 'biox.add_version_to_community_agent_success',
      observable: this.protocolService.addVersionToCommunityAgent(
        this.processId,
        agent != null ? agent.id : this.currentAgent.id
      ),
    };
    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => {
        if (res && res.result) {
          this.dialogRef.close(res.result);
        }
      });
  }

  openCreateCommunityAgentDialog(mode: LabCreateCommunityAgentDialogMode): void {
    this.dialogService
      .openSmallDialog(LabCreateCommunityAgentDialogComponent, {
        data: {
          processId: this.processId,
          mode: mode,
          agentVersionId: this.agentVersionId,
        },
      })
      .afterClosed()
      .subscribe((res: LabCreateCommunityAgentVersionResDto) => {
        if (res) {
          this.dialogRef.close(res);
        }
      });
  }
}
