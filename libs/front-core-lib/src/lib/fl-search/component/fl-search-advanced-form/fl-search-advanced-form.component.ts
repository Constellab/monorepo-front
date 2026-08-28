import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';

import { FlSearchState } from '../../model/fl-search.state';

/**
 * Component to place under the {@link FlSearchComponent} and this contains the advanced search form
 */
@Component({
  selector: 'fl-search-advanced-form',
  templateUrl: './fl-search-advanced-form.component.html',
  styleUrls: ['./fl-search-advanced-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlSearchAdvancedFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: FormGroup;

  formInputConfig: FlFormInputsManagerConfig;
  skipFalseBoolean: boolean | undefined;

  ngOnInit(): void {
    const config = this.searchState.getConfig();
    this.formInputConfig = config.advancedFormManager.config;
    this.skipFalseBoolean = config.advancedFormManager.skipFalseBoolean;
    this.formGp = this.searchState.advancedSearchFormGroup;
  }

  submit(): void {
    if (this.formGp.valid) {
      this.searchState.submitForm();
    }
  }
}
