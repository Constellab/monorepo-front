import { inject, Injectable, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClCoreJsonConvert, clGetEmptyPage, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConfig, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { of } from 'rxjs';

import {
  CaHierarchyObjectSearch,
  CaHierarchyObjectSearchFields,
} from '../../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-search.class';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
  CaHierarchyObjectType,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { CaHierarchyObjectService } from '../../../../ca-core/service-api/ca-hierarchy-object.service';
import { CaHierarchyObjectDetailState } from './ca-hierarchy-object-detail.state';
import { CaHierarchyObjectEvent, CaHierarchyObjectEventState } from './ca-hierarchy-object-event.state';

/**
 * State to manager the search at hierarchy object level when the object is a folder
 */
@Injectable()
export class CaHierarchyObjectSearchState implements OnDestroy {
  public childrenDatasource: CaHierarchyObjectDatasource<CaHierarchyObjectSearchFields>;
  private searchState = inject<FlSearchState<CaHierarchyObject>>(FlSearchState);
  private state = inject(CaHierarchyObjectDetailState);
  private folderService = inject(CaFolderService);
  private hierarchyObjectService = inject(CaHierarchyObjectService);

  private eventState = inject(CaHierarchyObjectEventState);

  private subscriptions = new ClSubscriptionHandler();

  private isInitialized = false;

  public init(): FormGroup {
    this.childrenDatasource = new FlEntityPaginatedDatasource<
      CaHierarchyObject,
      CaHierarchyObjectSearchFields
    >(() => of(clGetEmptyPage()), 25, { initFirstPage: false, disableAutoDisconnect: true });

    // init the children search state
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaHierarchyObjectSearch.getSearchForm,
      advancedFormClass: CaHierarchyObjectSearchFields,
      savedSearch: [],
      advancedFormManager: {
        config: {},
        skipFalseBoolean: true,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'lastModifiedAt', direction: 'DESC' },
      autoSearch: false,
    };
    this.searchState.init(config, this.childrenDatasource);

    this.subscriptions.add(
      this.state.getHierarchyContext$().subscribe((context) => {
        // search for root folders
        if (context.type === 'rootFolders') {
          this.searchState.disabled = false;
          this.childrenDatasource.setPageFunction((page, pageSize, requestData) =>
            this.folderService.searchRootFolders(page, pageSize, requestData)
          );
          // search for children of a folder
        } else if (context.type === 'globalSearch') {
          this.searchState.disabled = false;
          this.childrenDatasource.setPageFunction((page, pageSize, requestData) =>
            this.hierarchyObjectService.searchInRootFoldersAndChildren(page, pageSize, requestData)
          );
        } else if (context.type === CaHierarchyObjectType.FOLDER) {
          this.searchState.disabled = false;
          this.childrenDatasource.setPageFunction((page, pageSize, requestData) =>
            this.hierarchyObjectService.searchChildren(
              context.hierarchyObject.id,
              page,
              pageSize,
              requestData
            )
          );
        } else {
          this.searchState.disabled = true;
          this.childrenDatasource.clear();
        }

        // so we submit the form to trigger the search if it is not trigger by the url params
        // if it is also triggered by the url params it will be ignored, only 1 search will be done
        if (!this.isInitialized) {
          this.searchState.submitForm();

          // if it not the first time we need to reset the form (because it is a navigation)
          // if we navigate to global search we don't want to reset the form
          // global search is a special case, we don't reset so navigation back keeps the form
        } else if (context.type !== 'globalSearch') {
          this.searchState.resetFormAndCallSearch();
        }
        this.isInitialized = true;
      })
    );

    this.subscriptions.add(
      this.eventState.getEvent$().subscribe((event) => {
        if (event) {
          this.onEvent(event);
        }
      })
    );

    // trigger search on tags change
    this.subscriptions.add(
      this.getTagsFormControl().valueChanges.subscribe(() => this.searchState.submitForm())
    );

    return this.searchState.advancedSearchFormGroup;
  }

  private onEvent(event: CaHierarchyObjectEvent): void {
    switch (event.action) {
      case 'create':
        this.addChild(event.hierarchyObject);
        return;
      case 'update':
        this.updatePartialChild(event.hierarchyObjectId, event.hierarchyObject);
        return;
      case 'delete':
        this.deleteHierarchyObjectById(event.hierarchyObjectId);
        return;
    }
  }

  public getTagsFormControl(): FormControl {
    return this.searchState.advancedSearchFormGroup.get('tags') as FormControl;
  }

  private updatePartialChild(hierarchyObjectId: string, hierarchyObject: Partial<CaHierarchyObject>): void {
    const childFolder = this.childrenDatasource.findItemById(hierarchyObjectId);
    if (childFolder) {
      // create a new folder based on the old one and the new data
      const cloned = ClCoreJsonConvert.deepCloneClassAndMerge(
        childFolder,
        hierarchyObject,
        CaHierarchyObject
      );
      this.childrenDatasource.updateItem(cloned);
    }
  }

  private async addChild(folder: CaHierarchyObject): Promise<void> {
    const currentContext = await this.state.getHierarchyContextIdPromise();
    // if the new object is a child of the current context
    if (folder.parentId === currentContext.hierarchyObjectId) {
      this.childrenDatasource.unshiftItem(folder);
    }
  }

  private deleteHierarchyObjectById(hierarchyObjectId: string): void {
    const child = this.childrenDatasource.findItemById(hierarchyObjectId);
    if (child) {
      this.childrenDatasource.removeItem(child);
    }
  }

  public ngOnDestroy(): void {
    this.childrenDatasource?.manualDisconnect();
    this.subscriptions.unsubscribe();
  }
}
