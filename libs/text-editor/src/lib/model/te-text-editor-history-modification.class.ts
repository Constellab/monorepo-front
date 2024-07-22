import {FlUser} from '@monorepo/front-core-lib';
import {ClStringHelper} from '@monorepo/core-lib';
import {diffChars} from 'diff';


export enum TeTextEditorHistoryModificationType{
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
  MOVED = "MOVED"
}

export interface TeTextEditorHistoryModificationDifference {
  index: number;
  count: number;
  added: boolean;
  removed: boolean;
  value: string;
}

export class TeTextEditorHistoryBlockModification {
  id: string;
  userId: string;
  user: FlUser;
  blockId: string;
  blockType: string;
  time: number;
  version: string;
  type: TeTextEditorHistoryModificationType;
  index: number;
  differences?: TeTextEditorHistoryModificationDifference[];
  blockValue?: Record<string, any>;
  oldIndex?: number;

  constructor(version: string, blockId: string, blockType: string, type: TeTextEditorHistoryModificationType, index: number,
              userId: string, id?: string, time?: number) {
    this.id = id ?? ClStringHelper.generateUUID();
    this.version = version;
    this.time = time ?? new Date().getTime();
    this.blockId = blockId;
    this.blockType = blockType;
    this.type = type;
    this.index = index;
    this.userId = userId;
  }
}


export interface TeTextEditorHistoryModificationList{
  modifications: TeTextEditorHistoryBlockModification[];
}

export class TeTextEditorHistoryModificationGroup implements TeTextEditorHistoryModificationList{
  end: number;
  currentIndex?: number;
  modifications: TeTextEditorHistoryBlockModification[];

  constructor(end?: number) {
    this.end = end
  }

  public static getValuesDifferences(oldValue: string, newValue: string): TeTextEditorHistoryModificationDifference[] {
    const res: TeTextEditorHistoryModificationDifference[] = []
    const changes = diffChars(oldValue, newValue);
    let i = 0;
    for (const change of changes) {
      if (change.added || change.removed) {
        res.push({
          index: i,
          added: change.added,
          removed: change.removed,
          value: change.value,
          count: change.count
        });
      }
      if (!change.removed) {
        i += change.count;
      }
    }
    return res;
  }

  public static undoDifferences(value: string, differences: TeTextEditorHistoryModificationDifference[]): string {
    let res = value;
    const reversedDifferences = differences.slice().reverse();
    // if the first or last difference value is a /, we don't want to undo it
    if (reversedDifferences[0].value == '/' || reversedDifferences[reversedDifferences.length - 1].value == '/') {
      return res;
    }
    for (const diff of reversedDifferences) {
      if (diff.removed) {
        const before = res.slice(0, diff.index);
        const after = res.slice(diff.index);
        res = before + diff.value + after;
      } else if (diff.added) {
        const before = res.slice(0, diff.index);
        const after = res.slice(diff.index + diff.count);
        res = before + after;
      }
    }
    return res;
  }

  public static redoDifferences(value: string, differences: TeTextEditorHistoryModificationDifference[]): string {
    let res = value;
    // if the first or last difference value is a /, we don't want to redo it
    if (differences[0].value == '/' || differences[differences.length - 1].value == '/') {
      return res;
    }

    for (const diff of differences) {
      if (diff.added) {
        const before = res.slice(0, diff.index);
        const after = res.slice(diff.index);
        res = before + diff.value + after;
      } else if (diff.removed) {
        const before = res.slice(0, diff.index);
        const after = res.slice(diff.index + diff.count);
        res = before + after;
      }
    }
    return res;
  }

  public isEmpty(): boolean {
    return !this.modifications || this.modifications?.length === 0;
  }

  public isGroup(): boolean {
    return this.modifications?.length > 1;
  }

  public mainModificationId(): string {
    if(this.isEmpty()){
      return null;
    }
    return this.modifications[0].id;
  }

  public fusion(modifications: TeTextEditorHistoryBlockModification[]): void {
    modifications = this.reduceModifications(modifications);

    if (this.isEmpty()) {
      this.modifications = modifications;
      this.currentIndex = this.modifications.length - 1;
      return;
    }

    if (modifications.length === 0) {
      return;
    }
    const lastModification = this.modifications[this.modifications.length - 1];

    if (modifications.length > 1) {
      modifications = modifications.sort((a, b) => {
        if (a.blockId === lastModification.blockId) {
          return -1;
        }
        if (b.blockId === lastModification.blockId) {
          return 1;
        }
        return 0;
      });
    }

    let removeLastModification = false
    for (const modification of modifications) {
      if (lastModification.type == modification.type &&
        lastModification.blockId == modification.blockId &&
        lastModification.type != TeTextEditorHistoryModificationType.UPDATED) {
        removeLastModification = true;
      }
    }

    if (removeLastModification) {
      this.modifications = this.modifications.slice(0, this.modifications.length - 1);
    }

    if (this.currentIndex != null && this.currentIndex < this.modifications.length - 1) {
      this.modifications = this.modifications.slice(0, this.currentIndex + 1);
    }

    for (const modification of modifications) {
      this.modifications.push(modification);
    }

    this.currentIndex = this.modifications.length - 1;
  }

  private reduceModifications(modifications: TeTextEditorHistoryBlockModification[]): TeTextEditorHistoryBlockModification[]{
    const areAllMoved = modifications.every(modification => modification.type === TeTextEditorHistoryModificationType.MOVED);
    const numMoved = modifications.filter(modification => modification.type === TeTextEditorHistoryModificationType.MOVED).length;

    // if there is only one moved modification, we remove the modification because it's must be a bug
    if(numMoved == 1){
      modifications = modifications.filter(modification => modification.type !== TeTextEditorHistoryModificationType.MOVED);
    }

    // if all modifications are moved, we keep only the one with the biggest movement,
    // otherwise there will be a lot of modifications for nothing
    if(areAllMoved){
      let moveModification: TeTextEditorHistoryBlockModification = null;
      modifications.forEach(modification => {
        const movement = Math.abs(modification.index - modification.oldIndex);
        const currentMovement = moveModification ? Math.abs(moveModification.index - moveModification.oldIndex) : 0;
        if(moveModification == null || movement > currentMovement){
          moveModification = modification;
        }
      });
      if (moveModification){
        return [moveModification];
      } else {
        return [];
      }
    }

    // Otherwise, we remove all the modifications that are just a /  because they are not useful for the history
    // and we remove all modifications of type MOVED because they must have been created during another modification
    modifications = modifications.filter((m) => JSON.stringify(m.blockValue) != '{"text":"/"}'
      && m.type !== TeTextEditorHistoryModificationType.MOVED);

    return modifications;
  }
}
