import { ChangeDetectionStrategy,Component, inject, Injector, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClHelpService } from '@monorepo/core-lib';
import {
  FlDatasourceGetPageFunction,
  FlEntityPaginatedDatasource,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogModule,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlSearchConfig, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaHierarchyObjectSearch,
  CaHierarchyObjectSearchFields,
} from '../../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-search.class';
import { CaHierarchyObjectTableComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectService } from '../../../../ca-core/service-api/ca-hierarchy-object.service';
import {
  CaHierarchyObjectActionBase,
  CaHierarchyObjectBaseActionMenu,
} from '../../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import {
  CaHierarchyObjectSearchFormComponent,
  CaHierarchyObjectSearchFormContext,
} from '../ca-hierarchy-object-search-form/ca-hierarchy-object-search-form.component';

export type CaHierarchyObjectTrashDialogInput =
  | {
      // All mode: all hierarchy objects in the trash accessible for the user
      mode: 'all';
    }
  | {
      // Folder mode: all hierarchy objects in the trash of the folder
      mode: 'folder';

      // folder id if mode is 'folder'
      folderId: string;
      folderName: string;
    };

@Component({
  selector: 'ca-hierarchy-object-trash-dialog',
  imports: [
    FlDialogModule,
    FlTextIconModule,
    CaHierarchyObjectSearchFormComponent,
    CaHierarchyObjectTableComponent,
    FlInfiniteScrollModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslatePipe,
    MatCheckbox,
    ReactiveFormsModule,
  ],
  templateUrl: './ca-hierarchy-object-trash-dialog.component.html',
  styleUrl: './ca-hierarchy-object-trash-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [FlSearchState],
})
export class CaHierarchyObjectTrashDialogComponent implements OnInit {
  input: CaHierarchyObjectTrashDialogInput = inject(MAT_DIALOG_DATA);

  private translateService = inject(FlTranslateService);
  private searchState = inject(FlSearchState);
  private injector = inject(Injector);
  private dialogRef = inject(MatDialogRef);
  private dialogService = inject(FlDialogService);
  private hierarchyObjectService = inject(CaHierarchyObjectService);

  formGp: UntypedFormGroup;

  title: string;
  hierarchyObjects: CaHierarchyObjectDatasource<CaHierarchyObjectSearchFields>;

  columns: FlTableColumnStatic<CaHierarchyObject>[] = [
    'name',
    'user',
    'lastModifiedAt',
    'tags',
    'customAction',
  ];

  context: CaHierarchyObjectSearchFormContext = { type: 'trash' };

  restoredObject: CaHierarchyObject[] = [];

  ngOnInit(): void {
    let getPageFunction: FlDatasourceGetPageFunction<CaHierarchyObject, CaHierarchyObjectSearchFields>;
    const input = this.input;
    if (input.mode === 'all') {
      this.title = this.translateService.translate('all_folder_trash');
      getPageFunction = (page, pageSize, requestData) => {
        return this.hierarchyObjectService.searchTrashInRootFoldersAndChildren(page, pageSize, requestData);
      };
    } else {
      this.title = this.translateService.translate('folder_trash', {
        param: { name: input.folderName },
      });
      getPageFunction = (page, pageSize, requestData) => {
        return this.hierarchyObjectService.searchTrashChildren(input.folderId, page, pageSize, requestData);
      };
    }
    this.hierarchyObjects = new FlEntityPaginatedDatasource<CaHierarchyObject, CaHierarchyObjectSearchFields>(
      getPageFunction,
      25,
      { initFirstPage: false }
    );

    // init the children search state
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaHierarchyObjectSearch.getSearchFormTrash,
      advancedFormClass: CaHierarchyObjectSearchFields,
      savedSearch: [],
      advancedFormManager: {
        config: {},
        skipFalseBoolean: true,
      },
      storeSearchInUrl: false,
      defaultSort: { key: 'lastModifiedAt', direction: 'DESC' },
      autoSearch: false,
    };
    this.searchState.init(config, this.hierarchyObjects);
    this.searchState.submitForm();
    this.formGp = this.searchState.advancedSearchFormGroup;

    this.dialogRef.backdropClick().subscribe(() => this.dialogRef.close(this.restoredObject));
  }

  openHierarchyObjectTrashMenu(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const hierarchyObjectBaseActionMenu = new CaHierarchyObjectBaseActionMenu(
      this.injector,
      hierarchyObject.id
    );

    hierarchyObjectBaseActionMenu.openTrashMenu(event).subscribe((event) => {
      this.onAction(event);
    });
  }

  private onAction(event: CaHierarchyObjectActionBase): void {
    if (event == null) return;

    switch (event.action) {
      case 'restoreFromTrash':
        this.hierarchyObjects.removeItemById(event.hierarchyObject.id);
        this.restoredObject.push(event.hierarchyObject);
        break;
      case 'delete':
        this.hierarchyObjects.removeItemById(event.hierarchyObjectId);
        break;
    }
  }

  emptyTrash(): void {
    const dialogInput = this.input;
    if (dialogInput.mode === 'all') return;
    const input: FlConfirmDialogInput = {
      title: 'empty_trash',
      content: 'empty_trash_confirmation',
      observable: this.hierarchyObjectService.emptyTrash(dialogInput.folderId),
      successMessage: 'trash_emptied',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onEmptyClosed(result));
  }

  private onEmptyClosed(result: FlConfirmDialogResult<void>): void {
    if (result.choice) {
      this.hierarchyObjects.getFirstPage();
    }
  }

  onIncludeSubObjectChange(): void {
    this.searchState.submitForm();
  }
}
