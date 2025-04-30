import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlUserConfigSearchNameMode, FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { caLabServerTaskStatusDict, caLabStatusDict } from '../../../../model/entities/lab/ca-lab.class';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { CaSelectSpaceComponent } from '../../../ca-space-core/component/ca-select-space/ca-select-space.component';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { CaSelectOptionsCityComponent } from '../../../ca-config-core/component/ca-select-city-options/ca-select-options-city.component';
import { CaSelectServerCloudOptionsComponent } from '../../../ca-server-core/component/ca-select-server-cloud-options/ca-select-server-cloud-options.component';
import { CaSelectServerStandardOptionsComponent } from '../../../ca-server-core/component/ca-select-server-standard-options/ca-select-server-standard-options.component';
import { MatIcon } from '@angular/material/icon';
import { CaSelectCloudProviderOptionsComponent } from '../../../ca-cloud-provider-core/component/ca-select-cloud-provider-options/ca-select-cloud-provider-options.component';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export type CaLabSearchMode = 'all' | 'current-space';

@Component({
  selector: 'ca-lab-search-form',
  templateUrl: './ca-lab-search-form.component.html',
  styleUrls: ['./ca-lab-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlFormModule,
    CaSelectSpaceComponent,
    MatSelect,
    MatOption,
    CaSelectOptionsCityComponent,
    CaSelectServerCloudOptionsComponent,
    CaSelectServerStandardOptionsComponent,
    MatIcon,
    CaSelectCloudProviderOptionsComponent,
    FlUserModule,
    FlSearchModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  @Input() mode: CaLabSearchMode;

  formGp: UntypedFormGroup;

  status = caLabStatusDict;
  serverTaskStatus = caLabServerTaskStatusDict;

  selectUserMode: FlUserConfigSearchNameMode;

  filter = new FormControl();

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
    this.selectUserMode = this.mode === 'all' ? 'all' : 'space';
  }
}
