import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { LabProtocolService } from '../../../../entity-service/lab-protocol.service';
import { LabAgent, LabCreateCommunityAgentVersionResDto } from '../../../../model/entities/lab-agent.entity';
import {
  LabCreateCommunityAgentDialogComponent,
  LabCreateCommunityAgentDialogMode,
} from '../lab-create-community-agent-dialog/lab-create-community-agent-dialog.component';
import { FlConfirmDialogInput, FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { LabAuthenticatedUserService } from '../../../../service/lab-authenticated-user.service';
import { LabUser } from '../../../../model/entities/lab-user.entity';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { LabSelectCommunityAgentComponent } from '../lab-select-community-agent/lab-select-community-agent.component';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabShareAgentCommunityDialogData {
  processId: string;
  agentVersionId: string;
}

@Component({
  selector: 'lab-share-agent-community-dialog',
  templateUrl: './lab-share-agent-community-dialog.component.html',
  styleUrls: ['./lab-share-agent-community-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    CoCommunityLibModule,
    MatDivider,
    MatButton,
    MatIcon,
    NgClass,
    LabSelectCommunityAgentComponent,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class LabShareAgentCommunityDialogComponent implements OnInit {
  data = inject<LabShareAgentCommunityDialogData>(MAT_DIALOG_DATA);
  private protocolService = inject(LabProtocolService);
  private dialogRef = inject<MatDialogRef<LabShareAgentCommunityDialogComponent>>(MatDialogRef);
  private authUserService = inject(LabAuthenticatedUserService);
  private dialogService = inject(FlDialogService);
  private translateService = inject(FlTranslateService);

  title: string = 'biox.share_agent_to_community';
  processId: string;
  agentVersionId: string;
  currentAgent: LabAgent;
  currentUser: LabUser;
  isLoading: boolean = false;

  constructor() {
    const data = this.data;
    this.processId = data.processId;
    this.agentVersionId = data.agentVersionId;
  }

  ngOnInit(): void {
    this.currentUser = this.authUserService.getCurrentUser();
    if (this.agentVersionId) {
      this.isLoading = true;
      this.protocolService.getCurrentAgent(this.agentVersionId).subscribe((agent) => {
        this.currentAgent = agent;
        this.isLoading = false;
      });
    }
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

  openCreateCommunityAgentDialog(agentVersionId?: string): void {
    let mode: LabCreateCommunityAgentDialogMode;
    if (agentVersionId) {
      mode = LabCreateCommunityAgentDialogMode.FORK;
    } else {
      mode = LabCreateCommunityAgentDialogMode.CREATE;
    }
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
