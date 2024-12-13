import { LmlLabManagerState } from '@monorepo/lab-manager-lib';
import { CaLabDetailPageState } from './ca-lab-detail-page.state';
import { first, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class CaLabManagerState extends LmlLabManagerState {
  private labState = inject(CaLabDetailPageState);

  labManagerIsRunning$(): Observable<boolean> {
    return this.labState.getStatus$().pipe(map((status) => status.labManagerIsRunning));
  }

  getAdminerInfo(): Observable<string> {
    return this.labState.getLab$().pipe(
      first(),
      map((lab) => lab.adminerUrl)
    );
  }
}
