import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiUser } from '../../li-core/model/entities/li-user.entity';
import { LiFormChangeAction } from './li-form.enum';

export interface LiFormChangeEntryDTO {
  field_path: string;
  action: LiFormChangeAction;
  old_value: unknown | null;
  new_value: unknown | null;
}

export class LiFormSaveEvent {
  id: string;

  @Expose({ name: 'form_id' })
  formId: string;

  @Type(() => LiUser)
  user: LiUser;

  @Expose({ name: 'created_at' })
  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  changes: LiFormChangeEntryDTO[];
}
