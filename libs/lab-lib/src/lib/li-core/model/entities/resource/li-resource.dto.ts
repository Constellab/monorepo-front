import { LiProcessType } from '../li-type/li-process-type.entity';
import { Type } from 'class-transformer';

/**
 * DTO object to list the importer of a resource type
 */
export class LiResourceImporterType {
  @Type(() => LiProcessType)
  resource: LiProcessType;

  @Type(() => LiProcessType)
  importers: LiProcessType[];
}
