import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { CaSelectCloudProviderOptionsComponent } from '../../../ca-cloud-provider-core/component/ca-select-cloud-provider-options/ca-select-cloud-provider-options.component';
import { CaSelectServerStandardOptionsComponent } from '../ca-select-server-standard-options/ca-select-server-standard-options.component';
import { CaSelectDiskTypeOptionsComponent } from '../ca-select-disk-type-options/ca-select-disk-type-options.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-server-cloud-search-form',
  templateUrl: './ca-server-cloud-search-form.component.html',
  styleUrls: ['./ca-server-cloud-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    CaSelectCloudProviderOptionsComponent,
    CaSelectServerStandardOptionsComponent,
    CaSelectDiskTypeOptionsComponent,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class CaServerCloudSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
