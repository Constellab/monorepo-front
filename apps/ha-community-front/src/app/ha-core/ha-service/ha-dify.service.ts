import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { HaDifyOptions } from '../ha-model/ha-entities/ha-dify.class';

@Injectable({
  providedIn: 'root',
})
export class HaDifyService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'dify';

  public getKnowledgeBaseList(): Observable<any> {
    return this.apiService.get(`${this.route}/list`);
  }

  public createDocuments(
    knowledgeBaseId: string,
    entityType: string,
    entityId: string,
    options: HaDifyOptions
  ): Observable<boolean> {
    return this.apiService.post(
      `${this.route}/documents/${knowledgeBaseId}/${entityType}/${entityId}`,
      options
    );
  }
}
