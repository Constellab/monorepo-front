import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LabTaskGeneratorService {

  private readonly route = 'task-generator';

  constructor(private apiService: FlApiService) {
  }

  /**
   * Specific route for the agent to generate the task code form the agent code
   * @param agentId
   */
  public generateTaskCodeFromAgent(agentId: string): Observable<Blob> {
    return this.apiService.downloadFilePost(`${this.route}/from-agent/${agentId}`, null,
      'task.py');
  }

  /**
   * Specific route for the agent to generate the agent file
   * @param protocolId
   * @param agentId
   */
  public generateAgentFile(protocolId: string, agentId: string): Observable<Blob> {
    return this.apiService.downloadFilePost(`${this.route}/agent-file/${protocolId}/${agentId}`, null,
      'agent_file.json');
  }
}
