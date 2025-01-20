import { Component, OnInit } from '@angular/core';
import { FlFormInputsManagerConfig } from '../../../fl-form-inputs-manager/fl-form-inputs-manager.class';
import { FlSearchState } from '../../model/fl-search.state';
import { FormGroup } from '@angular/forms';

/**
 * Component to place under the {@link FlSearchComponent} and this contains the advanced search form
 */
@Component({
    selector: 'fl-search-advanced-form',
    templateUrl: './fl-search-advanced-form.component.html',
    styleUrls: ['./fl-search-advanced-form.component.scss'],
    standalone: false
})
export class FlSearchAdvancedFormComponent implements OnInit {
  formGp: FormGroup;

  formInputConfig: FlFormInputsManagerConfig;
  skipFalseBoolean: boolean;

  constructor(private searchState: FlSearchState<any>) {}

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
