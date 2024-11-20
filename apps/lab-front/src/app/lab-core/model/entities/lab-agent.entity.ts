import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { LabEntity } from '../global/lab-entity.entity';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { DateTime } from 'luxon';
import { CoAgent, CoUser } from '@monorepo/community-lib';
import { TdTypeStyle } from '@monorepo/technical-doc';

export class LabAgent extends LabEntity {
  title: string;
  space?: any;
  created_at?: string;
  last_modified_at?: string;
  created_by?: CoUser;

  @TeRichTextTransform()
  description?: TeRichText;
  latest_publish_version: number;
  latest_style?: TdTypeStyle;

  toCoAgent(): CoAgent {
    const coAgent = new CoAgent();
    coAgent.id = this.id;
    coAgent.title = this.title;
    coAgent.description = this.description;
    coAgent.latestPublishVersion = this.latest_publish_version;
    coAgent.createdAt = DateTime.fromISO(this.created_at);
    coAgent.lastModifiedAt = DateTime.fromISO(this.last_modified_at);
    coAgent.createdBy = this.created_by;
    coAgent.space = this.space;
    coAgent.latestStyle = this.latest_style;
    return coAgent;
  }
}

export type LabAgentDatasourcePaginated = FlDatasourcePaginated<LabAgent>;

export class LabCreateCommunityAgentVersionResDto {
  id: string;
  agent_version: string;
  title: string;
}
