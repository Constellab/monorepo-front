import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiBaseEntityWithUser, LiUser } from '../../li-core/model/entities/li-user.entity';
import { LiFormStatus } from './li-form.enum';

export class LiForm extends LiBaseEntityWithUser {
  name: string;

  @Expose({ name: 'template_version_id' })
  templateVersionId: string;

  @Expose({ name: 'template_id' })
  templateId: string;

  status: LiFormStatus;

  @Expose({ name: 'submitted_at' })
  @ClLuxonDateTimeTransform()
  submittedAt: DateTime | null;

  @Expose({ name: 'submitted_by' })
  @Type(() => LiUser)
  submittedBy: LiUser | null;

  public toString(): string {
    return this.name;
  }
}

export class LiFormFull extends LiForm {
  schema: any;

  values: Record<string, unknown>;

  @Expose({ name: 'computed_errors' })
  computedErrors: Record<string, string>;
}

export interface LiCreateFormDTO {
  template_version_id: string;
  name?: string | null;
  tags?: string[];
}

export interface LiUpdateFormDTO {
  name?: string;
}

export interface LiSaveFormDTO {
  values: Record<string, unknown>;
  status_transition?: 'SUBMITTED' | null;
}

export interface LiSaveFormResponseDTO {
  form: LiForm;
  values: Record<string, unknown>;
  computed_errors: Record<string, string>;
  missing_mandatory_fields?: string[];
}
