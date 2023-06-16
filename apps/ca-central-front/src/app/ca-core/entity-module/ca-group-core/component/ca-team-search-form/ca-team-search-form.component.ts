import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {FlSearchState} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-team-search-form',
  templateUrl: './ca-team-search-form.component.html',
  styleUrls: ['./ca-team-search-form.component.scss'],
})
export class CaTeamSearchFormComponent implements OnInit {

  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {
  }

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
