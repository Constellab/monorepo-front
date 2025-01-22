import { Injectable, inject } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { CaCountry } from '../model/entities/ca-country.entity';

@Injectable({
  providedIn: 'root',
})
export class CaCountryService {
  private apiService = inject(FlApiService);

  private readonly route = 'country';

  public get(): Observable<CaCountry[]> {
    return this.apiService.get(`${this.route}`, CaCountry);
  }
}
