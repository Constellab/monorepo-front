import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FlDatasourcePaginated,
  FlEntityPaginatedDatasource,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlDragModule, FlDropEvent } from '@monorepo/front-core-lib/fl-drag';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { LabResourceSearch, LabResourceSearchFields } from '../../model/lab-resource-search.class';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import {
  LabFsNodeTypesSelectionDialogComponent,
  LabFsNodeTypesSelectionDialogInput,
  LabFsNodeTypesSelectionDialogMode,
  LabFsNodeTypesSelectionDialogResult,
} from '../lab-fs-node-types-selection-dialog/lab-fs-node-types-selection-dialog.component';
import { ClCoreJsonConvert, ClHelpService } from '@monorepo/core-lib';
import { Subscription } from 'rxjs';
import { LabFileResourceService } from '../../../../entity-service/lab-file-resource.service';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  LabQuickConfigureProcessDialogComponent,
  LabQuickConfigureProcessDialogInput,
} from '../../../lab-process-core/component/lab-quick-configure-process-dialog/lab-quick-configure-process-dialog.component';
import { PrConfigValues } from '@monorepo/protocol';
import { LabResourceSearchFormComponent } from '../lab-resource-search-form/lab-resource-search-form.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { LabResourceTableComponent } from '../lab-resource-table/lab-resource-table.component';
import { TranslatePipe } from '@ngx-translate/core';

export const labResourceSearchName: string = 'biox-resource';

/**
 * Complete component to search on resource. It supports a select mode and manage file upload.
 */
@Component({
  selector: 'lab-resource-search',
  templateUrl: './lab-resource-search.component.html',
  styleUrls: ['./lab-resource-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    FlDragModule,
    LabResourceSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInputFileModule,
    MatTooltip,
    MatIconButton,
    LabResourceTableComponent,
    TranslatePipe,
  ],
})
export class LabResourceSearchComponent implements OnInit, OnDestroy {
  @Input() resourceSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  /**
   * Use to add custom searches in the list of saved search. If one of them is the default one,
   * it overrides the other default.
   */
  @Input() customSavedSearches: FlSavedSearch[] = null;

  @Output() resourceSelected: EventEmitter<LabResource> = new EventEmitter<LabResource>();

  datasource: FlDatasourcePaginated<LabResource>;

  columns: FlTableColumnStatic<LabResource>[];

  files: File[];

  private actionSubscription: Subscription;

  private searchState = inject(FlSearchState);
  private dialogService = inject(FlDialogService);
  private actionsService = inject(FlPortalActionsService);
  private fileResourceService = inject(LabFileResourceService);
  private resourceService = inject(LabResourceService);
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

    const searchConfig: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabResourceSearch.getSearchForm,
      advancedFormClass: LabResourceSearchFields,
      savedSearch: this.savedSearches(),
      advancedFormManager: {
        config: LabResourceSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'creation', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(this.resourceService.getAdvancedSearchFunction(), 20, {
      initFirstPage: false,
    });

    this.searchState.init(searchConfig, this.datasource);
    this.listenToUploadAction();
  }

  selectResource(resource: LabResource): void {
    this.resourceSelected.next(resource);
  }

  searchOnTag(tag: FlTag): void {
    const tags = this.searchState.advancedSearchFormGroup.value.tags ?? [];
    const newTags = [...tags, tag];
    const search: Partial<LabResourceSearchFields> = {
      tags: newTags,
    };
    this.searchState.patchFormValueAndCallSearch(search);
  }

  //////////////////////////// FILE ///////////////////////

  onFileDrop(event: FlDropEvent): void {
    const items = event.event.dataTransfer.items;
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry.isDirectory) {
        this.snackBarService.openErrorMessage('databox.drop_folder_error');
        return;
      }
    }
    this.openUploadFiles(event.files);
  }

  openUploadFiles(fileEvent: File | File[]): void {
    this.uploadFsNode(fileEvent, 'files');
  }

  openUploadFolder(fileEvent: File | File[]): void {
    if (Array.isArray(fileEvent) && fileEvent.length >= 1000) {
      this.snackBarService.openErrorMessage({
        text: 'databox.upload_folder_too_many_file_error',
        translateText: true,
        translateParam: { param: { maxFiles: 1000 } },
      });
      return;
    }
    this.uploadFsNode(fileEvent, 'filesOrFolder');
  }

  private uploadFsNode(fileEvent: File | File[], selectedNodes: LabFsNodeTypesSelectionDialogMode): void {
    const files: File[] = ClHelpService.convertObjectOrArrayToArray(fileEvent);
    if (files.length === 0) {
      return;
    }

    const data: LabFsNodeTypesSelectionDialogInput = {
      dialogMode: selectedNodes,
      filenames: files.map((file) => file.name),
    };
    this.dialogService
      .openSmallDialog(LabFsNodeTypesSelectionDialogComponent, { data: data })
      .afterClosed()
      .subscribe({
        next: (result) => this.onUploadFsNodeClosed(result, files),
      });
  }

  private onUploadFsNodeClosed(result: LabFsNodeTypesSelectionDialogResult, files: File[]): void {
    if (result == null) return;
    if (result.uploadMode === 'files') {
      this.uploadFiles(result.fileTypingNames, files);
    } else {
      this.uploadFolder(result.folderTypingName, files);
    }
  }

  private uploadFiles(fileTypingNames: string[], files: File[]): void {
    for (let i = 0; i < fileTypingNames.length; i++) {
      const action: FlPortalAction = {
        text: { text: files[i].name, translateText: false },
        type: LabFileResourceService.uploadFileActon,
        action: this.fileResourceService.uploadFile(files[i], fileTypingNames[i]),
        trackHttpEvents: true,
        successLink: (result) => LabRouterService.getResourceDetailRoute(result.id),
      };

      this.actionsService.addAction(action, false);
    }
  }

  private uploadFolder(folderTypingName: string, files: File[]): void {
    const action: FlPortalAction = {
      text: { text: 'databox.uploading_folder', translateText: true },
      type: LabFileResourceService.uploadFileActon,
      action: this.fileResourceService.uploadFolder(folderTypingName, files),
      trackHttpEvents: true,
    };

    this.actionsService.addAction(action, false);
  }

  public listenToUploadAction(): void {
    this.actionSubscription = this.actionsService
      .getResult$(LabFileResourceService.uploadFileActon)
      .subscribe((result) => {
        if (result.status == 'success') {
          this.datasource.addItem(ClCoreJsonConvert.deserialize(result.result, LabResource), () => true);
        }
      });
  }

  private savedSearches(): FlSavedSearch[] {
    const savedSearchCloned: FlSavedSearch[] = ClHelpService.deepClone(this.getSavedSearch());
    if (this.customSavedSearches?.length > 0) {
      // if one of the custom saved search is the default one, we override the default
      if (this.customSavedSearches.some((search) => search.default)) {
        savedSearchCloned.forEach((search) => (search.default = false));
      }

      // add the custom search to the list
      savedSearchCloned.unshift(...this.customSavedSearches);
    }

    return savedSearchCloned;
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [
      {
        searchName: labResourceSearchName,
        id: 'flagged-resources',
        label: 'Flagged resources',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<LabResourceSearchFields>,
      },
      {
        searchName: labResourceSearchName,
        id: 'all-resources',
        label: 'All resources',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { includeNotFlagged: true } as Partial<LabResourceSearchFields>,
      },
    ];
  }

  openImportFromUrlDialog(): void {
    const data: LabQuickConfigureProcessDialogInput = {
      title: 'biox.import_resource_from_link',
      helpText: 'biox.import_from_link_help',
      specs$: this.resourceService.getImportResourceConfigSpecs(),
    };

    this.dialogService
      .openMediumDialog(LabQuickConfigureProcessDialogComponent, { data: data })
      .afterClosed()
      .subscribe((configValues) => this.onImportFromUrlClosed(configValues));
  }

  private onImportFromUrlClosed(configValues: PrConfigValues): void {
    if (configValues) {
      this.actionsService.addAction(
        {
          type: 'import-resource',
          action: this.resourceService.importResourceFromLink(configValues),
          text: { text: 'biox.downloading_resource', translateText: true },
          successLink: (resource: LabResource) => LabRouterService.getResourceDetailRoute(resource.id),
        },
        false
      );

      this.snackBarService.openSuccessMessage(
        { text: 'biox.downloading_resource_help_text', translateText: true },
        5000
      );
    }
  }

  ngOnDestroy(): void {
    this.actionSubscription?.unsubscribe();
  }
}
