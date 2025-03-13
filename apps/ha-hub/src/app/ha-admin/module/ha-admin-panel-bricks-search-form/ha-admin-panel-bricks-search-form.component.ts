import { Component, inject, OnInit } from '@angular/core';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { HaBrick, HaBrickVisibility } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CoCommunityLibModule } from '@monorepo/community-lib';

@Component({
  selector: 'ha-admin-panel-bricks-search-form',
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    TranslatePipe,
    MatInput,
    MatSelect,
    MatOption,
    FlSearchModule,
    AsyncPipe,
    CoCommunityLibModule,
  ],
  templateUrl: './ha-admin-panel-bricks-search-form.component.html',
  styleUrl: './ha-admin-panel-bricks-search-form.component.scss',
})
export class HaAdminPanelBricksSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<HaBrick>>(FlSearchState);
  private spaceService = inject(HaSpaceService);

  formGp: UntypedFormGroup;

  visibilityOptions = Object.values(HaBrickVisibility);
  spaces$: Observable<HaSpace[]> = this.spaceService.getAll();

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
