import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-team-search-form',
  templateUrl: './ca-team-search-form.component.html',
  styleUrls: ['./ca-team-search-form.component.scss'],
  standalone: false,
})
export class CaTeamSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
