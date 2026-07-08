import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';

import { MA_MAIL_STATUS_DICT } from '../../models/ma-mail.entity';

@Component({
  selector: 'ma-mail-search-form',
  templateUrl: './ma-mail-search-form.component.html',
  styleUrl: './ma-mail-search-form.component.scss',
  standalone: false,
})
export class MaMailSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  statuses = MA_MAIL_STATUS_DICT;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
