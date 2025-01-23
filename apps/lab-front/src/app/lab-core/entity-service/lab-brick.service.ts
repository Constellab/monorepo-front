import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabBrickEntity, LabBrickMigration } from '../model/entities/lab-brick.entity';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';

@Injectable({ providedIn: 'root' })
export class LabBrickService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'brick';

  public getAllBricks(): Observable<LabBrickEntity[]> {
    return this.apiService.get(this.route, LabBrickEntity);
  }

  public getBrick(brickName: string): Observable<LabBrickEntity | null> {
    return this.apiService.get(`${this.route}/${brickName}`, LabBrickEntity);
  }

  public generateTechnicalDoc(brickName: string): Observable<Blob> {
    return this.apiService.downloadFilePost(
      `${this.route}/${brickName}/technical-doc`,
      null,
      brickName + '_technical_doc.json'
    );
  }

  public getBrickMigrations(brickName: string): Observable<LabBrickMigration[]> {
    return this.apiService.get(`${this.route}/${brickName}/migrations`, LabBrickMigration);
  }

  public callMigration(brickName: string, version: string): Observable<void> {
    return this.apiService.post(`${this.route}/${brickName}/call-migration/${version}`, null);
  }
}
