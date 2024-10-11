import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LabAgent } from '../../../../model/entities/lab-agent.entity';

/**
 * Dialog containing the community agent search to select one
 */
@Component({
  selector: 'lab-select-community-agent-dialog',
  templateUrl: './lab-select-community-agent-dialog.component.html',
  styleUrls: ['./lab-select-community-agent-dialog.component.scss']
})
export class LabSelectCommunityAgentDialogComponent implements OnInit {

  title: string = 'biox.select_community_agent';

  constructor(private dialogRef: MatDialogRef<LabSelectCommunityAgentDialogComponent>,) {
  }

  ngOnInit(): void {
  }

  onAgentClick(agent: LabAgent): void {
    this.dialogRef.close(agent);
  }
}
