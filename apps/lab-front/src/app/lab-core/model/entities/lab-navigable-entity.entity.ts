
export type LabEntityType = 'EXPERIMENT' | 'RESOURCE' | 'VIEW' | 'REPORT' | 'PROTOCOL_TEMPLATE' | 'REPORT_TEMPLATE';


export class LabNavigableEntity {
  id: string;
  type: LabEntityType;
  name: string;
}

export class LabNavigableEntityGrouped {
  type: LabEntityType;
  entities: LabNavigableEntity[];
}
