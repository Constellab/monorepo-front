import { Injectable, inject } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LabTaskGeneratorService {
  private apiService = inject(FlApiService);

  private readonly route = 'task-generator';

  /**
   * Specific route for the agent to generate the task code form the agent code
   * @param agentId
   */
  public generateTaskCodeFromAgent(agentId: string): Observable<Blob> {
    return this.apiService.downloadFilePost(`${this.route}/from-agent/${agentId}`, null, 'task.py');
  }

  /**
   * Specific route for the agent to generate the agent file
   * @param protocolId
   * @param agentId
   */
  public generateAgentFile(protocolId: string, agentId: string): Observable<Blob> {
    return this.apiService.downloadFilePost(`${this.route}/agent-file/${agentId}`, null, 'agent_file.json');
  }
}
