import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-folder-search-form',
  templateUrl: './ca-folder-search-form.component.html',
  styleUrls: ['./ca-folder-search-form.component.scss'],
})
export class CaFolderSearchFormComponent implements OnInit {
  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {}

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
