import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CaScenario } from '../model/entities/folder/ca-scenario.class';
import { FlApiService } from '@monorepo/front-core-lib';
import { CaTechnicalReport } from '../model/entities/folder/ca-technical-report.class';
import { CaLabConfig } from '../model/entities/lab/ca-lab-config.class';

@Injectable({
  providedIn: 'root',
})
export class CaScenarioService {
  private readonly route: string = 'scenarios';

  constructor(private apiService: FlApiService) {}

  public findById(id: string): Observable<CaScenario> {
    return this.apiService.get(`${this.route}/${id}`, CaScenario);
  }

  public getScenariosByNote(noteId: string): Observable<CaScenario[]> {
    return this.apiService.get(`${this.route}/note/${noteId}`, CaScenario);
  }

  public update(scenario: Partial<CaScenario>): Observable<CaScenario> {
    return this.apiService.put(`${this.route}`, scenario, CaScenario);
  }

  public getScenarioTechnicalReport(scenarioId: string): Observable<CaTechnicalReport> {
    return this.apiService.get(`${this.route}/${scenarioId}/technical-report`, CaTechnicalReport);
  }

  public getScenarioLabConfig(scenarioId: string): Observable<CaLabConfig> {
    return this.apiService.get(`${this.route}/${scenarioId}/lab-config`, CaLabConfig);
  }
}
