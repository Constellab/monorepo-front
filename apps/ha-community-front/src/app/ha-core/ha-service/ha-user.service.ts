import { inject, Injectable } from '@angular/core';
import { CoUser } from '@monorepo/community-lib';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { HaProfileEditDialogFormData } from '../../ha-profile/component/ha-profile-edit-dialog/ha-profile-edit-dialog.component';
import { HaUser, HaUserSearchFilter } from '../ha-model/ha-entities/ha-user';

@Injectable({
  providedIn: 'root',
})
export class HaUserService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'user';

  getCount(): Observable<number> {
    return this.apiService.get(`${this.route}/count`);
  }

  getUserById(id: string): Observable<CoUser> {
    return this.apiService.get(`${this.route}/${id}`);
  }

  editUser(formData: HaProfileEditDialogFormData): Observable<CoUser> {
    return this.apiService.put(`${this.route}/edit`, formData);
  }

  searchUser(filters: HaUserSearchFilter, page: number, pageSize: number): Observable<ClPageI<HaUser>> {
    return this.apiService.post(`${this.route}/search`, filters, HaUser, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }
}
