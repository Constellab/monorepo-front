import { Observable } from 'rxjs';

import { HaBaseEntityWithFiles } from './ha-base-entity-with-files';
import { HaFile } from './ha-file';

export interface HaFileServiceInterface<T extends HaBaseEntityWithFiles> {
  getById(entityId: string): Observable<T>;
  uploadFile(file: File, entityId: string): Observable<HaFile>;
  renameFile(fileId: string, newName: string): Observable<HaFile>;
  deleteFile(entityId: string, name: string): Observable<void>;
}
