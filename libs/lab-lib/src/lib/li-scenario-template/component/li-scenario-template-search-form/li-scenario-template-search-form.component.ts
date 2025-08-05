import { Component, inject,OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiTagFiltersComponent } from '@monorepo/lab-lib/li-tag';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-scenario-template-search-form',
  templateUrl: './li-scenario-template-search-form.component.html',
  styleUrls: ['./li-scenario-template-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    LiTagFiltersComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    FlTextIconModule,
    MatIcon,
    FlFormModule,
    FlUserModule,
    FlSearchModule,
    TranslatePipe,
  ],
})
export class LiScenarioTemplateSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
