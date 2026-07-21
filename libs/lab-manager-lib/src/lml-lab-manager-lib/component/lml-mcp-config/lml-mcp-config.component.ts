import { Component, inject, OnInit, signal } from '@angular/core';

import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { LmlMcpConfigDTO } from '../../model/lml-lab-manager.class';

/**
 * Enable/disable the MCP server on the lab.
 *
 * The MCP flag is stored as a custom env var on the backend; here it is surfaced as a
 * friendly toggle. Changes save immediately (no save button) but only take effect
 * after the lab is restarted -- hence the hint.
 */
@Component({
  selector: 'lml-mcp-config',
  templateUrl: './lml-mcp-config.component.html',
  styleUrls: ['./lml-mcp-config.component.scss'],
  standalone: false,
})
export class LmlMcpConfigComponent implements OnInit {
  readonly enabled = signal(false);
  readonly getIsLoading = signal(true);
  readonly saveIsLoading = signal(false);

  private managerApiService = inject(LmlLabManagerService);
  private managerState = inject(LmlLabManagerState);

  ngOnInit(): void {
    this.managerApiService.getMcpConfig().subscribe({
      next: (config) => this.getSuccess(config),
      error: () => this.getIsLoading.set(false),
    });
  }

  private getSuccess(config: LmlMcpConfigDTO): void {
    this.enabled.set(config.enabled);
    this.getIsLoading.set(false);
  }

  onToggle(enabled: boolean): void {
    this.enabled.set(enabled);
    this.saveIsLoading.set(true);
    this.managerApiService.updateMcpConfig({ enabled }).subscribe({
      next: () => this.saveSuccess(),
      // Revert the toggle if the save failed (the API error is already surfaced).
      error: () => {
        this.enabled.set(!enabled);
        this.saveIsLoading.set(false);
      },
    });
  }

  private saveSuccess(): void {
    this.saveIsLoading.set(false);
    this.managerState.onConfigSavedNeedsRestart({
      text: 'lml.mcp_config_updated',
      translateText: true,
    });
  }
}
