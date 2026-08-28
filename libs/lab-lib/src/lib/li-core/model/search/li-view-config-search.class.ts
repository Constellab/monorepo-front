import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { Type } from 'class-transformer';

import { LiFolder } from '../entities/li-folder.class';
import { LiResourceViewType } from '../entities/resource/li-resource-view.entity';
import { LiViewType } from '../entities/resource/li-view-config.entity';

export class LiViewConfigSearchFields {
  title: string;

  viewType: LiViewType;

  @Type(() => LiFolder)
  folder: LiFolder[];

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  tags: FlTag[];

  includeNotFavorite: boolean;

  id: string;
}

export class LiViewConfigSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiViewConfigSearchFields> = {
    title: 'li.title',
    folder: 'li.folder',
    viewType: 'li.view_type',
    // group the creation date into one chip
    createdAt: 'li.creation_date',
    tags: 'flTag.tags',
    includeNotFavorite: 'li.view_include_not_favorite',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LiViewConfigSearchFields> = {
    title: { key: 'title', operator: 'CONTAINS' },
    folder: { key: 'folder', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId },
    viewType: { key: 'view_type', operator: 'EQ', convertValue: LiViewConfigSearch.viewTypeConverter },
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
  private static viewTypeConverter(viewType: LiViewType): LiResourceViewType | null {
    if (viewType == null) return null;
    return viewType.type;
  }
}
