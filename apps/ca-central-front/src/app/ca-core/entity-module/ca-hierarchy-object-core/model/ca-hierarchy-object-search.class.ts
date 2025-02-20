import { Type } from 'class-transformer';
import { CaUser } from '../../../model/entities/ca-user.class';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CaHierarchyObjectType } from '../../../model/entities/folder/ca-hierarchy-object.class';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';

export class CaHierarchyObjectSearchFields {
  name: string;

  @Type(() => CaUser)
  users: CaUser[];

  objectType: CaHierarchyObjectType;

  tags: FlTag;
}

export class CaHierarchyObjectSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<CaHierarchyObjectSearchFields> = {
    name: 'name',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaHierarchyObjectSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    users: { key: 'user.id', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    objectType: { key: 'objectType', operator: 'EQ' },
    tags: { key: 'tags', operator: 'EQ', convertValue: CaHierarchyObjectSearch.tagConverter },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    lastModifiedAt: 'lastModifiedAt',
    user: ['user.firstname', 'user.lastname'],
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: null,
      users: null,
      objectType: null,
      tags: null,
    });
  }

  private static tagConverter(tag: FlTag): FlTag {
    if (tag == null) return tag;
    if (tag.value === '*') {
      return { key: tag.key, value: undefined };
    }
    return tag;
  }
}
