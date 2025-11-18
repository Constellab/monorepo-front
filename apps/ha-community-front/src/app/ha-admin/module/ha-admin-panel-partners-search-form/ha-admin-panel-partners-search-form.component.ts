import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { TranslatePipe } from '@ngx-translate/core';

import { HaPartner } from '../../../ha-core/ha-model/ha-entities/ha-partner';

@Component({
  selector: 'ha-admin-panel-partners-search-form',
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    TranslatePipe,
    MatInput,
    FlSearchModule,
    CoCommunityLibModule,
    MatCheckbox,
  ],
  templateUrl: './ha-admin-panel-partners-search-form.component.html',
  styleUrl: './ha-admin-panel-partners-search-form.component.scss',
})
export class HaAdminPanelPartnersSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<HaPartner>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
