import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {FlSearchState} from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-report-search-form',
  templateUrl: './lab-report-search-form.component.html',
  styleUrls: ['./lab-report-search-form.component.scss']
})
export class LabReportSearchFormComponent implements OnInit {

  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {
  }

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }

  callSearch(): void {
    this.searchState.callAdvancedSearchFromForm();
  }

}
