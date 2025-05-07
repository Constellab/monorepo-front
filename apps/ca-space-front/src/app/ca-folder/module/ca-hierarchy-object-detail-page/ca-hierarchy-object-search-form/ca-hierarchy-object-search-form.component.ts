import { Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import {
  CaHierarchyObjectInfo,
  caHierarchyObjectTypeInfos,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { debounceTime, merge, Observable, Subscription } from 'rxjs';
import { CaUser } from '../../../../ca-core/model/entities/ca-user.class';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { CaHierarchyObjectIconComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaUserListInlineComponent } from '../../../../ca-core/entity-module/ca-user-core/component/ca-user-list-inline/ca-user-list-inline.component';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaHierarchyObjectContext } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

export type CaHierarchyObjectSearchFormContext =
  | CaHierarchyObjectContext
  | {
      type: 'trash';
    };

/**
 * Form inside folder detail page to filter hierarchy objects of a folder
 */
@Component({
  selector: 'ca-hierarchy-object-search-form',
  templateUrl: './ca-hierarchy-object-search-form.component.html',
  styleUrl: './ca-hierarchy-object-search-form.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatPrefix,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    CaHierarchyObjectIconComponent,
    CaUserListInlineComponent,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaHierarchyObjectSearchFormComponent implements OnInit, OnDestroy {
  context = input.required<CaHierarchyObjectSearchFormContext>();
  users$ = input<Observable<CaUser[]>>();

  private routerService = inject(CaRouterService);
  private translateService = inject(FlTranslateService);

  nameLabel = computed(() => {
    const context = this.context();
    if (context == null) return '';
    if (context.type === 'trash') {
      return this.translateService.translate('search_in_trash');
    } else if (context.hierarchyObject) {
      return this.translateService.translate('search_in_folder', {
        param: { name: context.hierarchyObject.name },
      });
    } else {
      return this.translateService.translate('search_in_all_folders');
    }
  });

  showObjectType = computed(() => this.context()?.type !== 'rootFolders');

  private searchState = inject(FlSearchState);
  formGp: UntypedFormGroup;

  objectTypes = caHierarchyObjectTypeInfos;

  private subscription: Subscription;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
    this.subscription = merge(
      this.formGp.get('objectType').valueChanges,
      this.formGp.get('users').valueChanges
    )
      .pipe(debounceTime(300))
      .subscribe(() => this.submit());
  }

  async submit(): Promise<void> {
    if (this.formGp.valid) {
      const context = this.context();
      if (context.type === 'rootFolders') {
        // in root folders, the search redirect to global search
        // and we trigger the search
        this.routerService.navigateToFolderSearch().then(() => this.searchState.submitForm());
      } else {
        this.searchState.submitForm();
      }
    }
  }

  typeIsSelected(): boolean {
    return !!this.formGp.get('objectType').value;
  }

  getSelectedTypeLabel(): CaHierarchyObjectInfo {
    const value = this.formGp.get('objectType').value;
    return value ? (this.objectTypes as any)[value] : null;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
