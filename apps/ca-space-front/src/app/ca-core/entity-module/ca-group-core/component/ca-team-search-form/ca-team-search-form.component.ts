import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-team-search-form',
  templateUrl: './ca-team-search-form.component.html',
  styleUrls: ['./ca-team-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlFormModule,
    FlUserModule,
    FlSearchModule,
    TranslatePipe,
  ],
})
export class CaTeamSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
