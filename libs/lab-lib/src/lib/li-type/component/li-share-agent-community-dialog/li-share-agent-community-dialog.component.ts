import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlConfirmDialogInput, FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import {
  LiAgent,
  LiAuthenticatedUserService,
  LiCreateCommunityAgentVersionResDto,
  LiProtocolService,
  LiUser,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  LiCreateAgentCommunityDialogData,
  LiCreateCommunityAgentDialogComponent,
  LiCreateCommunityAgentDialogMode,
} from '../li-create-community-agent-dialog/li-create-community-agent-dialog.component';
import { LiSelectCommunityAgentComponent } from '../li-select-community-agent/li-select-community-agent.component';

export interface LiShareAgentCommunityDialogData {
  processId: string;
  agentVersionId: string;
}

@Component({
  selector: 'li-share-agent-community-dialog',
  templateUrl: './li-share-agent-community-dialog.component.html',
  styleUrls: ['./li-share-agent-community-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    CoCommunityLibModule,
    MatDivider,
    MatButton,
    MatIcon,
    NgClass,
    LiSelectCommunityAgentComponent,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class LiShareAgentCommunityDialogComponent implements OnInit {
  data = inject<LiShareAgentCommunityDialogData>(MAT_DIALOG_DATA);
  private protocolService = inject(LiProtocolService);
  private dialogRef = inject<MatDialogRef<LiShareAgentCommunityDialogComponent>>(MatDialogRef);
  private authUserService = inject(LiAuthenticatedUserService);
  private dialogService = inject(FlDialogService);
  private translateService = inject(FlTranslateService);

  title: string = 'li.share_agent_to_community';
  processId: string;
  agentVersionId: string;
  currentAgent: LiAgent;
  currentUser: LiUser;
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

  openAddVersionConfirmDialog(agent?: LiAgent): void {
    if (!this.currentAgent && !agent) return;
    const content = this.translateService.translate('li.add_version_to_community_agent_content', {
      param: { agentTitle: agent != null ? agent.title : this.currentAgent.title },
    });
    const input: FlConfirmDialogInput = {
      title: this.translateService.translate('li.add_version_to_community_agent'),
      content: content,
      successMessage: 'li.add_version_to_community_agent_success',
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
    let mode: LiCreateCommunityAgentDialogMode;
    if (agentVersionId) {
      mode = LiCreateCommunityAgentDialogMode.FORK;
    } else {
      mode = LiCreateCommunityAgentDialogMode.CREATE;
    }
    this.dialogService
      .openSmallDialog(LiCreateCommunityAgentDialogComponent, {
        data: {
          processId: this.processId,
          mode: mode,
          agentVersionId: this.agentVersionId,
        } as LiCreateAgentCommunityDialogData,
      })
      .afterClosed()
      .subscribe((res: LiCreateCommunityAgentVersionResDto) => {
        if (res) {
          this.dialogRef.close(res);
        }
      });
  }
}
