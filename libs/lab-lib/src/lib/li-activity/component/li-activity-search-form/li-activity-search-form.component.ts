import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { ActivityObjectType, ActivityType } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-activity-search-form',
  templateUrl: './li-activity-search-form.component.html',
  styleUrls: ['./li-activity-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class LiActivitySearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  activityTypes = ActivityType;
  activityObjectTypes = ActivityObjectType;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
