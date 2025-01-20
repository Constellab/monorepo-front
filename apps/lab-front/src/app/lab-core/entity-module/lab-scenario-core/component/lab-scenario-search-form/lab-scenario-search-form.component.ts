import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
    selector: 'lab-scenario-search-form',
    templateUrl: './lab-scenario-search-form.component.html',
    styleUrls: ['./lab-scenario-search-form.component.scss'],
    standalone: false
})
export class LabScenarioSearchFormComponent implements OnInit {
  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {}

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
