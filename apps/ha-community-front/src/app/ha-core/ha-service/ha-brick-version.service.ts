import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { HaBrickVersion, HaBrickVersionDataSource } from '../ha-model/ha-entities/ha-brick-version.class';
import { Observable } from 'rxjs';
import { ClPageI } from '@monorepo/core-lib';
import { HaReferenceDTO } from '../ha-model/ha-entities/ha-version.class';

@Injectable({
  providedIn: 'root',
})
export class HaBrickVersionService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'brick-version';

  public getAllFromBrick(
    page: number,
    pageSize: number,
    brickId: string
  ): Observable<ClPageI<HaBrickVersion>> {
    return this.apiService.get(`${this.route}/current/${brickId}`, HaBrickVersion, {
      resultIsPaginated: true,
      page: page,
      pageSize: pageSize,
    });
  }

  public getDataSource(brickId: string): HaBrickVersionDataSource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.getAllFromBrick(page, pageSize, brickId),
      20
    );
  }

  public sendAllBrickVersion(): Observable<void> {
    return this.apiService.put(`${this.route}/send-all-to-queue`, {});
  }

  public getAllReferences(id: string): Observable<HaReferenceDTO[]> {
    return this.apiService.getById(`${this.route}/references`, id);
  }

  public getDirectReferences(id: string): Observable<HaReferenceDTO[]> {
    return this.apiService.getById(`${this.route}/direct-references`, id);
  }
}
