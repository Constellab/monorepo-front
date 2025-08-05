import { Component, inject,OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiAgent, LiProtocolService, LiUser } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  LiShareAgentCommunityDialogComponent,
  LiShareAgentCommunityDialogData,
} from '../li-share-agent-community-dialog/li-share-agent-community-dialog.component';

@Component({
  selector: 'li-share-agent-new-version-community-dialog',
  templateUrl: './li-share-agent-new-version-community-dialog.component.html',
  styleUrls: ['./li-share-agent-new-version-community-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, CoCommunityLibModule, MatButton, FlLoaderModule, TranslatePipe],
})
export class LiShareAgentNewVersionCommunityDialogComponent implements OnInit {
  data = inject<LiShareAgentCommunityDialogData>(MAT_DIALOG_DATA);
  private protocolService = inject(LiProtocolService);
  private dialogRef = inject<MatDialogRef<LiShareAgentNewVersionCommunityDialogComponent>>(MatDialogRef);
  private dialogService = inject(FlDialogService);

  title: string = 'li.share_agent_new_version_to_community';
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
    if (this.agentVersionId) {
      this.isLoading = true;
      this.protocolService.getCurrentAgentAndCheckRights(this.agentVersionId).subscribe((agent) => {
        this.currentAgent = agent;
        this.isLoading = false;
      });
    }
  }

  onAddNewVersion(): void {
    this.protocolService.addVersionToCommunityAgent(this.processId, this.currentAgent.id).subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);
      }
    });
  }

  onCreateNewCommunityAgent(): void {
    this.dialogService
      .openMediumDialog(LiShareAgentCommunityDialogComponent, {
        data: {
          processId: this.processId,
          agentVersionId: this.agentVersionId,
        } as LiShareAgentCommunityDialogData,
      })
      .afterClosed()
      .subscribe((res) => {
        this.dialogRef.close(res);
      });
  }
}
