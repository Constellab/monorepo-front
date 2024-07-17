import {FlUserDto} from '@monorepo/front-core-lib';


export enum TeTextEditorHistoryModificationType{
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED"
}

export class TeTextEditorHistoryModification{
  id: string;
  userId: string;
  user: FlUserDto;
  blockId: string;
  blockType: string;
  time: number;
  version: string;
  type: TeTextEditorHistoryModificationType;
  index: number;
  differences?: Record<string, any>[];
  blockValue?: Record<string, any>;
}

export class TeTextEditorHistoryModificationGroup{
  start: number;
  end: number;
  modifications: TeTextEditorHistoryModification[];
}
