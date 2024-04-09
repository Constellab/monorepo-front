import {Observable} from 'rxjs';
import {HaFile} from './ha-file';
import {HaBaseEntityWithFiles} from './ha-base-entity-with-files';

export interface HaFileServiceInterface<T extends HaBaseEntityWithFiles>{
  getById(entityId: string): Observable<T>;
  uploadFile(file: File, entityId: string): Observable<HaFile>;
  renameFile(fileId: string, newName: string): Observable<HaFile>;
  deleteFile(fileId: string): Observable<void>;
}
