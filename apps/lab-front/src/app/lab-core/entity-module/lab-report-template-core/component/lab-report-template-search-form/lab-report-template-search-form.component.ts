import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {FlSearchState} from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-report-template-search-form',
  templateUrl: './lab-report-template-search-form.component.html',
  styleUrls: ['./lab-report-template-search-form.component.scss'],
})
export class LabReportTemplateSearchFormComponent implements OnInit {


  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {
  }

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
