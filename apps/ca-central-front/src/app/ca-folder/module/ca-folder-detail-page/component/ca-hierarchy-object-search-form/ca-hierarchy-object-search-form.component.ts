import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import {
  caHierarchyObjectTypeInfos,
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { Observable } from 'rxjs';
import { CaUser } from '../../../../../ca-core/model/entities/ca-user.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CaHierarchyObjectIconComponent
} from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import {
  CaUserListInlineComponent
} from '../../../../../ca-core/entity-module/ca-user-core/component/ca-user-list-inline/ca-user-list-inline.component';

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
export class CaHierarchyObjectSearchFormComponent implements OnInit {
  searchState = inject(FlSearchState);
  formGp: UntypedFormGroup;

  objectTypes = caHierarchyObjectTypeInfos;

  users$: Observable<CaUser[]> = inject(CaFolderDetailState).getUsers().connect();

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }

  submit(): void {
    if (this.formGp.valid) {
      this.searchState.submitForm();
    }
  }

  typeIsSelected(): boolean {
    return !!this.formGp.get('objectType').value;
  }

  getSelectedTypeLabel(): string {
    const value = this.formGp.get('objectType').value;
    return value ? (this.objectTypes as any)[value] : null;
  }
}
