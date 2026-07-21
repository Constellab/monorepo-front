import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLabFolder, CaLabFolderDatasource } from '../../ca-core/model/entities/lab/ca-lab-folder.class';
import { CaLabFolderService } from '../../ca-core/service-api/ca-lab-folder.service';
import { CaLabDatasourceState } from './ca-lab-datasource.state';

/**
 * Holds the lab folders for a single lab, loaded once, so both the dashboard accordion
 * header (a chip preview) and its expanded content (the full table) read from the same
 * datasource without fetching twice.
 */
@Injectable()
export class CaLabFoldersState extends CaLabDatasourceState<CaLabFolder, CaLabFolderDatasource> {
  private labFolderService = inject(CaLabFolderService);

  protected createDatasource(labId: string): CaLabFolderDatasource {
    return new CaLabFolderDatasource(this.labFolderService.getLabFolders(labId));
  }

  /** Folder names, for the chip preview. */
  getFolderNames$(): Observable<string[]> {
    return this.datasource.connect().pipe(map((folders) => folders.map((f) => f.rootFolder.name)));
  }
}
