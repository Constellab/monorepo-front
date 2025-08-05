import { Component, inject,OnInit } from '@angular/core';
import { ReactiveFormsModule,UntypedFormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaSpaceRole } from '../../../../model/entities/space/ca-space-user.class';

@Component({
  selector: 'ca-space-user-search-form',
  templateUrl: './ca-space-user-search-form.component.html',
  styleUrls: ['./ca-space-user-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    FlFormModule,
    FlUserModule,
    FlSearchModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaSpaceUserSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  userRoles = CaSpaceRole;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
