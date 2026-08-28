import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { HaMcpInstall } from '../ha-model/ha-entities/ha-mcp-install.class';

/**
 * Service to get the Claude Code plugin exposing Community over MCP.
 */
@Injectable({
  providedIn: 'root',
})
export class HaMcpService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'mcp';

  /**
   * Public and idempotent, the values only change with the deployment: call it once, never poll.
   */
  public getInstallInfo(): Observable<HaMcpInstall> {
    return this.apiService.get(`${this.route}/install`, HaMcpInstall);
  }
}
