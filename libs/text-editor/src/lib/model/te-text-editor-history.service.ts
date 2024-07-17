import {Observable} from 'rxjs';
import {TeTextEditorHistoryModification} from './te-text-editor-history-modification.class';
import {TeRichTextContent} from './te-rich-text.class';


export interface TeTextEditorHistoryService {

  getHistory(entityId: string): Observable<TeTextEditorHistoryModification[]>;

  getUndoContent(entityId: string, modificationId: string): Observable<TeRichTextContent>;

  rollbackContent(entityId: string, modificationId: string): Observable<any>;
}
