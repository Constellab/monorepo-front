import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CA_HIERARCHY_OBJECT_TYPE_INFO,
  CaHierarchyObjectInfo,
} from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectIconComponent } from '../ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';

@Component({
  selector: 'ca-hierarchy-object-admin-search-form',
  templateUrl: './ca-hierarchy-object-admin-search-form.component.html',
  styleUrls: ['./ca-hierarchy-object-admin-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlFormModule,
    FlUserModule,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
    CaHierarchyObjectIconComponent,
    FlCorePipeModule,
    MatOption,
    MatSelect,
    MatSelectTrigger,
  ],
})
export class CaHierarchyObjectAdminSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;
  objectTypes = CA_HIERARCHY_OBJECT_TYPE_INFO;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }

  typeIsSelected(): boolean {
    return !!this.formGp.get('objectType').value;
  }

  getSelectedTypeLabel(): CaHierarchyObjectInfo {
    const value = this.formGp.get('objectType').value;
    return value ? (this.objectTypes as any)[value] : null;
  }
}
