import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { ActivityObjectType, ActivityType } from '../../../../model/entities/lab-activity.entity';

@Component({
  selector: 'lab-activity-search-form',
  templateUrl: './lab-activity-search-form.component.html',
  styleUrls: ['./lab-activity-search-form.component.scss'],
  standalone: false,
})
export class LabActivitySearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  activityTypes = ActivityType;
  activityObjectTypes = ActivityObjectType;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
