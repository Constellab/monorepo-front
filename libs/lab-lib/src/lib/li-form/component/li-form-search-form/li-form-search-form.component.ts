import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiTagFiltersComponent } from '@monorepo/lab-lib/li-tag';
import { TranslatePipe } from '@ngx-translate/core';

import { LiSelectFormTemplateComponent } from '../li-select-form-template/li-select-form-template.component';

@Component({
  selector: 'li-form-search-form',
  templateUrl: './li-form-search-form.component.html',
  styleUrl: './li-form-search-form.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    FlTextIconModule,
    MatIcon,
    LiTagFiltersComponent,
    FlFormModule,
    FlUserModule,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
    LiSelectFormTemplateComponent,
  ],
})
export class LiFormSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
