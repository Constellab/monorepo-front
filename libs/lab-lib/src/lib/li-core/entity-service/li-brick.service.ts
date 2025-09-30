import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { LiBrickEntity, LiBrickMigration } from '../model/entities/li-brick.entity';

@Injectable({ providedIn: 'root' })
export class LiBrickService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'brick';

  public getAllBricks(): Observable<LiBrickEntity[]> {
    return this.apiService.get(this.route, LiBrickEntity);
  }

  public getBrick(brickName: string): Observable<LiBrickEntity | null> {
    return this.apiService.get(`${this.route}/${brickName}`, LiBrickEntity);
  }

  public generateTechnicalDoc(brickName: string): Observable<Blob> {
    return this.apiService.downloadFilePost(
      `${this.route}/${brickName}/technical-doc`,
      null,
      brickName + '_technical_doc.json'
    );
  }

  public getBrickMigrations(brickName: string): Observable<LiBrickMigration[]> {
    return this.apiService.get(`${this.route}/${brickName}/migrations`, LiBrickMigration);
  }

  public callMigration(brickName: string, version: string, dbUniqueName: string): Observable<void> {
    return this.apiService.post(`${this.route}/${brickName}/call-migration/${version}/${dbUniqueName}`, null);
  }
}
