import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaMcpInstall } from '../../../ca-core/model/entities/ca-mcp-install.class';
import { CaMcpService } from '../../../ca-core/service-api/ca-mcp.service';
import { CaClaudeMcpCommandComponent } from '../ca-claude-mcp-command/ca-claude-mcp-command.component';

/**
 * Show the commands that connect Claude Code to this Space.
 * Nothing here is editable: the steps and the urls are built by the back-end for this environment.
 */
@Component({
  selector: 'ca-claude-mcp-card',
  templateUrl: './ca-claude-mcp-card.component.html',
  styleUrl: './ca-claude-mcp-card.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CaClaudeMcpCommandComponent,
    FlCardModule,
    FlKeyValueModule,
    FlSectionModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    TranslatePipe,
  ],
})
export class CaClaudeMcpCardComponent {
  // called once when the card opens, the values only change with the deployment
  install$: Observable<CaMcpInstall> = inject(CaMcpService).getInstallInfo();
}
