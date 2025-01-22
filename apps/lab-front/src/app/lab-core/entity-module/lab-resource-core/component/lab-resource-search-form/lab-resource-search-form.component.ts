import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

/**
 * Work within the lab-resource-search and this manage the advanced search form
 */
@Component({
  selector: 'lab-resource-search-form',
  templateUrl: './lab-resource-search-form.component.html',
  styleUrls: ['./lab-resource-search-form.component.scss'],
  standalone: false,
})
export class LabResourceSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
