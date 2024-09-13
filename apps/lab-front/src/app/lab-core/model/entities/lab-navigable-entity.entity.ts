import { Expose, Type } from 'class-transformer';
import { LabReport } from './lab-report.entity';
import { LabExperiment } from './lab-experiment.entity';
import { LabResource } from './resource/lab-resource.entity';
import { LabViewConfig } from './resource/lab-view-config.entity';
import { LabDocumentTemplate } from './lab-document-template.entity';
import { LabProtocolTemplate } from './process/lab-protocol-template.entity';
import { LabFolder } from './lab-folder.class';
import { TypeHelpOptions } from 'class-transformer/types/interfaces/type-help-options.interface';

export type LabEntityType = 'EXPERIMENT' | 'RESOURCE' | 'VIEW' | 'REPORT'
  | 'PROTOCOL_TEMPLATE' | 'DOCUMENT_TEMPLATE' | 'FOLDER';

export const labEntityTypeIcon: Record<LabEntityType, string> = {
  EXPERIMENT: 'experiment',
  RESOURCE: 'resource',
  VIEW: 'view',
  REPORT: 'report',
  PROTOCOL_TEMPLATE: 'protocol_template',
  DOCUMENT_TEMPLATE: 'document_template',
  FOLDER: 'folder'
};

export class LabNavigableEntity {
  id: string;
  type: LabEntityType;
  name: string;

  @Expose({name: 'parent_name'})
  parentName?: string;

  @Expose({name: 'parent_type'})
  parentType?: LabEntityType;

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
    case 'EXPERIMENT':
      return LabExperiment;
    case 'RESOURCE':
      return LabResource;
    case 'VIEW':
      return LabViewConfig;
    case 'REPORT':
      return LabReport;
    case 'PROTOCOL_TEMPLATE':
      return LabProtocolTemplate;
    case 'DOCUMENT_TEMPLATE':
      return LabDocumentTemplate;
    case 'FOLDER':
      return LabFolder;
    default:
      throw new Error(`[LabNavigableEntityGroupedFactory] Type ${json.newObject.type} is not supported`);
  }
};


export class LabNavigableEntityGrouped<T = any> {
  type: LabEntityType;

  @Type(LabNavigableEntityGroupedFactory)
  entities: T[];

  get typeIcon(): string {
    return labEntityTypeIcon[this.type];
  }
}

export class LabNavigableEntityImpact{
  @Expose({name: 'has_entities'})
  hasEntities: boolean;

  @Expose({name: 'impacted_entities'})
  @Type(() => LabNavigableEntityGrouped)
  impactedEntities: LabNavigableEntityGrouped[];
}
