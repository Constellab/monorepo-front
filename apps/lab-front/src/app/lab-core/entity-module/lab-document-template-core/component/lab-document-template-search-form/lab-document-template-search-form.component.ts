import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-document-template-search-form',
  templateUrl: './lab-document-template-search-form.component.html',
  styleUrls: ['./lab-document-template-search-form.component.scss'],
})
export class LabDocumentTemplateSearchFormComponent implements OnInit {


  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {
  }

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
