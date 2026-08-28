import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { CaMcpInstall } from '../model/entities/ca-mcp-install.class';

/**
 * Service to get the Claude Code plugin exposing this Space over MCP.
 */
@Injectable({
  providedIn: 'root',
})
export class CaMcpService {
  private apiService = inject(FlApiService);

  private readonly route = 'mcp';

  /**
   * Public and idempotent, the values only change with the deployment: call it once, never poll.
   */
  public getInstallInfo(): Observable<CaMcpInstall> {
    return this.apiService.get(`${this.route}/install`, CaMcpInstall);
  }
}
