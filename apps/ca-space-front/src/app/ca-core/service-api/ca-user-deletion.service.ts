import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaUserDeletionService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'user-deletion';

  public deleteUser(userId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${userId}`);
  }
}
