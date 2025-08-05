import { inject,Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { LiProgressBarMessages } from '../model/entities/li-progress-bar.entity';

@Injectable({
  providedIn: 'root',
})
export class LiProgressBarService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'progress-bar';

  public getDownloadProgressBarUrl(id: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${id}/download`);
  }

  public getProgressBarMessages(
    id: string,
    nbOfMessages: number,
    fromDatetime?: DateTime
  ): Observable<LiProgressBarMessages> {
    const route = fromDatetime
      ? `${this.route}/${id}/messages/${fromDatetime}`
      : `${this.route}/${id}/messages`;
    return this.apiService.get(route, LiProgressBarMessages, {
      params: { nb_of_messages: nbOfMessages.toString() },
    });
  }
}
