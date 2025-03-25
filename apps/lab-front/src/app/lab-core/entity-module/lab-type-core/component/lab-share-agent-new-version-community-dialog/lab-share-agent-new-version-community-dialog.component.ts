import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { LabProtocolService } from '../../../../entity-service/lab-protocol.service';
import { LabAgent } from '../../../../model/entities/lab-agent.entity';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LabUser } from '../../../../model/entities/lab-user.entity';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LabShareAgentCommunityDialogComponent,
  LabShareAgentCommunityDialogData,
} from '../lab-share-agent-community-dialog/lab-share-agent-community-dialog.component';

@Component({
  selector: 'lab-share-agent-new-version-community-dialog',
  templateUrl: './lab-share-agent-new-version-community-dialog.component.html',
  styleUrls: ['./lab-share-agent-new-version-community-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, CoCommunityLibModule, MatButton, FlLoaderModule, TranslatePipe],
})
export class LabShareAgentNewVersionCommunityDialogComponent implements OnInit {
  data = inject<LabShareAgentCommunityDialogData>(MAT_DIALOG_DATA);
  private protocolService = inject(LabProtocolService);
  private dialogRef = inject<MatDialogRef<LabShareAgentNewVersionCommunityDialogComponent>>(MatDialogRef);
  private dialogService = inject(FlDialogService);

  title: string = 'biox.share_agent_new_version_to_community';
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
      .openMediumDialog(LabShareAgentCommunityDialogComponent, {
        data: {
          processId: this.processId,
          agentVersionId: this.agentVersionId,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        this.dialogRef.close(res);
      });
  }
}
