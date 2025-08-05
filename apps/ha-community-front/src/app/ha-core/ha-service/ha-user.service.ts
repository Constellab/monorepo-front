import { inject,Injectable } from '@angular/core';
import { CoUser } from '@monorepo/community-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { HaProfileEditDialogFormData } from '../../ha-profile/component/ha-profile-edit-dialog/ha-profile-edit-dialog.component';

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
}
