import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
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
import { MatSelect } from '@angular/material/select';
import { LabScenarioStatusOptionsComponent } from '../lab-scenario-status-options/lab-scenario-status-options.component';
import { LabScenarioCreationTypeOptionsComponent } from '../lab-scenario-creation-type-options/lab-scenario-creation-type-options.component';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { LabSelectTypeComponent } from '../../../lab-type-core/component/lab-select-type/lab-select-type.component';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-scenario-search-form',
  templateUrl: './lab-scenario-search-form.component.html',
  styleUrls: ['./lab-scenario-search-form.component.scss'],
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
    LabFolderSelectComponent,
    LabTagFiltersComponent,
    MatExpansionPanelTitle,
    MatSelect,
    LabScenarioStatusOptionsComponent,
    LabScenarioCreationTypeOptionsComponent,
    FlFormModule,
    FlUserModule,
    LabSelectTypeComponent,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class LabScenarioSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
