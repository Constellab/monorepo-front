import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiBaseEntityWithUser, LiUser } from '../li-user.entity';
import { LiFormTemplateVersionStatus } from './li-form.enum';

export class LiFormTemplateVersionSummary extends LiBaseEntityWithUser {
  @Expose({ name: 'template_id' })
  templateId: string;

  version: number;

  status: LiFormTemplateVersionStatus;

  @Expose({ name: 'published_at' })
  @ClLuxonDateTimeTransform()
  publishedAt: DateTime | null;

  @Expose({ name: 'published_by' })
  @Type(() => LiUser)
  publishedBy: LiUser | null;
}

export class LiFormTemplateVersion extends LiFormTemplateVersionSummary {
  content: TdParamSpecs;
}

export interface LiCreateFormTemplateVersionDTO {
  copy_from_version_id?: string | null;
}

export interface LiUpdateFormTemplateVersionDTO {
  content: TdParamSpecs;
}
