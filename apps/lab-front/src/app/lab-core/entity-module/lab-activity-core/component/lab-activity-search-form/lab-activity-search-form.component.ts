import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { ActivityObjectType, ActivityType } from '../../../../model/entities/lab-activity.entity';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-activity-search-form',
  templateUrl: './lab-activity-search-form.component.html',
  styleUrls: ['./lab-activity-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    FlFormModule,
    FlUserModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatSelect,
    MatOption,
    FlSearchModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
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
