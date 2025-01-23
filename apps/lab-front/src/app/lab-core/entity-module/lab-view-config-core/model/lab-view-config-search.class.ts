import { Type } from 'class-transformer';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { FlSearchDateInterval } from '@monorepo/front-core-lib/fl-search';
import { FlSearchFilterCriteriaConverter } from '@monorepo/front-core-lib/fl-search';
import { FlSearchSortCriteriaConverter } from '@monorepo/front-core-lib/fl-search';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';

import { FormBuilder, FormGroup } from '@angular/forms';
import { LabResourceViewType } from '../../../model/entities/resource/lab-resource-view.entity';
import { LabFolder } from '../../../model/entities/lab-folder.class';
import { LabViewType } from '../../../model/entities/resource/lab-view-config.entity';

export class LabViewConfigSearchFields {
  title: string;

  viewType: LabViewType;

  @Type(() => LabFolder)
  folder: LabFolder[];

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  tags: FlTag[];

  includeNotFavorite: boolean;

  id: string;
}

export class LabViewConfigSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LabViewConfigSearchFields> = {
    title: 'title',
    folder: 'biox.folder',
    viewType: 'biox.view_type',
    // group the creation date into one chip
    createdAt: 'creation_date',
    tags: 'flTag.tags',
    includeNotFavorite: 'biox.view_include_not_favorite',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LabViewConfigSearchFields> = {
    title: { key: 'title', operator: 'CONTAINS' },
    folder: { key: 'folder', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    viewType: { key: 'view_type', operator: 'EQ', convertValue: LabViewConfigSearch.viewTypeConverter },
    // Date
    createdAt: FlSearchConverter.dateInterval('created_at'),
    tags: { key: 'tags', operator: 'EQ' },
    includeNotFavorite: { key: 'include_not_favorite', operator: 'EQ' },
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    title: 'title',
    lastModifiedAt: 'last_modified_at',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      title: [null],
      folder: [null],
      viewType: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      tags: [null],
      includeNotFavorite: [null],
      id: [null],
    });
  }

  /**
   * Simple converter for the view type param to add similar view type when a type is selected
   * @param viewType
   * @private
   */
  private static viewTypeConverter(viewType: LabViewType): LabResourceViewType {
    if (viewType == null) return null;
    return viewType.type;
  }
}
