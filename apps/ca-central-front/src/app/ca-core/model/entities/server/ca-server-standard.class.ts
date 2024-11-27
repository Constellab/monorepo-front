import { CaBaseEntity } from '../ca-base-entity.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';

export class CaServerStandard extends CaBaseEntity {
  name: string;

  description: string;

  technicalDescription: string;
}

export type CaServerStandardDatasource = FlEntityPaginatedDatasource<CaServerStandard>;

export interface CaServerStandardSaveDTO {
  id: string;
  name: string;
  description: string;
  technicalDescription: string;
  price: number; // only for create mode
}

/**
 * use when create a lab to choose the server
 */
export class CaServerDecisionTreeOptionDTO {
  title: string;
  description: string;
  // if not leaf
  children?: CaServerDecisionTreeOptionDTO[];
  // if leaf
  suggestedServerNames?: string[];
}

export class CaServerDecisionTreeDTO {
  tree: CaServerDecisionTreeOptionDTO[];
}

export class CaYoutubeVideo {
  title: string;
  videoId: string;
  embedLink: string;
  youtubeLink: string;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}
