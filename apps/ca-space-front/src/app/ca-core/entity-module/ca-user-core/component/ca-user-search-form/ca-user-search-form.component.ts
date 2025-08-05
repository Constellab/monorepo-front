import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { ClUserStatus } from '@monorepo/core-lib';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { TranslatePipe } from '@ngx-translate/core';

import { CaUserLicense } from '../../../../model/entities/ca-user.class';

@Component({
  selector: 'ca-user-search-form',
  templateUrl: './ca-user-search-form.component.html',
  styleUrls: ['./ca-user-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    FlCoreComponentModule,
    MatOption,
    FlSearchModule,
    TranslatePipe,
  ],
})
export class CaUserSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  statuses = Object.values(ClUserStatus);

  licenses = Object.values(CaUserLicense);

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
