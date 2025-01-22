import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-scenario-template-search-form',
  templateUrl: './lab-scenario-template-search-form.component.html',
  styleUrls: ['./lab-scenario-template-search-form.component.scss'],
  standalone: false,
})
export class LabScenarioTemplateSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
