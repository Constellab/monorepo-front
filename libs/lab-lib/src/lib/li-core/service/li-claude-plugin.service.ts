import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { LiClaudePluginInfo } from '../model/global/li-claude-plugin.class';

/**
 * Service to get the Claude Code plugin served by this lab.
 */
@Injectable({
  providedIn: 'root',
})
export class LiClaudePluginService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'claude-plugin';

  /**
   * Cheap and idempotent, the values only change when the lab restarts: call it once, never poll.
   */
  public getPluginInfo(): Observable<LiClaudePluginInfo> {
    return this.apiService.get(this.route, LiClaudePluginInfo);
  }
}
