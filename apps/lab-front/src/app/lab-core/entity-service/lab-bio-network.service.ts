import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BnBioNetworkService, BnUpdateMetabolite } from '@monorepo/bio-network';

@Injectable({
  providedIn: 'root',
})
export class LabBioNetworkService extends BnBioNetworkService {
  private apiService = inject(FlApiService);

  private route: string = 'biota/compound';

  constructor() {
    super();
  }

  enableSave(): boolean {
    return true;
  }

  saveMetaboliteLayout(metaboliteInfo: BnUpdateMetabolite): Observable<boolean> {
    return this.apiService
      .put(this.route + '/layout', metaboliteInfo)
      .pipe(map((response) => response != null));
  }
}
