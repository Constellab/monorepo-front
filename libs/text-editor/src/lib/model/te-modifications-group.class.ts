import { DateTime } from 'luxon';
import { TeRichTextBlockModificationWithUser } from './lib';

export class TeTextEditorHistoryModificationGroup {
  end: DateTime;
  modifications: TeRichTextBlockModificationWithUser[];

  constructor(end?: DateTime) {
    this.end = end;
  }

  public isEmpty(): boolean {
    return !this.modifications || this.modifications?.length === 0;
  }

  public mainModificationId(): string {
    if (this.isEmpty()) {
      return null;
    }
    return this.modifications[0].id;
  }
}
