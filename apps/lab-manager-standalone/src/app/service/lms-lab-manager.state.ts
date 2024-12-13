import { LmlLabManagerState } from '@monorepo/lab-manager-lib';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { LmsLabService } from './lms-lab.service';

@Injectable()
export class LmsLabManagerState extends LmlLabManagerState {
  private labService = inject(LmsLabService);

  labManagerIsRunning$(): Observable<boolean> {
    return this.labService.labManagerIsRunning();
  }
}
