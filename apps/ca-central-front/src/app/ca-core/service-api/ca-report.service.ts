import { Injectable } from '@angular/core';
import { CaReport, CaResourceView } from '../model/entities/project/ca-report.class';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { TeRichTextContent } from '@monorepo/text-editor';

@Injectable({
  providedIn: 'root'
})
export class CaReportService {

  private readonly route: string = 'reports';

  constructor(private apiService: FlApiService) {
  }

  getReportsByExperiment(experimentId: string): Observable<CaReport[]> {
    return this.apiService.get(`${this.route}/experiment/${experimentId}`, CaReport);
  }

  getById(id: string): Observable<CaReport> {
    return this.apiService.getById(this.route, id, CaReport);
  }

  getContent(reportId: string): Observable<TeRichTextContent> {
    return this.apiService.get(`${this.route}/${reportId}/content`);
  }

  deleteReport(reportId: string): Observable<void>{
    return this.apiService.delete(`${this.route}/${reportId}`);
  }

  ////////////////////////////// METHOD FOR TEXT EDITOR //////////////////////////

  getFileUrl(reportId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${reportId}/file/${filename}`);
  }

  getView(reportId: string, viewId: string): Observable<CaResourceView> {
    return this.apiService.get(`${this.route}/${reportId}/view/${viewId}`, CaResourceView);
  }

}
