import { inject, Injectable } from '@angular/core';
import { CoIcon } from '@monorepo/community-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { HaIconCreateDto } from '../ha-model/ha-entities/ha-icon.class';

@Injectable({
  providedIn: 'root',
})
export class HaIconService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'icon';

  public getById(id: string): Observable<CoIcon> {
    return this.apiService.getById(this.route, id, CoIcon);
  }

  public create(icon: HaIconCreateDto, file: File): Observable<CoIcon> {
    const formData = new FormData();
    formData.append('icon', JSON.stringify(icon));
    formData.append('file', file);
    return this.apiService.post(this.route, formData);
  }

  public update(icon: HaIconCreateDto, file: File): Observable<CoIcon> {
    const formData = new FormData();
    formData.append('icon', JSON.stringify(icon));
    formData.append('file', file);
    return this.apiService.put(this.route, formData);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.delete(this.route + '/' + id);
  }
}
