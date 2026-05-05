import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiUser } from '../../li-core/model/entities/li-user.entity';
import { LiFormTemplateVersionStatus } from './li-form.enum';

export class LiFormTemplateVersionSummary {
  id: string;

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

  @Expose({ name: 'created_at' })
  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Expose({ name: 'last_modified_at' })
  @ClLuxonDateTimeTransform()
  lastModifiedAt: DateTime;
}

export class LiFormTemplateVersion extends LiFormTemplateVersionSummary {
  content: any;
}

export interface LiCreateFormTemplateVersionDTO {
  copy_from_version_id?: string | null;
}

export interface LiUpdateFormTemplateVersionDTO {
  content: any;
}
