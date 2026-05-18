import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiBaseEntityWithUser, LiUser } from '../li-user.entity';
import { LiFormStatus } from './li-form.enum';

export class LiFormTemplateRef {
  @Expose({ name: 'template_id' })
  templateId: string;

  @Expose({ name: 'template_name' })
  templateName: string;

  @Expose({ name: 'version_id' })
  versionId: string;

  @Expose({ name: 'version_number' })
  versionNumber: number;
}

export class LiForm extends LiBaseEntityWithUser {
  name: string;

  @Type(() => LiFormTemplateRef)
  template: LiFormTemplateRef;

  status: LiFormStatus;

  @Expose({ name: 'submitted_at' })
  @ClLuxonDateTimeTransform()
  submittedAt: DateTime | null;

  @Expose({ name: 'submitted_by' })
  @Type(() => LiUser)
  submittedBy: LiUser | null;

  isLoaded(): boolean {
    return this.name != null;
  }

  public toString(): string {
    return this.name;
  }
}

/**
 * Content returned by GET /form/{id}/content and POST /form/{id}/save.
 * Contains specs (schema) and current values.
 * Computed cells in values are wrapped as {value, errors}.
 */
export class LiFormContent {
  values: Record<string, unknown> | null;

  specs: TdParamSpecs;
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
