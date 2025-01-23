import { Injectable, inject } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
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
}
