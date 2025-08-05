import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter, FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { Type } from 'class-transformer';

import { LiTagValueFormat } from '../entities/li-tag.entity';
import { LiSearchConverter } from '../global/li-search-converter.class';

export class LiTagSearchFields {
  key: string;

  label: string;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  valueFormat: LiTagValueFormat;

  deprecated: boolean;

  id: string;

}

export class LiTagSearch {

  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiTagSearchFields> = {
    key: 'li.key',
    label: 'li.label',
    createdAt: 'li.creation_date',
    valueFormat: 'li.value_format',
    deprecated: 'li.deprecated'
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LiTagSearchFields> = {
    key: { key: 'key', operator: 'CONTAINS' },
    label: { key: 'label', operator: 'CONTAINS' },
    createdAt: FlSearchConverter.dateInterval('created_at'),
    valueFormat: { key: 'value_format', operator: 'EQ' },
    deprecated: { key: 'deprecated', operator: 'EQ', convertValue: LiSearchConverter.includeAllOnCheck },
    id: { key: 'id', operator: 'EQ' }
  }

  public static sortConverter: FlSearchSortCriteriaConverter = {
    key: 'key',
    label: 'label',
    creation: 'created_at'
  }

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      key: [null],
      label: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null]
      }),
      valueFormat: [null],
      deprecated: [null],
      id: [null]
    })
  }
}
