import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { CaActivityEntityType, CaActivityType } from '../../../../model/entities/ca-activity.class';

@Component({
  selector: 'ca-activity-search-form',
  templateUrl: './ca-activity-search-form.component.html',
  styleUrls: ['./ca-activity-search-form.component.scss'],
})
export class CaActivitySearchFormComponent implements OnInit {
  formGp: UntypedFormGroup;

  activityTypes: any = CaActivityType;
  entityTypes: any = CaActivityEntityType;

  constructor(private searchState: FlSearchState<any>) {}

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
