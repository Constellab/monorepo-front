import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
    selector: 'lab-note-search-form',
    templateUrl: './lab-note-search-form.component.html',
    styleUrls: ['./lab-note-search-form.component.scss'],
    standalone: false
})
export class LabNoteSearchFormComponent implements OnInit {
  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {}

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
