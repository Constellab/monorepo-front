import { Component, Input, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { LabTypeSearchConfig } from '../../model/lab-type-search.class';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { LabBricksSelectOptionsComponent } from '../../../lab-brick-core/component/lab-bricks-select-options/lab-bricks-select-options.component';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-type-search-form',
  templateUrl: './lab-type-search-form.component.html',
  styleUrls: ['./lab-type-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    LabBricksSelectOptionsComponent,
    MatOption,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class LabTypeSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  @Input() config: LabTypeSearchConfig;

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }

  get showObjectSubTypeField(): boolean {
    return this.config.mode === 'process';
  }

  get showImporterIgnoreExtensionField(): boolean {
    return this.config.mode === 'importer';
  }
}
