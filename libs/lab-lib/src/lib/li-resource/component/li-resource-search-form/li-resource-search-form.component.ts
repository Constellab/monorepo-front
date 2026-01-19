import { Component, inject, input, OnInit } from '@angular/core';
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
import { MatSelect } from '@angular/material/select';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiFolderSelectComponent } from '@monorepo/lab-lib/li-folder';
import { LiSelectScenarioComponent } from '@monorepo/lab-lib/li-scenario';
import { LiTableColumnsTagFilterComponent, LiTagFiltersComponent } from '@monorepo/lab-lib/li-tag';
import { LiSelectTypeComponent } from '@monorepo/lab-lib/li-type';
import { TranslatePipe } from '@ngx-translate/core';

import { LiResourceOriginOptionsComponent } from '../li-resource-origin-options/li-resource-origin-options.component';

/**
 * Work within the li-resource-search and this manage the advanced search form
 */
@Component({
  selector: 'li-resource-search-form',
  templateUrl: './li-resource-search-form.component.html',
  styleUrls: ['./li-resource-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlFormModule,
    LiSelectScenarioComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LiFolderSelectComponent,
    LiTagFiltersComponent,
    MatExpansionPanelTitle,
    LiSelectTypeComponent,
    MatSelect,
    LiResourceOriginOptionsComponent,
    FlUserModule,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
    LiTableColumnsTagFilterComponent,
  ],
})
export class LiResourceSearchFormComponent implements OnInit {
  mode = input<'resource' | 'app'>('resource');

  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
