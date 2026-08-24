import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

import { HaMcpInstall } from '../../../ha-core/ha-model/ha-entities/ha-mcp-install.class';
import { HaMcpService } from '../../../ha-core/ha-service/ha-mcp.service';
import { HaClaudeMcpCommandComponent } from '../ha-claude-mcp-command/ha-claude-mcp-command.component';

/**
 * Show the commands that connect Claude Code to Community.
 * Nothing here is editable: the steps and the urls are built by the back-end for this environment.
 */
@Component({
  selector: 'ha-claude-mcp-card',
  templateUrl: './ha-claude-mcp-card.component.html',
  styleUrls: ['./ha-claude-mcp-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlKeyValueModule,
    FlLoaderModule,
    HaClaudeMcpCommandComponent,
    MatExpansionModule,
    TranslatePipe,
  ],
})
export class HaClaudeMcpCardComponent implements OnInit {
  private mcpService = inject(HaMcpService);

  install = signal<HaMcpInstall | null>(null);

  isLoading = signal<boolean>(true);

  hasError = signal<boolean>(false);

  ngOnInit(): void {
    // called once, the values only change with the deployment
    this.mcpService.getInstallInfo().subscribe({
      next: (install) => {
        this.install.set(install);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}
