import {Observable} from 'rxjs';
import {TeTextEditorHistoryBlockModification} from './te-text-editor-history-modification.class';
import {TeRichTextContent} from './te-rich-text.class';


export interface TeTextEditorHistoryService {

  getHistory(entityId: string): Observable<TeTextEditorHistoryBlockModification[]>;

  getPreviousVersion(entityId: string, modificationId: string): Observable<TeRichTextContent>;

  rollbackContent?(entityId: string, modificationId: string): Observable<any>;
}
