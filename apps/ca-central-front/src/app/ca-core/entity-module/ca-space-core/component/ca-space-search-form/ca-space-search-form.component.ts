import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { CaSpaceType } from '../../../../model/entities/space/ca-space.class';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-space-search-form',
  templateUrl: './ca-space-search-form.component.html',
  styleUrls: ['./ca-space-search-form.component.scss'],
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
    TranslatePipe,
  ],
})
export class CaSpaceSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  spaceTypes: CaSpaceType[] = ['PERSONAL', 'ENTREPRISE'];

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
