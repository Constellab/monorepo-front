import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HaCliAuthService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'cli-auth';

  public validate(code: string): Observable<void> {
    return this.apiService.put(`${this.route}/validate/${encodeURIComponent(code)}`, {});
  }

  public refuse(code: string): Observable<void> {
    return this.apiService.put(`${this.route}/refuse/${encodeURIComponent(code)}`, {});
  }
}
