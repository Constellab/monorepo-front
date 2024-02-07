import {Type} from 'class-transformer';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval,
  FlTag
} from '@monorepo/front-core-lib';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {LabResourceViewType} from '../../../model/entities/resource/lab-resource-view.entity';
import {LabProject} from '../../../model/entities/lab-project.class';

export class LabViewConfigSearchFields {
  title: string;

  viewType: LabResourceViewType[];

  @Type(() => LabProject)
  project: LabProject[];

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  tags: FlTag[];

  includeNotFavorite: boolean;

  id: string;
}

export class LabViewConfigSearch {
  // list of the view types that are not searchable
  public static excludedViewTypes: LabResourceViewType[] = ['tabular-view', 'dataset-view', 'view', 'image-view', 'folder-view',
    'resources-list-view'];

  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<LabViewConfigSearchFields> = {
    title: 'title',
    project: 'biox.project',
    viewType: 'biox.view_type',
    // group the creation date into one chip
    createdAt: 'creation_date',
    tags: 'flTag.tags',
    includeNotFavorite: 'biox.view_include_not_favorite'
  };


  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static advancedSearchConverter: FlSearchCriteriaConverter<LabViewConfigSearchFields> = {
    title: {key: 'title', operator: 'CONTAINS'},
    project: {key: 'project', operator: 'IN', convertValue: FlSearchConverter.getEntitiesId},
    viewType: {key: 'view_type', operator: 'IN', convertValue: LabViewConfigSearch.viewTypeConverter},
    // Date
    createdAt: FlSearchConverter.dateInterval('created_at'),
    tags: {key: 'tags', operator: 'EQ'},
    includeNotFavorite: {key: 'include_not_favorite', operator: 'EQ'},
    id: {key: 'id', operator: 'EQ'}
  };


  public static getAdvancedSearchForm(): FormGroup<LabViewConfigSearchFields> {
    return new FormBuilder().group(
      {
        title: [null],
        project: [null],
        viewType: [null],
        createdAt: new FormBuilder().group<FlSearchDateInterval>({
          from: [null],
          to: [null],
        }),
        tags: [null],
        includeNotFavorite: [null],
        id: [null]
      }
    );
  }


  /**
   * Simple converter for the view type param to add similar view type when a type is selected
   * @param viewTypes
   * @private
   */
  private static viewTypeConverter(viewTypes: LabResourceViewType[]): LabResourceViewType[] {
    if (viewTypes == null) return null;
    const vT: LabResourceViewType[] = [...viewTypes];
    if (vT.includes('table-view')) {
      vT.push('tabular-view', 'dataset-view');
    }

    return vT;
  }

}
