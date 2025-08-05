import { Observable } from 'rxjs';

import { TeRichTextBlockModificationWithUser, TeRichTextDTO } from './lib';

export interface TeTextEditorHistoryService {
  getHistory(entityId: string): Observable<TeRichTextBlockModificationWithUser[]>;

  getPreviousVersion(entityId: string, modificationId: string): Observable<TeRichTextDTO>;

  rollbackContent?(entityId: string, modificationId: string): Observable<any>;
}
