import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { CaActivityEntityType, CaActivityType } from '../../../../model/entities/ca-activity.class';

@Component({
  selector: 'ca-activity-search-form',
  templateUrl: './ca-activity-search-form.component.html',
  styleUrls: ['./ca-activity-search-form.component.scss'],
  standalone: false,
})
export class CaActivitySearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  activityTypes: any = CaActivityType;
  entityTypes: any = CaActivityEntityType;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
