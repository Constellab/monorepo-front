import {PrWorkflowPort} from '@monorepo/protocol';
import {FlStatusEvent} from '@monorepo/front-core-lib';
import {LabResource} from '../../../../lab-core/model/entities/resource/lab-resource.entity';

/**
 * Object that include port and resource
 */
export interface LabWorkflowPortResource {
  port: PrWorkflowPort;
  resource: FlStatusEvent<LabResource>;
}
