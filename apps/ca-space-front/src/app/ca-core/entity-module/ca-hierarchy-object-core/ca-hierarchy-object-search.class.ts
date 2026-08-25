import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchCriteria,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { Type } from 'class-transformer';

import { CaUser } from '../../model/entities/ca-user.class';
import { CaHierarchyObjectType } from '../../model/entities/folder/ca-hierarchy-object.class';

export class CaHierarchyObjectSearchFields {
  name: string;

  @Type(() => CaUser)
  users: CaUser[];

  objectType: CaHierarchyObjectType;

  tags: FlTag;
}

export class CaHierarchyObjectSearchTrashField extends CaHierarchyObjectSearchFields {
  includeSubObjects: boolean;
}

export class CaHierarchyObjectAdminSearchFields {
  name: string;

  @Type(() => CaUser)
  user: CaUser;

  objectType: CaHierarchyObjectType;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  includeTrashObjects: boolean;

  id: string;
}

export class CaHierarchyObjectSearch {
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

  //////////////////// SEARCH TRASH //////////////////////

  /**
   * Get filter converter for trash mode
   * @param enableSubObjectFilter if false the includeSubObjects is ignored
   */
  public static getTrashFilterConverter(
    enableSubObjectFilter: boolean
  ): FlSearchFilterCriteriaConverter<CaHierarchyObjectSearchTrashField> {
    return {
      ...CaHierarchyObjectSearch.filterConverter,
      includeSubObjects: (value: boolean): FlSearchCriteria[] | null => {
        if (!enableSubObjectFilter) return null;
        if (value === true) return null;
        return [{ key: 'parentId', operator: 'NULL', value: null }];
      },
    };
  }

  public static getSearchFormTrash(): FormGroup {
    return new FormBuilder().group({
      name: null,
      users: null,
      objectType: null,
      tags: null,
      includeSubObjects: false,
    });
  }

  ///////////////////// ADMIN SEARCH //////////////////////

  public static searchAdminManagerConfig(): FlFormInputsManagerConfig<CaHierarchyObjectAdminSearchFields> {
    return {
      name: 'name',
      includeTrashObjects: 'include_trash_objects',
      objectType: 'folder_object_type',
    };
  }

  public static filterConverterAdmin: FlSearchFilterCriteriaConverter<CaHierarchyObjectAdminSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    user: { key: 'user.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    objectType: { key: 'objectType', operator: 'EQ' },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    includeTrashObjects: { key: 'includeTrashObjects', operator: 'EQ' },
    id: { key: 'id', operator: 'EQ' },
  };

  public static getAdminSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: null,
      user: null,
      objectType: null,
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      includeTrashObjects: false,
      id: null,
    });
  }
}
