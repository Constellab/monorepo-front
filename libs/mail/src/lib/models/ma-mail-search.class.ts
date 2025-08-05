import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { Type } from 'class-transformer';

import { MaMailStatus } from './ma-mail.entity';

export class MaMailSearchFields {
  id: string;

  recipients: string;

  subject: string;

  status: MaMailStatus;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  error: string;
}

export class MaMailSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<MaMailSearchFields> = {
    id: 'maMail.id',
    recipients: 'maMail.recipients',
    subject: 'maMail.subject',
    status: 'maMail.status',
    lastModifiedAt: 'maMail.lastModifiedAt',
    error: 'maMail.error',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<MaMailSearchFields> = {
    id: { key: 'id', operator: 'EQ' },
    recipients: { key: 'recipients', operator: 'MATCH' },
    subject: { key: 'subject', operator: 'MATCH' },
    status: { key: 'status', operator: 'EQ' },
    lastModifiedAt: FlSearchConverter.dateInterval('lastModifiedAt'),
    error: { key: 'error', operator: 'MATCH' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    recipients: 'recipients',
    subject: 'subject',
    lastModifiedAt: 'lastModifiedAt',
    status: 'status',
    error: 'error',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      id: null,
      recipients: null,
      subject: null,
      status: null,
      lastModifiedAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      error: null,
    });
  }
}
