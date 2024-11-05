import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { HaProfileEditDialogFormData } from '../../ha-profile/component/ha-profile-edit-dialog/ha-profile-edit-dialog.component';
import { CoUser } from '@monorepo/community-lib';

@Injectable({
  providedIn: 'root',
})
export class HaUserService {
  private readonly route: string = 'user';

  constructor(private apiService: FlApiService) {}

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
