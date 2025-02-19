import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import {
  CaHierarchyObjectSearch,
  CaHierarchyObjectSearchFields,
} from '../../../../ca-core/entity-module/ca-hierarchy-object-core/model/ca-hierarchy-object-search.class';
import { FlSearchConfig, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { of } from 'rxjs';
import { clGetEmptyPage } from '@monorepo/core-lib';
import { FormControl, FormGroup } from '@angular/forms';

/**
 * State to manager the search at hierarchy object level when the object is a folder
 */
@Injectable()
export class CaHierarchyObjectSearchState implements OnDestroy {
  public childrenDatasource: CaHierarchyObjectDatasource<CaHierarchyObjectSearchFields>;
  private searchState = inject<FlSearchState<CaHierarchyObject>>(FlSearchState);

  public init(): FormGroup {
    this.childrenDatasource = new FlEntityPaginatedDatasource<
      CaHierarchyObject,
      CaHierarchyObjectSearchFields
    >(() => of(clGetEmptyPage()), 30, { initFirstPage: false });

    // init the children search state
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaHierarchyObjectSearch.getSearchForm,
      advancedFormClass: CaHierarchyObjectSearchFields,
      savedSearch: [],
      advancedFormManager: {
        config: CaHierarchyObjectSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'lastModifiedAt', direction: 'DESC' },
    };
    this.searchState.init(config, this.childrenDatasource);

    return this.searchState.advancedSearchFormGroup;
  }

  public getTagsFormControl(): FormControl {
    return this.searchState.advancedSearchFormGroup.get('tags') as FormControl;
  }

  public resetFormAndCallSearch(): void{
    this.searchState.resetFormAndCallSearch({emitEvent: false});
  }

  public submitFormAndCallSearch(): void{
    this.searchState.submitForm();
  }


  public ngOnDestroy(): void {
    this.childrenDatasource?.manualDisconnect();
  }
}
