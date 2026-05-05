import { Expose, Type } from 'class-transformer';

import { LiBaseEntityWithUser } from '../../li-core/model/entities/li-user.entity';
import { LiFormTemplateVersionSummary } from './li-form-template-version.dto';

export class LiFormTemplate extends LiBaseEntityWithUser {
  name: string;

  description: string | null;

  @Expose({ name: 'current_draft_version_id' })
  currentDraftVersionId: string | null;

  @Expose({ name: 'current_published_version_id' })
  currentPublishedVersionId: string | null;

  @Expose({ name: 'current_published_version_number' })
  currentPublishedVersionNumber: number | null;

  public toString(): string {
    return this.name;
  }
}

export class LiFormTemplateWithVersions extends LiFormTemplate {
  @Type(() => LiFormTemplateVersionSummary)
  versions: LiFormTemplateVersionSummary[];
}

export interface LiCreateFormTemplateDTO {
  name: string;
  description?: string | null;
  tags?: string[];
}

export interface LiUpdateFormTemplateDTO {
  name?: string;
  description?: string | null;
}
