import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClCoreJsonConvert, ClHelpService } from '@monorepo/core-lib';
import {
  FlBulkActionButton,
  FlBulkActionContext,
  FlBulkSelectionModule,
} from '@monorepo/front-core-lib/fl-bulk-selection';
import {
  FlDatasourcePaginated,
  FlEntityPaginatedDatasource,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlDragModule, FlDropEvent } from '@monorepo/front-core-lib/fl-drag';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import {
  LiFileResourceService,
  LiMonitorService,
  LiResource,
  LiResourceSearch,
  LiResourceSearchFields,
  LiResourceSearchFieldsDisabled,
  LiResourceService,
  LiRouterService,
} from '@monorepo/lab-lib/li-core';
import {
  LiQuickConfigureProcessDialogComponent,
  LiQuickConfigureProcessDialogInput,
} from '@monorepo/lab-lib/li-process';
import {
  LiBulkManageEntityTagsDialogComponent,
  LiBulkManageEntityTagsDialogInput,
} from '@monorepo/lab-lib/li-tag';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import {
  LiFsNodeTypesSelectionDialogComponent,
  LiFsNodeTypesSelectionDialogInput,
  LiFsNodeTypesSelectionDialogMode,
  LiFsNodeTypesSelectionDialogResult,
} from '../li-fs-node-types-selection-dialog/li-fs-node-types-selection-dialog.component';
import { LiResourceSearchFormComponent } from '../li-resource-search-form/li-resource-search-form.component';
import { LiResourceTableComponent } from '../li-resource-table/li-resource-table.component';

export const LI_RESOURCE_SEARCH_NAME: string = 'li-resource';

/**
 * Complete component to search on resource. It supports a select mode and manage file upload.
 */
@Component({
  selector: 'li-resource-search',
  templateUrl: './li-resource-search.component.html',
  styleUrls: ['./li-resource-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSearchModule,
    FlDragModule,
    LiResourceSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInputFileModule,
    MatTooltip,
    MatIconButton,
    LiResourceTableComponent,
    TranslatePipe,
    FlBulkSelectionModule,
  ],
})
export class LiResourceSearchComponent implements OnInit, OnDestroy {
  @Input() resourceSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  /**
   * Use to add custom searches in the list of saved search. If one of them is the default one,
   * it overrides the other default.
   */
  @Input() customSavedSearches: FlSavedSearch[] | null | undefined = null;

  /**
   * Use to set default filters in the search, those filters are not modifiable by the user.
   */
  @Input() defaultFilters: LiResourceSearchFields | null | undefined = null;

  /**
   * Use to disable some fields in the advanced search form.
   */
  @Input() disabledFilters: LiResourceSearchFieldsDisabled | null | undefined = null;

  @Output() resourceSelected: EventEmitter<LiResource> = new EventEmitter<LiResource>();

  datasource: FlDatasourcePaginated<LiResource>;

  columns: FlTableColumnStatic<LiResource>[];

  // when true, the bulk selection (e.g. bulk add tags) is available
  bulkEnabled: boolean = false;

  bulkActions: FlBulkActionButton[] = [
    {
      type: 'tag',
      text: { text: 'li.tags', translateText: true },
      icon: 'tag',
      onClick: (context) => this.openBulkTagsDialog(context),
    },
  ];

  files: File[];

  private actionSubscription: Subscription;

  private searchState = inject(FlSearchState);
  private dialogService = inject(FlDialogService);
  private actionsService = inject(FlPortalActionsService);
  private fileResourceService = inject(LiFileResourceService);
  private monitorService = inject(LiMonitorService);
  private resourceService = inject(LiResourceService);
  private themeService = inject(FlThemeService);
  private snackBarService = inject(FlSnackBarService);

  ngOnInit(): void {
    this.columns = this.fullPageSearch
      ? ['name', 'type', 'tags', 'lastModification', 'viewResource', 'flagged']
      : ['name', 'type', 'lastModification', 'viewResource']; // no tags, flagged
    // in none selectable mode, we add the action column
    if (!this.resourceSelectable) {
      this.columns.push('action');
    }

    // bulk operations (e.g. bulk add tags) are only relevant on the full page resource list
    this.bulkEnabled = this.fullPageSearch && !this.resourceSelectable;

    const searchConfig: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiResourceSearch.getSearchForm,
      advancedFormClass: LiResourceSearchFields,
      savedSearch: this.savedSearches(),
      advancedFormManager: {
        config: LiResourceSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'creation', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(this.resourceService.getAdvancedSearchFunction(), 20, {
      initFirstPage: false,
    });

    this.searchState.init(searchConfig, this.datasource);
    if (this.defaultFilters) {
      this.searchState.advancedSearchFormGroup.patchValue(this.defaultFilters);
    }
    if (this.disabledFilters) {
      Object.entries(this.disabledFilters).forEach(([key, value]) => {
        if (value === true) {
          this.searchState.advancedSearchFormGroup.controls[key]?.disable();
        }
      });
    }
    this.listenToUploadAction();
  }

  selectResource(resource: LiResource): void {
    this.resourceSelected.next(resource);
  }

  private openBulkTagsDialog(context: FlBulkActionContext): void {
    if (!context.selectedIds.length) return;
    const data: LiBulkManageEntityTagsDialogInput = {
      entityType: 'RESOURCE',
      entityIds: context.selectedIds,
    };
    this.dialogService.openMediumDialog(LiBulkManageEntityTagsDialogComponent, { data: data });
  }

  searchOnTag(tag: FlTag): void {
    const tags = this.searchState.advancedSearchFormGroup.value.tags ?? [];
    const newTags = [...tags, tag];
    const search: Partial<LiResourceSearchFields> = {
      tags: newTags,
    };
    this.searchState.patchFormValueAndCallSearch(search);
  }

  //////////////////////////// FILE ///////////////////////

  onFileDrop(event: FlDropEvent): void {
    const items = event.event.dataTransfer?.items;
    if (items == null) return;

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry?.isDirectory) {
        this.snackBarService.openErrorMessage('li.drop_folder_error');
        return;
      }
    }

    if (event.files == null) return;
    this.openUploadFiles(event.files);
  }

  openUploadFiles(fileEvent: File | File[]): void {
    this.uploadFsNode(fileEvent, 'files');
  }

  openUploadFolder(fileEvent: File | File[]): void {
    if (Array.isArray(fileEvent) && fileEvent.length >= 1000) {
      this.snackBarService.openErrorMessage({
        text: 'li.upload_folder_too_many_file_error',
        translateText: true,
        translateParam: { param: { maxFiles: 1000 } },
      });
      return;
    }
    this.uploadFsNode(fileEvent, 'filesOrFolder');
  }

  private uploadFsNode(fileEvent: File | File[], selectedNodes: LiFsNodeTypesSelectionDialogMode): void {
    const files: File[] = ClHelpService.convertObjectOrArrayToArray(fileEvent);
    if (files.length === 0) {
      return;
    }

    const data: LiFsNodeTypesSelectionDialogInput = {
      dialogMode: selectedNodes,
      filenames: files.map((file) => file.name),
    };
    this.dialogService
      .openSmallDialog(LiFsNodeTypesSelectionDialogComponent, { data: data })
      .afterClosed()
      .subscribe({
        next: (result) => this.onUploadFsNodeClosed(result, files),
      });
  }

  private onUploadFsNodeClosed(result: LiFsNodeTypesSelectionDialogResult, files: File[]): void {
    if (result == null) return;

    // check there is enough disk space before starting the upload. This is a snapshot,
    // the disk can still fill up between the check and the end of the upload, so the
    // backend upload error handling remains the fallback.
    const totalSize: number = files.reduce((sum, file) => sum + file.size, 0);
    this.monitorService.checkUploadSpace(totalSize).subscribe((check) => {
      if (!check.hasEnoughSpace) {
        this.snackBarService.openErrorMessage({
          text: 'li.upload_not_enough_space_error',
          translateText: true,
          translateParam: {
            param: {
              fileSize: FlFileHelper.getFileSizeText(check.fileSize),
              requiredSpace: FlFileHelper.getFileSizeText(check.requiredDiskFreeSpace),
              diskUsageFree: FlFileHelper.getFileSizeText(check.diskUsageFree),
            },
          },
        });
        return;
      }

      if (result.uploadMode === 'files') {
        this.uploadFiles(result.fileTypingNames, files);
      } else {
        this.uploadFolder(result.folderTypingName, files);
      }
    });
  }

  private uploadFiles(fileTypingNames: string[], files: File[]): void {
    for (let i = 0; i < fileTypingNames.length; i++) {
      const action: FlPortalAction = {
        text: {
          text: 'li.uploading_file',
          translateText: true,
          translateParam: { param: { name: files[i].name } },
        },
        processingMessage: {
          text: 'li.processing_file',
          translateText: true,
          translateParam: { param: { name: files[i].name } },
        },
        type: LiFileResourceService.uploadFileActon,
        action: this.fileResourceService.uploadFile(files[i], fileTypingNames[i]),
        trackHttpEvents: true,
        successLink: (result) => LiRouterService.getResourceDetailRoute(result.id),
      };

      this.actionsService.addAction(action);
    }
  }

  private uploadFolder(folderTypingName: string, files: File[]): void {
    const action: FlPortalAction = {
      text: { text: 'li.uploading_folder', translateText: true },
      processingMessage: {
        text: 'li.processing_folder',
        translateText: true,
      },
      type: LiFileResourceService.uploadFileActon,
      action: this.fileResourceService.uploadFolder(folderTypingName, files),
      trackHttpEvents: true,
    };

    this.actionsService.addAction(action);
  }

  public listenToUploadAction(): void {
    this.actionSubscription = this.actionsService
      .getResult$(LiFileResourceService.uploadFileActon)
      .subscribe((result) => {
        if (result.status == 'success') {
          this.datasource.addItem(ClCoreJsonConvert.deserialize(result.result, LiResource), () => true);
        }
      });
  }

  private savedSearches(): FlSavedSearch[] {
    const savedSearchCloned: FlSavedSearch[] = ClHelpService.deepClone(this.getSavedSearch());
    const customSavedSearches = this.customSavedSearches;
    if (customSavedSearches != null && customSavedSearches.length > 0) {
      // if one of the custom saved search is the default one, we override the default
      if (customSavedSearches.some((search) => search.default)) {
        savedSearchCloned.forEach((search) => (search.default = false));
      }

      // add the custom search to the list
      savedSearchCloned.unshift(...customSavedSearches);
    }

    return savedSearchCloned;
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [
      {
        searchName: LI_RESOURCE_SEARCH_NAME,
        id: 'flagged-resources',
        label: 'Flagged resources',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<LiResourceSearchFields>,
      },
      {
        searchName: LI_RESOURCE_SEARCH_NAME,
        id: 'all-resources',
        label: 'All resources',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { includeNotFlagged: true } as Partial<LiResourceSearchFields>,
      },
    ];
  }

  openImportFromUrlDialog(): void {
    const data: LiQuickConfigureProcessDialogInput = {
      title: 'li.import_resource_from_link',
      helpText: 'li.import_from_link_help',
      specs$: this.resourceService.getImportResourceConfigSpecs(),
    };

    this.dialogService
      .openMediumDialog(LiQuickConfigureProcessDialogComponent, { data: data })
      .afterClosed()
      .subscribe((configValues) => this.onImportFromUrlClosed(configValues));
  }

  private onImportFromUrlClosed(configValues: TdParamSpecsValues): void {
    if (configValues) {
      this.actionsService.addAction({
        type: 'import-resource',
        action: this.resourceService.importResourceFromLink(configValues),
        text: { text: 'li.downloading_resource', translateText: true },
        successLink: (resource: LiResource) => LiRouterService.getResourceDetailRoute(resource.id),
      });

      this.snackBarService.openSuccessMessage(
        { text: 'li.downloading_resource_help_text', translateText: true },
        5000
      );
    }
  }

  ngOnDestroy(): void {
    this.actionSubscription?.unsubscribe();
  }
}
