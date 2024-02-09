import {Expose, Type} from 'class-transformer';
import {LabReport} from './lab-report.entity';
import {LabExperiment} from './lab-experiment.entity';
import {LabResource} from './resource/lab-resource.entity';
import {LabViewConfig} from './resource/lab-view-config.entity';
import {LabReportTemplate} from './lab-report-template.entity';
import {LabProtocolTemplate} from './process/lab-protocol-template.entity';
import {LabProject} from './lab-project.class';
import {
  LabProtocolUpdateDTO
} from '../../../lab-biox/module/lab-experiment-detail-page/model/lab-workflow-action.class';

export type LabEntityType = 'EXPERIMENT' | 'RESOURCE' | 'VIEW' | 'REPORT'
  | 'PROTOCOL_TEMPLATE' | 'REPORT_TEMPLATE' | 'PROJECT';

export const labEntityTypeIcon: Record<LabEntityType, string> = {
  EXPERIMENT: 'experiment',
  RESOURCE: 'resource',
  VIEW: 'view',
  REPORT: 'report',
  PROTOCOL_TEMPLATE: 'protocol_template',
  REPORT_TEMPLATE: 'report_template',
  PROJECT: 'project'
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

export const LabNavigableEntityGroupedFactory3: any = (json: any) => {
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
    case 'REPORT_TEMPLATE':
      return LabReportTemplate;
    case 'PROJECT':
      return LabProject;
    default:
      throw new Error(`[LabNavigableEntityGroupedFactory] Type ${json.type} is not supported`);
  }
};


export class LabNavigableEntityGrouped<T = any> {
  type: LabEntityType;

  @Type(LabNavigableEntityGroupedFactory3)
  entities: T[];

  get typeIcon(): string {
    return labEntityTypeIcon[this.type];
  }
}


export class LabProcessResetResult {

  success: boolean;

  @Expose({name: 'protocol_update'})
  @Type(() => LabProtocolUpdateDTO)
  protocolUpdate: LabProtocolUpdateDTO;

  @Expose({name: 'impacted_entities'})
  @Type(() => LabNavigableEntityGrouped)
  impactedEntities?: LabNavigableEntityGrouped[];
}

