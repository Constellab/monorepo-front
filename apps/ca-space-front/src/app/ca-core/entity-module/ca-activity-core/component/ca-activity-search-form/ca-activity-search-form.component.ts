import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { CaActivityEntityType, CaActivityType } from '../../../../model/entities/ca-activity.class';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatCheckbox } from '@angular/material/checkbox';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

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
