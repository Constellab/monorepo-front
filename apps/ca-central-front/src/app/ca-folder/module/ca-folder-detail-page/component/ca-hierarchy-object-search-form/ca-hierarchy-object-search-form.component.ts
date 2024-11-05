import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { caHierarchyObjectTypeLabels } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { Observable } from 'rxjs';
import { CaUser } from '../../../../../ca-core/model/entities/ca-user.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';

/**
 * Form inside folder detail page to filter hierarchy objects of a folder
 */
@Component({
  selector: 'ca-hierarchy-object-search-form',
  templateUrl: './ca-hierarchy-object-search-form.component.html',
  styleUrl: './ca-hierarchy-object-search-form.component.scss',
})
export class CaHierarchyObjectSearchFormComponent implements OnInit {
  searchState = inject(FlSearchState);
  formGp: UntypedFormGroup;

  objectTypes = caHierarchyObjectTypeLabels;

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
