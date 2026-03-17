import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { LiCredentialsType } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-credentials-search-form',
  templateUrl: './li-credentials-search-form.component.html',
  styleUrls: ['./li-credentials-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiCredentialsSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  credentialsTypes = LiCredentialsType;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
