import { inject, Injectable } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { CaUser } from '../model/entities/ca-user.class';
import {
  CaSpaceInvit,
  CaSpaceInvitCreateDTO,
  CaSpaceInvitDatasource,
  CaSpaceInvitReadDTO,
} from '../model/entities/space/ca-space-invit.class';

@Injectable({
  providedIn: 'root',
})
export class CaSpaceInvitService {
  private apiService = inject(FlApiService);

  private readonly route = 'space-invit';

  public getInvitationByCode(code: string): Observable<CaSpaceInvitReadDTO> {
    return this.apiService.get(`${this.route}/code/${code}`, CaSpaceInvitReadDTO);
  }

  public acceptInvitationExistingUser(code: string): Observable<CaUser> {
    return this.apiService.post(`${this.route}/code/${code}/accept`, null, CaUser);
  }

  public createInvitation(spaceId: string, invitDto: CaSpaceInvitCreateDTO): Observable<CaSpaceInvit> {
    return this.apiService.post(`${this.route}/${spaceId}`, invitDto, CaSpaceInvit);
  }

  public resendInvitation(invitId: string): Observable<void> {
    return this.apiService.put(`${this.route}/${invitId}/resend`, null);
  }

  public refreshInvitationValidUntil(invitId: string): Observable<CaSpaceInvit> {
    return this.apiService.put(`${this.route}/${invitId}/refresh-validity`, null, CaSpaceInvit);
  }

  public updateInvitationRole(invitId: string, role: string): Observable<CaSpaceInvit> {
    return this.apiService.put(`${this.route}/${invitId}/role/${role}`, null, CaSpaceInvit);
  }

  public deleteInvitation(invitId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${invitId}`);
  }

  public getInvitationsDatasource(spaceId: string): CaSpaceInvitDatasource {
    return new FlEntityPaginatedDatasource((page, size) => this.getInvitations(spaceId, page, size), 20);
  }

  public getInvitations(spaceId: string, page: number, pageSize: number): Observable<ClPageI<CaSpaceInvit>> {
    return this.apiService.get(`${this.route}/space/${spaceId}`, CaSpaceInvit, {
      resultIsPaginated: true,
      page: page,
      pageSize: pageSize,
    });
  }
}
