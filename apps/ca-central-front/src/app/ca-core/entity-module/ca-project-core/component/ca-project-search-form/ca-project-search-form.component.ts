import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-project-search-form',
  templateUrl: './ca-project-search-form.component.html',
  styleUrls: ['./ca-project-search-form.component.scss']
})
export class CaProjectSearchFormComponent implements OnInit {

  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {
  }

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
