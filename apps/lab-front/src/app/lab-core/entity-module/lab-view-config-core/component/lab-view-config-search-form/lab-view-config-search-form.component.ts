import { Component, Input, OnInit, inject } from '@angular/core';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { LabSelectViewTypeOptionsComponent } from '../lab-select-view-type-options/lab-select-view-type-options.component';
import { MatInput } from '@angular/material/input';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LabFolderSelectComponent } from '../../../lab-folder-core/component/lab-folder-select/lab-folder-select.component';
import { LabTagFiltersComponent } from '../../../lab-tag-core/component/lab-tag-filters/lab-tag-filters.component';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-view-config-search-form',
  templateUrl: './lab-view-config-search-form.component.html',
  styleUrls: ['./lab-view-config-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatSelectTrigger,
    TdTechnicalDocModule,
    LabSelectViewTypeOptionsComponent,
    MatInput,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LabFolderSelectComponent,
    LabTagFiltersComponent,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class LabViewConfigSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  @Input() showFolderFilter: boolean = true;

  formGp: FormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
