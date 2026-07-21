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
import { MatSelect } from '@angular/material/select';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiFolderSelectComponent } from '@monorepo/lab-lib/li-folder';
import { LiTagFiltersComponent } from '@monorepo/lab-lib/li-tag';
import { LiSelectTypeComponent } from '@monorepo/lab-lib/li-type';
import { TranslatePipe } from '@ngx-translate/core';

import { LiScenarioCreationTypeOptionsComponent } from '../li-scenario-creation-type-options/li-scenario-creation-type-options.component';
import { LiScenarioStatusOptionsComponent } from '../li-scenario-status-options/li-scenario-status-options.component';

@Component({
  selector: 'li-scenario-search-form',
  templateUrl: './li-scenario-search-form.component.html',
  styleUrls: ['./li-scenario-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LiFolderSelectComponent,
    LiTagFiltersComponent,
    MatExpansionPanelTitle,
    MatSelect,
    LiScenarioStatusOptionsComponent,
    LiScenarioCreationTypeOptionsComponent,
    FlFormModule,
    FlUserModule,
    LiSelectTypeComponent,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class LiScenarioSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
