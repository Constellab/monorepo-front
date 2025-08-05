import { inject, Injectable } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { CaHierarchyObject } from '../model/entities/folder/ca-hierarchy-object.class';
import {
  CaHierarchyObjectToken,
  CaHierarchyObjectTokenSaveDTO,
} from '../model/entities/folder/ca-hierarchy-object-token.class';

@Injectable({
  providedIn: 'root',
})
export class CaHierarchyObjectTokenService {
  private readonly route = 'hierarchy-object-tokens';
  private apiService = inject(FlApiService);

  public getHierarchyObjectByToken(token: string): Observable<CaHierarchyObject> {
    return this.apiService.get(`${this.route}/token/${token}`, CaHierarchyObject);
  }

  public createToken(
    hierarchyObjectId: string,
    saveDTO: CaHierarchyObjectTokenSaveDTO
  ): Observable<CaHierarchyObjectToken> {
    return this.apiService.post(`${this.route}/${hierarchyObjectId}`, saveDTO, CaHierarchyObjectToken, {
      serialization: CaHierarchyObjectTokenSaveDTO,
    });
  }

  public updateToken(
    tokenId: string,
    saveDTO: CaHierarchyObjectTokenSaveDTO
  ): Observable<CaHierarchyObjectToken> {
    return this.apiService.put(`${this.route}/${tokenId}`, saveDTO, CaHierarchyObjectToken, {
      serialization: CaHierarchyObjectTokenSaveDTO,
    });
  }

  public deleteToken(accessTokenId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${accessTokenId}`);
  }

  public findByHierarchyObjectId(
    hierarchyObjectId: string,
    page: number,
    size: number
  ): Observable<ClPageI<CaHierarchyObjectToken>> {
    return this.apiService.get(
      `${this.route}/hierarchy-object/${hierarchyObjectId}`,
      CaHierarchyObjectToken,
      { resultIsPaginated: true, page: page, pageSize: size }
    );
  }
}
