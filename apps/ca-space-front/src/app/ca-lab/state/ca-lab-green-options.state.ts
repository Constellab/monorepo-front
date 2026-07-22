import { inject, Injectable } from '@angular/core';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { CaLabGreenOption } from '../../ca-core/model/entities/lab/ca-lab-green-option.class';
import { CaLabService } from '../../ca-core/service-api/ca-lab.service';
import { CaLabDatasourceState } from './ca-lab-datasource.state';

/**
 * Holds the lab green-computing rules for a single lab, loaded once, so both the
 * dashboard accordion header (a badge preview) and its expanded content (the full table)
 * read from the same datasource without fetching twice.
 */
@Injectable()
export class CaLabGreenOptionsState extends CaLabDatasourceState<CaLabGreenOption> {
  private labService = inject(CaLabService);

  protected createDatasource(labId: string): FlArrayObs<CaLabGreenOption> {
    return new FlEntityArrayObs(this.labService.getGreenOptions(labId));
  }

  /** The green-computing rules, for the badge preview. */
  getOptions$(): Observable<CaLabGreenOption[]> {
    return this.datasource.connect();
  }
}
