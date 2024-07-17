import {HaUser} from '../../../ha-model/ha-entities/ha-user';

export enum HaTextEditorHistoryModificationType{
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED"
}

export class HaTextEditorHistoryModification{
  id: string;
  userId: string;
  user: HaUser;
  blockId: string;
  blockType: string;
  time: number;
  version: string;
  type: HaTextEditorHistoryModificationType;
  index: number;
  differences?: Record<string, any>[];
  blockValue?: Record<string, any>;
}

export class HaTextEditorHistoryModificationGroup{
  start: number;
  end: number;
  modifications: HaTextEditorHistoryModification[];
}
