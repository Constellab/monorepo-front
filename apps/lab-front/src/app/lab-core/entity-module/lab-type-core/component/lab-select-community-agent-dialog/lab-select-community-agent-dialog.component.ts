import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LabAgent } from '../../../../model/entities/lab-agent.entity';

/**
 * Dialog containing the community agent search to select one
 */
@Component({
  selector: 'lab-select-community-agent-dialog',
  templateUrl: './lab-select-community-agent-dialog.component.html',
  styleUrls: ['./lab-select-community-agent-dialog.component.scss'],
  standalone: false,
})
export class LabSelectCommunityAgentDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<LabSelectCommunityAgentDialogComponent>>(MatDialogRef);

  title: string = 'biox.select_community_agent';

  ngOnInit(): void {}

  onAgentClick(agent: LabAgent): void {
    this.dialogRef.close(agent);
  }
}
