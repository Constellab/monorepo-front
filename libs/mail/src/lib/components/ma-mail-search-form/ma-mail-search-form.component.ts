import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { maMailStatusDict } from '../../models/ma-mail.entity';

@Component({
    selector: 'ma-mail-search-form',
    templateUrl: './ma-mail-search-form.component.html',
    styleUrl: './ma-mail-search-form.component.scss',
    standalone: false
})
export class MaMailSearchFormComponent implements OnInit {
  formGp: UntypedFormGroup;

  statuses = maMailStatusDict;

  constructor(private searchState: FlSearchState<any>) {}

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
