import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-server-cloud-search-form',
  templateUrl: './ca-server-cloud-search-form.component.html',
  styleUrls: ['./ca-server-cloud-search-form.component.scss'],
  standalone: false,
})
export class CaServerCloudSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
