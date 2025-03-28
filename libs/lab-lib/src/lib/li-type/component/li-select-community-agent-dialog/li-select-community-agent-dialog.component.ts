import { Component, OnInit, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiAgent } from '@monorepo/lab-lib/li-core';
import { LiSelectCommunityAgentComponent } from '../li-select-community-agent/li-select-community-agent.component';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog containing the community agent search to select one
 */
@Component({
  selector: 'li-select-community-agent-dialog',
  templateUrl: './li-select-community-agent-dialog.component.html',
  styleUrls: ['./li-select-community-agent-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LiSelectCommunityAgentComponent, TranslatePipe],
})
export class LiSelectCommunityAgentDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectCommunityAgentDialogComponent>>(MatDialogRef);

  title: string = 'biox.select_community_agent';

  onAgentClick(agent: LiAgent): void {
    this.dialogRef.close(agent);
  }
}
