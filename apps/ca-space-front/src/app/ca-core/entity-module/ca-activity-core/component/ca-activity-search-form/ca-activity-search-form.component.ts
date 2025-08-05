import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaActivityEntityType, CaActivityType } from '../../../../model/entities/ca-activity.class';

@Component({
  selector: 'ca-activity-search-form',
  templateUrl: './ca-activity-search-form.component.html',
  styleUrls: ['./ca-activity-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    FlFormModule,
    FlUserModule,
    FlSearchModule,
    MatCheckbox,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaActivitySearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  activityTypes: any = CaActivityType;
  entityTypes: any = CaActivityEntityType;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
