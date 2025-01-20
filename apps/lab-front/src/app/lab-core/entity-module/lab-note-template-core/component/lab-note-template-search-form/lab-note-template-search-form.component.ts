import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
    selector: 'lab-note-template-search-form',
    templateUrl: './lab-note-template-search-form.component.html',
    styleUrls: ['./lab-note-template-search-form.component.scss'],
    standalone: false
})
export class LabNoteTemplateSearchFormComponent implements OnInit {
  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {}

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
