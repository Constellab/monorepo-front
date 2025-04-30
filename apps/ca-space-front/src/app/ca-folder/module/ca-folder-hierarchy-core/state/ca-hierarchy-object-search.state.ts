import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
  CaHierarchyObjectType,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import {
  CaHierarchyObjectSearch,
  CaHierarchyObjectSearchFields,
} from '../../../../ca-core/entity-module/ca-hierarchy-object-core/model/ca-hierarchy-object-search.class';
import { FlSearchConfig, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { of } from 'rxjs';
import { clGetEmptyPage, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FormControl, FormGroup } from '@angular/forms';
import { CaHierarchyObjectDetailState } from './ca-hierarchy-object-detail.state';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';

/**
 * State to manager the search at hierarchy object level when the object is a folder
 */
@Injectable()
export class CaHierarchyObjectSearchState implements OnDestroy {
  public childrenDatasource: CaHierarchyObjectDatasource<CaHierarchyObjectSearchFields>;
  private searchState = inject<FlSearchState<CaHierarchyObject>>(FlSearchState);
  private state = inject(CaHierarchyObjectDetailState);
  private folderService = inject(CaFolderService);

  private subscriptions = new ClSubscriptionHandler();

  private isInitialized = false;

  public init(): FormGroup {
    this.childrenDatasource = new FlEntityPaginatedDatasource<
      CaHierarchyObject,
      CaHierarchyObjectSearchFields
    >(() => of(clGetEmptyPage()), 30, { initFirstPage: false, disableAutoDisconnect: true });

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

    this.subscriptions.add(
      this.state.getHierarchyContext$().subscribe((context) => {
        // search for root folders
        if (context.type === 'rootFolders') {
          this.childrenDatasource.setPageFunction((page, pageSIze, requestData) =>
            this.folderService.searchRootFolders(page, pageSIze, requestData)
          );
          // search for children of a folder
        } else if (context.type === CaHierarchyObjectType.FOLDER) {
          this.childrenDatasource.setPageFunction((page, pageSize, requestData) =>
            this.folderService.searchChildren(context.hierarchyObject.id, page, pageSize, requestData)
          );
        }

        if (this.isInitialized) {
          // if it not the first time we need to reset the form (because it is a navigation)
          this.searchState.resetFormAndCallSearch();
        } else {
          // so we submit the form to trigger the search if it is not trigger by the url params
          // if it is also triggered by the url params it will be ignored, only 1 search will be done
          this.searchState.submitForm();
        }
        this.isInitialized = true;
      })
    );

    return this.searchState.advancedSearchFormGroup;
  }

  public getTagsFormControl(): FormControl {
    return this.searchState.advancedSearchFormGroup.get('tags') as FormControl;
  }

  public ngOnDestroy(): void {
    this.childrenDatasource?.manualDisconnect();
    this.subscriptions.unsubscribe();
  }
}
