import { Expose, Type } from 'class-transformer';
import { LiFolder } from './li-folder.class';
import { LiNote } from './li-note.entity';
import { LiNoteTemplate } from './li-note-template.entity';
import { LiResource } from './resource/li-resource.entity';
import { LiScenario } from './li-scenario.entity';
import { LiScenarioTemplate } from './process/li-scenario-template.entity';
import { LiViewConfig } from './resource/li-view-config.entity';
import { TypeHelpOptions } from 'class-transformer/types/interfaces/type-help-options.interface';
import { LiTagKeyModel } from './li-tag.entity';

export type LiEntityType =
  | 'SCENARIO'
  | 'RESOURCE'
  | 'VIEW'
  | 'NOTE'
  | 'SCENARIO_TEMPLATE'
  | 'NOTE_TEMPLATE'
  | 'FOLDER'
  | 'TAG';

export const labEntityTypeIcon: Record<LiEntityType, string> = {
  SCENARIO: 'scenario',
  RESOURCE: 'resource',
  VIEW: 'view',
  NOTE: 'note',
  SCENARIO_TEMPLATE: 'scenario_template',
  NOTE_TEMPLATE: 'note_template',
  FOLDER: 'folder',
  TAG: 'tag',
};

export class LiNavigableEntity {
  id: string;
  type: LiEntityType;
  name: string;

  @Expose({ name: 'parent_name' })
  parentName?: string;

  @Expose({ name: 'parent_type' })
  parentType?: LiEntityType;

  get typeIcon(): string {
    return labEntityTypeIcon[this.type];
  }

  get parentTypeIcon(): string {
    return labEntityTypeIcon[this.parentType];
  }
}

/**
 * Factory to create navigable entities based on type
 * @param json
 * @constructor
 */
const LabNavigableEntityGroupedFactory: any = (json: TypeHelpOptions) => {
  switch (json.newObject.type) {
    case 'SCENARIO':
      return LiScenario;
    case 'RESOURCE':
      return LiResource;
    case 'VIEW':
      return LiViewConfig;
    case 'NOTE':
      return LiNote;
    case 'SCENARIO_TEMPLATE':
      return LiScenarioTemplate;
    case 'NOTE_TEMPLATE':
      return LiNoteTemplate;
    case 'FOLDER':
      return LiFolder;
    case 'TAG':
      return LiTagKeyModel;
    default:
      throw new Error(`[LabNavigableEntityGroupedFactory] Type ${json.newObject.type} is not supported`);
  }
};

export class LiNavigableEntityGrouped<T = any> {
  type: LiEntityType;

  @Type(LabNavigableEntityGroupedFactory)
  entities: T[];

  get typeIcon(): string {
    return labEntityTypeIcon[this.type];
  }
}

export class LiNavigableEntityImpact {
  @Expose({ name: 'has_entities' })
  hasEntities: boolean;

  @Expose({ name: 'impacted_entities' })
  @Type(() => LiNavigableEntityGrouped)
  impactedEntities: LiNavigableEntityGrouped[];
}
