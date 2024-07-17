import {Observable} from 'rxjs';
import {HaTextEditorHistoryModification} from './ha-text-editor-history-modification.class';
import {TeRichTextContent} from '@monorepo/text-editor';

export interface HaTextEditorHistoryService {
  getHistory(entityId: string): Observable<HaTextEditorHistoryModification[]>;

  getUndoContent(entityId: string, modificationId: string): Observable<TeRichTextContent>;

  rollbackContent(entityId: string, modificationId: string): Observable<any>;
}
