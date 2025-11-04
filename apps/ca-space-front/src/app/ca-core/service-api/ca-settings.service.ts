import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { CnConstellabSuiteDTO, CnRequestAppDTO } from '../model/entities/ca-constellab-suite.class';
import { CaServerDecisionTreeDTO, CaYoutubeVideo } from '../model/entities/server/ca-server-standard.class';

@Injectable({ providedIn: 'root' })
export class CaSettingsService {
  private apiService = inject(FlApiService);

  private readonly route = 'settings';

  public getDecisionTree(): Observable<CaServerDecisionTreeDTO> {
    return this.apiService.get(`${this.route}/server-decision-tree`, CaServerDecisionTreeDTO);
  }

  public uploadDecisionTree(decisionTree: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', decisionTree);
    return this.apiService.put(`${this.route}/server-decision-tree`, formData);
  }

  public getTutorialVideos(): Observable<CaYoutubeVideo[]> {
    return this.apiService.get(`${this.route}/tutorial-videos`, CaYoutubeVideo);
  }

  public getConstellabSuite(): Observable<CnConstellabSuiteDTO> {
    return this.apiService.get(`${this.route}/constellab-suite`, CnConstellabSuiteDTO);
  }

  public uploadConstellabSuite(constellabSuite: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', constellabSuite);
    return this.apiService.put(`${this.route}/constellab-suite`, formData);
  }

  public requestApp(requestAppDto: CnRequestAppDTO): Observable<void> {
    return this.apiService.post(`${this.route}/request-app`, requestAppDto);
  }
}
