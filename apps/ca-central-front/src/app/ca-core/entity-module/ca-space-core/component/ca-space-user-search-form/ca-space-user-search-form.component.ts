import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { CaSpaceRole } from '../../../../model/entities/space/ca-space-user.class';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-space-user-search-form',
  templateUrl: './ca-space-user-search-form.component.html',
  styleUrls: ['./ca-space-user-search-form.component.scss'],
  standalone: false,
})
export class CaSpaceUserSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  userRoles = CaSpaceRole;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
