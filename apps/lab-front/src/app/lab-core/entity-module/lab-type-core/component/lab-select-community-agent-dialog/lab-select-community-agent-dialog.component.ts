import { Component, inject, OnInit } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { LabAgent } from '../../../../model/entities/lab-agent.entity';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import {
  LabSelectCommunityAgentComponent,
} from '../lab-select-community-agent/lab-select-community-agent.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog containing the community agent search to select one
 */
@Component({
  selector: 'lab-select-community-agent-dialog',
  templateUrl: './lab-select-community-agent-dialog.component.html',
  styleUrls: ['./lab-select-community-agent-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LabSelectCommunityAgentComponent, TranslatePipe],
})
export class LabSelectCommunityAgentDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<LabSelectCommunityAgentDialogComponent>>(MatDialogRef);

  title: string = 'biox.select_community_agent';

  ngOnInit(): void {}

  onAgentClick(agent: LabAgent): void {
    this.dialogRef.close(agent);
  }
}
