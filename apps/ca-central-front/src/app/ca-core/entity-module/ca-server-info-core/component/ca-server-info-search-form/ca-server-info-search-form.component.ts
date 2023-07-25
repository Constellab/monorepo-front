import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {FlSearchState} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-server-info-search-form',
  templateUrl: './ca-server-info-search-form.component.html',
  styleUrls: ['./ca-server-info-search-form.component.scss'],
})
export class CaServerInfoSearchFormComponent implements OnInit {
  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {
  }

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}

