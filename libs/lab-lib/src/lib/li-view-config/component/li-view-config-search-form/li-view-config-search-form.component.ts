import { ChangeDetectionStrategy,Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiFolderSelectComponent } from '@monorepo/lab-lib/li-folder';
import { LiTagFiltersComponent } from '@monorepo/lab-lib/li-tag';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiSelectViewTypeOptionsComponent } from '../li-select-view-type-options/li-select-view-type-options.component';

@Component({
  selector: 'li-view-config-search-form',
  templateUrl: './li-view-config-search-form.component.html',
  styleUrls: ['./li-view-config-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatSelectTrigger,
    TdTechnicalDocModule,
    LiSelectViewTypeOptionsComponent,
    MatInput,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LiFolderSelectComponent,
    LiTagFiltersComponent,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class LiViewConfigSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  @Input() showFolderFilter: boolean = true;

  formGp: FormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
