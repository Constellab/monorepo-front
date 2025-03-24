import { Component, inject, OnInit } from '@angular/core';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { HaBrick, HaBrickVisibility } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { CoCommunityLibModule } from '@monorepo/community-lib';

@Component({
  selector: 'ha-admin-panel-bricks-search-form',
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    TranslatePipe,
    MatInput,
    MatSelect,
    MatOption,
    FlSearchModule,
    CoCommunityLibModule,
  ],
  templateUrl: './ha-admin-panel-bricks-search-form.component.html',
  styleUrl: './ha-admin-panel-bricks-search-form.component.scss',
})
export class HaAdminPanelBricksSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<HaBrick>>(FlSearchState);

  formGp: UntypedFormGroup;

  visibilityOptions = Object.values(HaBrickVisibility);

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
