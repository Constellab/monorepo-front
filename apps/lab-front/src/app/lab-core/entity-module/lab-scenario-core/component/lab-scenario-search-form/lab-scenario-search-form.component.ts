import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-scenario-search-form',
  templateUrl: './lab-scenario-search-form.component.html',
  styleUrls: ['./lab-scenario-search-form.component.scss'],
  standalone: false,
})
export class LabScenarioSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
