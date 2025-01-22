import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { LabSelectScenarioComponent } from '../../../lab-scenario-core/component/lab-select-scenario/lab-select-scenario.component';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { LabFolderSelectComponent } from '../../../lab-folder-core/component/lab-folder-select/lab-folder-select.component';
import { LabTagFiltersComponent } from '../../../lab-tag-core/component/lab-tag-filters/lab-tag-filters.component';
import { LabSelectTypeComponent } from '../../../lab-type-core/component/lab-select-type/lab-select-type.component';
import { MatSelect } from '@angular/material/select';
import { LabResourceOriginOptionsComponent } from '../lab-resource-origin-options/lab-resource-origin-options.component';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Work within the lab-resource-search and this manage the advanced search form
 */
@Component({
  selector: 'lab-resource-search-form',
  templateUrl: './lab-resource-search-form.component.html',
  styleUrls: ['./lab-resource-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlFormModule,
    LabSelectScenarioComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LabFolderSelectComponent,
    LabTagFiltersComponent,
    MatExpansionPanelTitle,
    LabSelectTypeComponent,
    MatSelect,
    LabResourceOriginOptionsComponent,
    FlUserModule,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class LabResourceSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
