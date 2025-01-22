import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { CaSpaceType } from '../../../../model/entities/space/ca-space.class';

@Component({
  selector: 'ca-space-search-form',
  templateUrl: './ca-space-search-form.component.html',
  styleUrls: ['./ca-space-search-form.component.scss'],
  standalone: false,
})
export class CaSpaceSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  spaceTypes: CaSpaceType[] = ['PERSONAL', 'ENTREPRISE'];

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
