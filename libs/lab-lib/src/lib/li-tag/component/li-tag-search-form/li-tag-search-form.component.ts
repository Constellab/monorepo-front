import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  LiTagValueFormatOptionsComponent
} from '../li-tag-value-format-options/li-tag-value-format-options.component';

@Component({
  selector: 'li-tag-search-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    TranslatePipe,
    MatInput,
    MatLabel,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    FlTextIconModule,
    FlSearchModule,
    MatCheckbox,
    MatSelect,
    LiTagValueFormatOptionsComponent,
    MatIcon
  ],
  templateUrl: './li-tag-search-form.component.html',
  styleUrl: './li-tag-search-form.component.scss',
})
export class LiTagSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
